import {db, formatHash} from './db'
import log from 'pretty-log'

export function recordPeerId(socketId, peerId) {
  var key = socketId + 'peerIds'
  db.sismember(key, peerId).then((isMember) => {
    if (!isMember) {
      return db.sadd(socketId + 'peerIds', peerId)
    } else {
      return
    }
  })
}

export function getPeerId(socketId) {
  var key = socketId + 'peerIds'
  return db.srandmember(key)
}

export function removePeerId(socketId, peerId) {
  var key = socketId + 'peerIds'
  return db.srem(key, peerId)
}

export function setUserLocation(socketId, cityState, latitude, longitude) {
  log.debug('DB: Setting the users location')
  var key = socketId + 'location'
  var hash = {
    cityState,
    latitude,
    longitude,
    socketId
  }
  return db.hmset(key, hash)
}

export function getLocationOfUser(socketId) {
  var key = socketId + 'location'
  return db.hgetall(key)
}

export function removeLocationOfUser(socketId) {
  var key = socketId + 'location'
  return db.del(key)
}

export function getUsersLocations(socketIds) {
  var keys = socketIds.map(socketId => socketId + 'location')
  var numKeys = keys.length
  db.multi()
  for (var i = 0; i < numKeys; i++) {
    db.hgetall(keys[i])
  }
  return db.exec().then(formatHash)
}
