import * as messenger from './messenger'
import * as cache from '../models/cache'
import minimatcher from './minimatcher'
import {socket} from './socket-io'

var patterns = [
  'http://localhost:3002/**/*.jpg',
  'http://localhost:3002/**/*.png',
  'http://localhost:3002/**/*.gif',
  'http://localhost:3002/**/*.js',
  'http://localhost:3002/**/*.css'
]


self.addEventListener('fetch', function (event) {
  event.respondWith(getResponse(event.request))
})

function getResponse(request) {
  console.log('Browser requested %s', request.url)

  var matches = minimatcher(request.url, patterns)

  if (!matches /*|| url.match('localhost:8081') !== null*/ ) {
    console.log('%s doesnt match any patterns', request.url)
    console.log('Not interfering with %s, move along', request.url)
    return getResponseThroughFetch(request, false)
  }

  return getResponseFromUser(request)
}

function getResponseThroughFetch(request, shouldCache = true) {
  return fetch(request).then((response) => {
    if (shouldCache) {
      cache.cacheResponse(response)
    }
    return response
  })
}

function getResponseFromUser(request) {
  return new Promise(function (resolve, reject) {
    var peerId = cache.getUserForFileFromManifest(request.url)
    if (peerId) {
      console.log('Asking socket server for hash for %s', request.url)
      resolve(getFileFromPeer(peerId, request))
    } else {
      console.log('No one we know of has %s', request.url)
      console.log('Asking socket server for user with %s', request.url)
      socket.emit('file', request.url, function (data) {
        if (!data.peerId) {
          console.log('No one has %s', request.url)
          console.log('Get %s through normal channels', request.url)
          resolve(getResponseThroughFetch(request))
        } else {
          console.log('%s has %s', data.peerId, request.url)
          resolve(getFileFromPeer(data.peerId, request))
        }
      })
    }
  })
}

function getFileFromPeer(peerId, request) {
  var req = {
    request: 'file-from-user',
    data: {
      peerId: peerId,
      url: request.url,
      includeManifest: cache.havePeerManifest(peerId)
    }
  }

  var hashPromise = cache.getHashForFile(request.url)
  console.log('Sending request for', req.data)
  var filePromise = messenger.sendMessage(req)

  return Promise.all([hashPromise, filePromise]).then(([hash, response]) => {
    if (req.data.includeManifest) {
      cache.updateManifestForUser(peerId, response.data.manifest)
    }

    return cache.isHash(hash, response.data.file).then((isValid) => {
      if (isValid) {
        var blob = new Blob([response.data.file])
        cache.putFileInCache(request.url, response.data.file, stringHash)
        return new Response(blob, {
          'status': 200,
          'statusText': 'OK'
        })
      } else {
        // tell the peer to clear that file from their manifest and ask for a new manifest
        var req = {
          request: 'remove-from-manifest',
          data: {
            url: request.url,
            peerId: peerId
          }
        }
        messenger.sendMessage(req)
        cache.removeManifestForUser(peerId)
        return getResponseThroughFetch(request)
      }
    })
  }).catch((error) => {
    return getResponseThroughFetch(request)
  })
}
