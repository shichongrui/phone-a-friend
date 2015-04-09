import io from 'socket.io-client'
import * as messenger from './messenger'

export var socket = io.connect('//localhost:8080', {
  transports: ['websocket']
})
