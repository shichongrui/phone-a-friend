import * as messenger from './messenger'
import * as cache from '../models/cache'
import {socket} from './socket-io'

//var patterns = [
//  /localhost:3002.*\.jpg$/g,
//  /localhost:3002.*\.png$/g,
//  /localhost:3002.*\.gif$/g,
//  /localhost:3002.*\.svg$/g,
//  /localhost:3002.*\.js/g,
//  /localhost:3002.*\.css/g
//]
var patterns = [
  /\.jpg$/g
]

self.addEventListener('fetch', function (event) {
  event.respondWith(getResponse(event.request))
})

function getResponse(request) {
  console.log('Browser requested %s', request.url)

  var matches = patterns.some(function (pattern) {
    return pattern.test(request.url)
  })

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
      url: request.url
    }
  }

  var hashPromise = getHashForFile(request.url)

  console.log('Sending request for', req.data)
  return messenger.sendMessage(req).then(function (response) {
    cache.updateManifestForUser(peerId, response.data.manifest)

    console.log('hashing response for %s', request.url)
    return crypto.subtle.digest('SHA-1', response.data.file).then(function (responseHash) {
      var stringHash = ab2hex(responseHash)
      return hashPromise.then((hash) => {
        console.log('%s and %s do' + ((hash === stringHash) ? ' ' : 'n\'t') + 'match', hash, stringHash)
        if (hash === stringHash) {
          var blob = new Blob([response.data.file])
          cache.putFileInCache(request.url, response.data.file, stringHash)
          return new Response(blob, {
            'status': 200,
            'statusText': 'OK'
          })
        } else {
          return getResponseThroughFetch(request)
        }
      })
    })
  })
}

function getHashForFile (url) {
  return new Promise((resolve, reject) => {
    console.log('Asking socket server for hash for %s', url)
    socket.emit('hash', url, function (data) {
      console.log('Server said hash for %s is %s', url, data.hash)
      resolve(data.hash)
    })
  })
}

// convert from arraybuffer to hex
function ab2hex(ab) {
  var dv = new DataView(ab),
    i, len, hex = '',
    c;

  for (i = 0, len = dv.byteLength; i < len; i += 1) {
    c = dv.getUint8(i).toString(16);
    if (c.length < 2) {
      c = '0' + c;
    }
    hex += c;
  }

  return hex;
}
