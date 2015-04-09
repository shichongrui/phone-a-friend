var files = {}
var peerManifests = {}
var manifests = {}

export function cacheResponse (response) {
  if (response.type !== 'opaque') {
    var clonedResponse = response.clone()
    clonedResponse.blob().then(function (blob) {
      console.log('Adding %s to our manifest', response.url)
      files[clonedResponse.url] = {
        file: blob
      }
    })
  }
}

export function putFileInCache(url, file, hash) {
  if (!files[url] || files[url].hash !== hash) {
    console.log('hashes matched for %s, will insert new version', url)
    files[url] = files[url] || {}
    files[url].file = file
    files[url].hash = hash
  }
}

export function getFileFromCache(url) {
  console.log('getting %s from cache', url)
  return files[url] && files[url].file
}

export function getUsersManifest() {
  return Object.keys(files)
}

export function getUserForFileFromManifest(url) {
  if (Array.isArray(manifests[url]) && manifests[url].length) {
    var index = Math.floor(Math.random() * manifests[url].length)
    var peerId = manifests[url][index]
    console.log('%s may have the file, no need to ask for new peer', peerId)
    return peerId
  }
}

export function updateManifestForUser(peerId, manifest) {
  console.log('Adding %s\'s manifest', peerId, manifest)
  peerManifests[peerId] = manifest
  var numFiles = manifest.length
  for (var i = 0; i < numFiles; i++) {
    manifests[manifest[i]] = manifests[manifest[i]] || []
    manifests[manifest[i]].push(peerId)
  }
}

export function removeManifestForUser(peerId) {
  var manifest = peerManifests[peerId] || []
  var numFiles = manifest.length
  for (var i = 0; i < numFiles; i++) {
    var index = manifests[manifest[i]].indexOf(peerId)
    if (index > -1) {
      manifests[manifest[i]].splice(index, 1)
    }
  }
  delete peerManifests[peerId]
}

export function clearManifests () {
  manifests = {}
  peerManifests = {}
}
