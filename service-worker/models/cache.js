import {socket} from '../utils/socket-io'

var files = {}
var peerManifests = {}
var manifests = {}

// convert from arraybuffer to hex
function ab2hex(ab) {
  var dv = new DataView(ab),
    i, len, hex = '',
    c;

  for (i = 0, len = dv.byteLength; i < len; i += 1) {
    c = dv.getUint8(i).toString(16);
    if (c.length < 2) {
      c = '0' + c;
    }
    hex += c;
  }

  return hex;
}

export function getHashForFile (url) {
  return new Promise((resolve, reject) => {
    console.log('Asking socket server for hash for %s', url)
    socket.emit('hash', url, function (data) {
      console.log('Server said hash for %s is %s', url, data.hash)
      resolve(data.hash)
    })
  })
}

export function isHash(hash, file) {
  console.log('hashing response')
  return crypto.subtle.digest('SHA-1', file).then(function (responseHash) {
    var stringHash = ab2hex(responseHash)
    console.log('%s and %s do' + ((hash === stringHash) ? ' ' : 'n\'t') + 'match', hash, stringHash)
    return hash === stringHash
  })
}

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

export function getFileAsArrayBuffer(url) {
  console.log('getting %s from cache as array buffer', url)
  return new Promise((resolve, reject) => {
    var fileReader = new FileReader()
    fileReader.onload = function() {
      resolve(this.result)
    }
    fileReader.readAsArrayBuffer(getFileFromCache(url))
  })
}

export function removeFileFromCache(url) {
  console.log('removing %s from cache', url)
  delete files[url]
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

export function hashFile (file) {

}
