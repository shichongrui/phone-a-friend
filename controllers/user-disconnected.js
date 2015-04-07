import log from 'pretty-log'

import * as UserModel from '../models/user-socket'
import * as FileModel from '../models/user-file'

export default function userDisconnected (socket) {
  log.debug('userDisconnected: ' + socket.id)
  var userId
  FileModel.removeUserRecords(socket.id)
}
