import * as PeerServer from './peer-server'

var manifests = {}

export function getFile(data) {
  var promises = [
    new Promise((resolve, reject) => {
      console.log('Worker would like %s from %s', data.url, data.peerId)
      PeerServer.sendRequest(data.peerId, {
        'file': data.url
      }, (err, file) => {
        if (err) {
          return reject(err)
        }

        resolve(file)
      })
    })
  ]
  if (data.includeManifest) {
    promises.push(getManifest(data))
  }
  return Promise.all(promises).then((data) => {
    var response = {
      file: data[0].file
    }
    if (data.includeManifest) {
      response.manifest = data[1].manifest
    }
    return response
  })
}

export function getManifest(data) {
  return new Promise((resolve, reject) => {
    console.log('Worker would like the manifest from %s', data.peerId)
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

export function removeFileFromManifest(data) {
  return new Promise((resolve, reject) => {
    console.log('Informing %s that they should remove %s from their manifest', data.peerId, data.url)
    PeerServer.sendRequest(data.peerId, {
      badFile: data.url
    })
  })
}
