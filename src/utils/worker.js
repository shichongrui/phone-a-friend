var handlers = {}
var workerPromise = Worker()

function Worker () {
  return new Promise((resolve, reject) => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-cdn.js').then(function (registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope)
        if (navigator.serviceWorker.controller) {
          resolve(navigator.serviceWorker.controller)
        } else {
          console.log('Reload for service worker to take effect')
        }
      }).catch(function (err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err)
      })
    }
  })
}

window.onmessage = (event) => {
  if (event.ports.length > 0) {
    handlers[event.data.request](event.data.data).then((data) => {
      event.ports[0].postMessage({data})
    })
  }
}

window.onbeforeunload = () => {
  sendMessage({
    request: 'ready',
    ready: false
  })
}

export function sendMessage (data) {
  return workerPromise.then(() => {
    return new Promise(function(resolve, reject) {
      var messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = function(event) {
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
      navigator.serviceWorker.controller.postMessage(data, [messageChannel.port2]);
    })
  })
}

export function on (name, func) {
  handlers[name] = func
}

