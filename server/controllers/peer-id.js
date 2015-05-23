import * as UserModel from '../models/user-socket'

export function recordPeerId(socket, peerId) {
  UserModel.recordPeerId(socket.id, peerId)
}

export function removePeerId(socket, peerId) {
  UserModel.removePeerId(socket.id, peerId)
}
