import Peer from 'peerjs'
import uuid from 'node-uuid'

var peer = null
var connections = {}
var callbacks = {}
var handlers = {}

function setUpListeners(connection) {
  return new Promise((resolve, reject) => {
    connection.on('open', () => {
      console.log('Connection established with %s', connection.peer)
      setupReceiver(connection)
      resolve(connection)
    })
    connection.on('close', () => {
      handlers['close'](connection.peer)
    })
    connection.on('error', (err) => {
      console.error('There was an error connecting to %s', connection.peer, err)
      reject(err)
    })
  })
}

function setupReceiver(connection) {
  connection.on('data', (data) => {
    if (data.type === 'request') {
      console.log('Received request from %s for', connection.peer, data.request)
      var request = Object.keys(data.request)[0]
      handlers[request](data.request, sendResponse.bind(null, data.id, connection))
    } else if (data.type === 'response') {
      console.log('Recieved response from %s', connection.peer, data.response)
      callbacks[data.id](data.response.errors, data.response)
      delete callbacks[data.id]
    }
  })
}

function sendResponse(id, connection, data) {
  var response = {
    id,
    type: 'response',
      response: data
  }
  console.log('Sending response to %s', connection.peer, response)
  connection.send(response)
}

export var peerId

export function startServer(key) {
  peer = new Peer({
    key: key,
    config: {
      'iceServers': [
        {
          url: 'stun:stun.l.google.com:19302'
        }
      ]
    }
  })

  peer.on('connection', (connection) => {
    setUpListeners(connection)
  })

  return new Promise((resolve, reject) => {
    peer.on('open', (id) => {
      console.log('peer js setup with peerId %s', id)
      peerId = id
      resolve(id)
    })
  })
}

export function connectToPeer(peerId) {
  if (connections[peerId]) {
    console.log('Connection already established for peer %s', peerId)
  } else {
    console.log('Creating connection to %s', peerId)
    var connection = peer.connect(peerId)
    connections[connection.peer] = setUpListeners(connection)
  }
  return connections[peerId]
}

export function sendRequest(peerId, request, cb) {
  connectToPeer(peerId).then((connection) => {
    var req = {
      id: uuid.v1(),
      type: 'request',
      request
    }
    console.log('making request to %s for', peerId, req)
    connection.send(req)
    callbacks[req.id] = cb
  })
}

export function on(requestName, func) {
  console.log('Handler setup for %s', requestName)
  handlers[requestName] = func
}
