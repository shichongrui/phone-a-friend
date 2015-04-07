import db from './db'
import log from 'pretty-log'

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
