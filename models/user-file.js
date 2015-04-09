import log from 'pretty-log'
import geolib from 'geolib'

import {db} from './db'
import * as UserModel from './user-socket'

export function getUserForFile(url, currentUserSocketId) {
  var user
  log.debug('DB: getUserForFile: ' + url)
  return db.srandmember(url, 5).then((socketIds) => {
    socketIds = socketIds.filter(socketId => socketId && socketId !== currentUserSocketId  && socketId !== 'null')

    console.log('Possible sockets', socketIds)
    if (socketIds.length) {
      return Promise.all([
        UserModel.getUsersLocations(socketIds),
        UserModel.getLocationOfUser(currentUserSocketId)
      ]).then(([peersLocations, location]) => {
        var result = geolib.findNearest(location, peersLocations)
        return socketIds[result.key]
      })
    }

    return
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
