import * as PeerServer from './peer-server'

export function getFile(data) {
  return new Promise((resolve, reject) => {
    PeerServer.connectToPeer(data.peerId).then(() => {
      PeerServer.sendRequest(data.peerId, {
        type: 'request',
        request: {
          'file': data.url
        }
      }, function (err, file) {
        if (err) {
          return reject(err)
        }

        resolve(file)
      })
    })
  })
}

export function getPeerId() {
  return new Promise((resolve, reject) => {
    resolve(PeerServer.peerId)
  })
}
