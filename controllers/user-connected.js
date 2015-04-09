import uuid from 'node-uuid'
import geo from 'geoip-lite'
import io from '../io'
import * as UserModel from '../models/user-socket'

export default function userConnected (socket) {
  var ip = '216.51.95.36' // socket.request.connection.remoteAddress
  var locationData = geo.lookup(ip)
  UserModel.setUserLocation(socket.id, locationData.city + locationData.region, locationData.ll[0], locationData.ll[1])
}
