import db from './db'
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

export function createUser (userId, socketId) {
  log.debug('DB: createUser: ' + userId + ': ' + socketId)
  db.set(userId, socketId)
  db.set(socketId, userId)
}

export function getSocketIdForUser (userId) {
  log.debug('DB: getSockerIdForUser: ' + userId)
  return db.get(userId)
}

export function getUserIdForSocket (socketId) {
  log.debug('DB: getUserIdForSocket: ' + socketId)
  return db.get(socketId)
}

export function removeUserRecords (userId, socketId) {
  log.debug('DB: removeUserRecords: ' + userId)
  return Promise.all([
    db.del(userId),
    db.del(socketId)
  ])
}
