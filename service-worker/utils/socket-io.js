import io from 'socket.io-client'
import * as messenger from './messenger'

export var socket = io.connect('//localhost:8080', {
  transports: ['websocket']
})

socket.on('peer-id', function(cb) {
  console.log('Received a request from socket server for an active peer id')
  messenger.sendMessage({
    request: 'peer-id'
  }).then(function(data) {
    console.log('Responding to socket server with peer id %s', data.data)
    cb(data.data)
  })
})
