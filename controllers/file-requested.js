import log from 'pretty-log'

import io from '../io'
import * as FileModel from '../models/user-file'
//import * as UserModel from '../models/user-socket'

export default function fileRequested (socket, url, cb) {
  log.debug('fileRequested: ' + url)
  FileModel.recordUserHasFile(socket.id, url).then(() => {
    return FileModel.getUserForFile(url, socket.id)
  }).then((socketId) => {
    console.log(io.sockets)
    return new Promise((resolve, reject) => {
      io.sockets.connected[socketId].emit('peer-id', function(peerId) {
        resolve(peerId)
      })
    })
  }).then((peerId) => {
    log.success('fileRequested: ' + url + ': ' + peerId)
    cb({peerId, url})
  }).catch((error) => {
    //there was an error or no users
    log.error('fileRequested: ' + error)
    cb({url})
  })
}
