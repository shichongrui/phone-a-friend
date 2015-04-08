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
