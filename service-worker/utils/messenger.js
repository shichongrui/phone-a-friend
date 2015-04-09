import {Deferred} from 'simply-deferred'

var handlers = {}

var readyDeferred = new Deferred()
var readyPromise = new Promise(function (resolve, reject) {
  readyDeferred.then(function () {
    resolve()
  })
})

self.addEventListener('message', function (event) {
  console.log('Recieved message from client', event.data)
  var request = event.data
  if (handlers[request.request]) {
    handlers[request.request](event.data, res.bind(null, event.ports[0]))
  } else {
    event.ports[0].postMessage({
      error: 'No handler for that request'
    })
  }
})

function res (port, data) {
  port.postMessage(data)
}

export function sendMessage(message) {
  return readyPromise.then(function () {
    return self.clients.matchAll()
  }).then(function (clients) {
    var client = clients[clients.length -1]

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

export function clientReadyStateChange(isClientReady) {
  if (isClientReady) {
    readyDeferred.resolve()
  } else {
    readyDeferred = new Deferred()
    readyPromise = new Promise(function (resolve, reject) {
      readyDeferred.then(function () {
        resolve()
      })
    })
  }
}

export function on (name, handler) {
  handlers[name] = handler
}
