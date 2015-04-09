import * as messenger from './messenger'
import * as cache from '../models/cache'

export function readyStateChange (req, res) {
  messenger.clientReadyStateChange(req.ready)
  if (!req.ready) {
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
