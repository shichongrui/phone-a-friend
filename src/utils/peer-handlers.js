import * as Worker from './worker'

export function getFile(req, res) {
  Worker.sendMessage({
    request: 'file',
    file: req.file
  }).then((data) => {
    res(data)
  })
}

export function getManifest(req, res) {
  Worker.sendMessage({
    request: 'manifest'
  }).then((data) => {
    res(data)
  })
}
