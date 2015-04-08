importScripts('http://localhost:8081/deferred.min.js')
importScripts('http://localhost:8080/socket.io/socket.io.js')

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

self.addEventListener('activate', function (event) {
  console.log('Service Worker is active')

  var socket = io.connect('//localhost:8080', {
    transports: ['websocket']
  })

  socket.on('peer-id', function(cb) {
    console.log('Received a request from socket server for an active peer id')
    sendMessage({
      request: 'peer-id'
    }).then(function(data) {
      console.log('Responding to socket server with peer id %s', data.data)
      cb(data.data)
    })
  })

  var readyDeferred = new Deferred()
  var readyPromise = new Promise(function (resolve, reject) {
    readyDeferred.then(function () {
      resolve()
    })
  })

  var files = {}
  var manifest = {}
  var peerManifests = {}

  function sendMessage(message) {
    return readyPromise.then(function () {
      return self.clients.matchAll()
    }).then(function (clients) {
      return clients[clients.length - 1]
    }).then(function (client) {
      return new Promise(function (resolve, reject) {
        var messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = function (event) {
          console.log('Received response from client', event.data)
          if (event.data.error) {
            reject(event.data.error);
          } else {
            resolve(event.data);
          }
        };
        // This sends the message data as well as transferring messageChannel.port2 to the service worker.
        // The service worker can then use the transferred port to reply via postMessage(), which
        // will in turn trigger the onmessage handler on messageChannel.port1.
        // See https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage
        console.log('Sending message to client', client, message)
        client.postMessage(message, [messageChannel.port2])
      });
    })
  }

  function getResponse(event) {
    var url = event.request.url
    console.log('Browser requested %s', url)

    var matches = patterns.some(function (pattern) {
      return pattern.test(url)
    })

    if (!matches /*|| url.match('localhost:8081') !== null*/) {
      console.log('%s doesnt match any patterns', url)
      console.log('Not interfering with %s, move along', url)
      return fetch(event.request)
    }

    return readyPromise.then(function() {
      return new Promise(function (resolve, reject) {
        if (Array.isArray(manifest[url]) && manifest[url].length) {
          var index = Math.floor(Math.random() * manifest[url].length)
          var peerId = manifest[url][index]
          console.log('%s may have the file, no need to ask for new peer', peerId)
          console.log('Asking socket server for hash for %s', url)
          socket.emit('hash', url, function (data) {
            console.log('Server said hash for %s is %s', url, data.hash)
            data.peerId = peerId
            resolve(getResponseFromUser(data, event))
          })
        } else {
          console.log('No one we know of has %s', url)
          console.log('Asking socket server for user with %s', url)
          socket.emit('file', url, function (data) {
            if (!data.peerId) {
              console.log('No one has %s', url)
              console.log('Get %s through normal channels', url)
              resolve(fetch(event.request).then(function(response) {
                var clonedResponse = response.clone()
                clonedResponse.blob().then(function (blob) {
                  console.log('Adding %s to our manifest', url)
                  files[url] = blob
                })

                return response
              }))
            } else {
              console.log('%s has %s', data.peerId, url)
              resolve(getResponseFromUser(data, event))
            }
          })
        }
      })
    })
  }

  function getResponseFromUser(data, event) {
    var hash = data.hash
    delete data.hash
    var request = {
      request: 'file-from-user',
      data: data
    }

    console.log('Sending request for', data)
    return sendMessage(request).then(function (response) {
      console.log('Adding %s\'s manifest', data.peerId, response.data.manifest)
      peerManifests[data.peerId] = response.data.manifest
      var numFiles = response.data.manifest.length
      for (var i = 0; i < numFiles; i++) {
        manifest[response.data.manifest[i]] = manifest[response.data.manifest[i]] || []
        manifest[response.data.manifest[i]].push(data.peerId)
      }

      console.log('hashing response for %s', data.url)
      return crypto.subtle.digest('SHA-1', response.data.file).then(function(responseHash) {
        var stringHash = ab2hex(responseHash)
        console.log('%s and %s do' + ((hash === stringHash) ? ' ' : 'n\'t') + 'match', hash, stringHash)
        if (hash === stringHash) {
          var blob = new Blob([response.data.file])
          files[data.url] = blob
          return new Response(blob, {
            'status': 200,
            'statusText': 'OK'
          })
        } else {
          return fetch(event.request)
        }
      })
    })
  }

  function removePeerFromManifest(peerId) {
    var peerManifest = peerManifests[peerId] || []
    var numFiles = peerManifest.length
    for (var i = 0; i < numFiles; i++) {
      var index = manifest[peerManifest[i]].indexOf(peerId)
      if (index > -1) {
        manifest[peerManifest[i]].splice(index, 1)
      }
    }
    delete peerManifests[peerId]
  }

  // convert from arraybuffer to hex
  function ab2hex(ab) {
    var dv = new DataView(ab)
      , i
      , len
      , hex = ''
      , c
      ;

    for (i = 0, len = dv.byteLength; i < len; i += 1) {
      c = dv.getUint8(i).toString(16);
      if (c.length < 2) {
        c = '0' + c;
      }
      hex += c;
    }

    return hex;
  }

  self.addEventListener('message', function (event) {
    console.log('Recieved message from client', event.data)
    switch (event.data.request) {
      case 'ready':
        if (event.data.ready) {
          readyDeferred.resolve()
          event.ports[0].postMessage({})
        } else {
          readyDeferred = new Deferred()
          readyPromise = new Promise(function (resolve, reject) {
            readyDeferred.then(function () {
              resolve()
            })
          })
        }
        break;
      case 'file':
        event.ports[0].postMessage({
          file: files[event.data.file]
        })
        break;
      case 'manifest':
        event.ports[0].postMessage({
          manifest: Object.keys(files)
        })
        break;
      case 'remove-manifest':
        removePeerFromManifest(event.data.peer)
        break;
      default:
        event.ports[0].postMessage({
          error: new Error('No Request')
        })
        break;
    }
  })

  self.addEventListener('fetch', function (event) {
    event.respondWith(getResponse(event))
  })
})
