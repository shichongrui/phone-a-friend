import log from 'pretty-log'

import io from '../io'
import * as FileModel from '../models/user-file'
import * as UserModel from '../models/user-socket'
import * as Hashes from '../models/hashes'

export default function getFile (socket, url, cb) {
  log.debug('fileRequested: ' + url)

  FileModel.getUserForFile(url, socket.id).then((socketId) => {
    if (socketId) {
      return UserModel.getPeerId(socketId)
    } else {
      return null
    }
  }).then((peerId) => {
    log.success('fileRequested: ' + peerId + ' ' + url)
    if (peerId) {
      console.log(`peerId shouldn't be null ${peerId}`)
      cb({peerId})
    } else {
      cb({})
    }
  })
  FileModel.recordUserHasFile(socket.id, url)
}
