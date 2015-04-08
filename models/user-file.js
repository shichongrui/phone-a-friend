import log from 'pretty-log'
//import mulligan from 'mulligan'

import db from './db'

export function getUserForFile(url, currentUserSocketId) {
  var user
  log.debug('DB: getUserForFile: ' + url)
  return new Promise((resolve, reject) => {
    db.srandmember(url).then((socketId) => {
      if (socketId === currentUserSocketId || !socketId || socketId === 'null') {
        resolve()
      } else {
        resolve(socketId)
      }
    })
  })
}

export function recordUserHasFile (socketId, url) {
  log.debug('DB: recordUserHasFile: ' + socketId + ': ' + url)

  return db.sismember(url, socketId).then((exists) => {
    if (!exists) {
      log.debug('DB: recordUserHasFile: adding ' + socketId + ' to ' + url + ' set')
      return Promise.all([
        db.sadd(url, socketId),
        db.sadd(socketId+'files', url)
      ]).then(() => {
        return socketId
      })
    } else {
      log.debug('DB: recordUserHasFile: ' + socketId + ' already in ' + url + ' set')
      return socketId
    }
  })
}

export function removeUserRecords (socketId) {
  return db.smembers(socketId+'files').then((files) => {
    log.debug('DB: removing user info from ' + files.length + ' sets')
    return Promise.all(files.map((file) => {
      return db.srem(file, socketId)
    }))
  }).then(() => {
    return db.del(socketId+'files')
  })
}
