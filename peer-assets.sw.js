importScripts('/deferred.min.js')
importScripts('http://localhost:8080/socket.io/socket.io.js')

var patterns = [
  /.jpg$/g
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

    var matches = patterns.every(function (pattern) {
      return pattern.test(url)
    })

    if (!matches) {
      return fetch(event.request)
    }
    url = '/me.jpg'
    return readyPromise.then(function() {
      return new Promise(function (resolve, reject) {
        socket.emit('file', url , function (data) {
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
    var request = {
      request: 'file-from-user',
      data: data
    }
    return sendMessage(request).then(function (response) {
      var blob = new Blob([response.data.file])
      files[data.url] = blob
      return new Response(blob, {
        'status': 200,
        'statusText': 'OK'
      })
    })
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
