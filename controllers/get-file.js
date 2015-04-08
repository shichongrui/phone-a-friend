import log from 'pretty-log'

import io from '../io'
import * as FileModel from '../models/user-file'
import * as Hashes from '../models/hashes'
//import * as UserModel from '../models/user-socket'

export default function getFile (socket, url, cb) {
  log.debug('fileRequested: ' + url)

  FileModel.getUserForFile(url, socket.id).then((socketId) => {
    console.log(socketId)
    return Promise.all([
      new Promise((resolve, reject) => {
        if (socketId) {
          io.sockets.connected[socketId].emit('peer-id', function(peerId) {
            resolve(peerId)
          })
        } else {
          resolve()
        }
      }),
        Hashes.getHashForFile(url)
    ]).then(([peerId, hash]) => {
      log.success('fileRequested: ' + peerId + ' ' + url + ': ' + hash)
      if (peerId) {
        cb({peerId, url, hash})
      } else {
        cb({url, hash})
      }
    })
  })

  FileModel.recordUserHasFile(socket.id, url)
}
