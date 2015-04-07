import io from '../io'
import uuid from 'node-uuid'
import {createUser} from '../models/user-socket'

export default (socket, userId, cb) => {
  console.log('Creating user with id: ', userId)
  createUser(userId, socket.id)

  //every user needs a unique id
  cb(userId)
}
