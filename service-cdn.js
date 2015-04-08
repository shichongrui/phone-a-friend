importScripts('http://localhost:8081/deferred.min.js')
importScripts('http://localhost:8080/socket.io/socket.io.js')

var patterns = [
  /localhost:3002.*\.jpg$/g,
  /localhost:3002.*\.png$/g,
  /localhost:3002.*\.gif$/g,
  /localhost:3002.*\.svg$/g,
  /localhost:3002.*\.js/g,
  /localhost:3002.*\.css/g
]

self.addEventListener('activate', function (event) {
  var socket = io.connect('//localhost:8080', {
    transports: ['websocket']
  })

  socket.on('peer-id', function(cb) {
    sendMessage({
      request: 'peer-id'
    }).then(function(data) {
      cb(data.data)
    })
  })

  var readyDeferred = new Deferred()
  var readyPromise = new Promise(function (resolve, reject) {
    readyDeferred.then(function () {
      resolve()
    })
  })

  var deferreds = {}
  var files = {}
  var manifest = {}

  function resolveForUrl(url) {
    (deferreds[url] || []).forEach(function (deferred) {
      deferred.resolve()
    })
    delete deferreds[url]
  }

  function sendMessage(message) {
    return readyPromise.then(function () {
      return self.clients.matchAll()
    }).then(function (clients) {
      return clients[clients.length - 1]
    }).then(function (client) {
      return new Promise(function (resolve, reject) {
        var messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = function (event) {
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
        client.postMessage(message, [messageChannel.port2])
      });
    })
  }

  function getResponse(event) {
    var url = event.request.url

    var matches = patterns.some(function (pattern) {
      return pattern.test(url)
    })

    if (!matches || url.match('localhost:8081') !== null) {
      return fetch(event.request)
    }

    return readyPromise.then(function() {
      return new Promise(function (resolve, reject) {
        if (manifest[url]) {
          var index = Math.floor(Math.random() * manifest[url].length)
          var peerId = manifest[url][index]
          socket.emit('hash', url, function (data) {
            data.peerId = peerId
            resolve(getResponseFromUser(data, event))
          })
        }

        socket.emit('file', url, function (data) {
          if (!data.peerId) {
            resolve(fetch(event.request).then(function(response) {
              var clonedResponse = response.clone()
              clonedResponse.blob().then(function (blob) {
                files[url] = blob
                console.log(Object.keys(files))
              })

              return response
            }))
          } else {
            resolve(getResponseFromUser(data, event))
          }
        })
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

    return sendMessage(request).then(function (response) {
      var numFiles = response.data.manifest.length
      for (var i = 0; i < numFiles; i++) {
        manifest[response.data.manifest[i]] = manifest[response.data.manifest[i]] || []
        manifest[response.data.manifest[i]].push(data.peerId)
      }

      return crypto.subtle.digest('SHA-1', response.data.file).then(function(responseHash) {
        var stringHash = ab2hex(responseHash)
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
