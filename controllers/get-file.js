import log from 'pretty-log'

import io from '../io'
import * as FileModel from '../models/user-file'
import * as UserModel from '../models/user-socket'
import * as Hashes from '../models/hashes'

export default function getFile (socket, url, cb) {
  log.debug('fileRequested: ' + url)

  FileModel.getUserForFile(url, socket.id).then((socketId) => {
    return new Promise((resolve, reject) => {
      if (socketId) {
        resolve(UserModel.getPeerId(socketId))
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
