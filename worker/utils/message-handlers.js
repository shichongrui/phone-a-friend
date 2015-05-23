import * as messenger from './messenger'
import * as cache from '../models/cache'
import {socket} from './socket-io'

export function readyStateChange (req, res) {
  messenger.clientReadyStateChange(req.ready)
  socket.emit('record-peer-id', req.peerId)
  if (!req.ready) {
    socket.emit('remove-peer-id', req.peerId)
    cache.clearManifests()
  }
  res({})
}

export function getFile (req, res) {
  var file = cache.getFileFromCache(req.file)
  if (file) {
    res({ file })
  } else {
    res({
      error: 'That file was not found'
    })
  }
}

export function getUsersManifest (req, res) {
  res({
    manifest: cache.getUsersManifest()
  })
}

export function removeManifestForPeer (req, res) {
  cache.removeManifestForUser(req.peer)
}

export function removeFromManifest (req, res) {
  //first lets double check that this is the case
  Promise.all([
    cache.getHashForFile(req.url),
    cache.getFileAsArrayBuffer(req.url)
  ]).then((data) => {
    console.log(data)
    return cache.isHash(data[0], data[1])
  }).then((isValid) => {
    if (!isValid) {
      cache.removeFileFromCache(req.url)
    }
    // if it is valid then we are just going to leave it alone
  })

}
