import * as PeerServer from './peer-server'

var manifests = {}

export function getFile(data) {
  return Promise.all([
    new Promise((resolve, reject) => {
      PeerServer.sendRequest(data.peerId, {
        'file': data.url
      }, (err, file) => {
        if (err) {
          return reject(err)
        }

        resolve(file)
      })
    }),
    getManifest(data)
  ]).then((data) => {
    return {
      file: data[0].file,
      manifest: data[1].manifest
    }
  })
}

export function getManifest(data) {
  return new Promise((resolve, reject) => {
    PeerServer.sendRequest(data.peerId, {
      'manifest': ''
    }, (err, manifest) => {
      if (err) {
        return reject(err)
      }

      resolve(manifest)
    })
  })
}

export function getPeerId() {
  return new Promise((resolve, reject) => {
    resolve(PeerServer.peerId)
  })
}
