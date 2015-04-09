import log from 'pretty-log'

import io from '../io'
import * as FileModel from '../models/user-file'
import * as Hashes from '../models/hashes'
//import * as UserModel from '../models/user-socket'

export default function getFile (socket, url, cb) {
  log.debug('fileRequested: ' + url)

  FileModel.getUserForFile(url, socket.id).then((socketId) => {
    return new Promise((resolve, reject) => {
      if (socketId) {
        io.sockets.connected[socketId].emit('peer-id', function(peerId) {
          resolve(peerId)
        })
      } else {
        resolve()
      }
    })
  }).then((peerId) => {
    log.success('fileRequested: ' + peerId + ' ' + url)
    if (peerId) {
      cb({peerId})
    } else {
      cb({})
    }
  })
  FileModel.recordUserHasFile(socket.id, url)
}
