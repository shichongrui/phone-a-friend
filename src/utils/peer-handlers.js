import * as Worker from './worker'

export function getFile(req, res) {
  console.log('Requesting %s from worker', req.file)
  Worker.sendMessage({
    request: 'file',
    file: req.file
  }).then((data) => {
    console.log('Got %s from worker', req.file)
    res(data)
  })
}

export function getManifest(req, res) {
  console.log('Requesting manifest from worker')
  Worker.sendMessage({
    request: 'manifest'
  }).then((data) => {
    console.log('Manifest retrieved', data)
    res(data)
  })
}

export function removePeerFromManifest(peerId) {
  console.log('Requesting peer %s to be removed from manifest', peerId)
  Worker.sendMessage({
    request: 'remove-manifest',
    peer: peerId
  })
}

export function removeFromManifest(req, res) {
  console.log('I have been told to remove %s from my manifest', req.badFile)
  Worker.sendMessage({
    request: 'remove-from-manifest',
    url: req.badFile
  })
}
