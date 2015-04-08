import Peer from 'peerjs'
import uuid from 'node-uuid'

var peer = null
var connections = {}
var callbacks = {}
var handlers = {}

function setUpListeners (connection) {
  return new Promise((resolve, reject) => {
    if (!connections[connection.peer]) {
      connection.on('open', () => {
        setupReceiver(connection)
        connections[connection.peer] = connection
        resolve(connection.peer)
      })
      connection.on('error', (err) => {
        reject(err)
      })
    } else {
      resolve(connection.peer)
    }
  })
}

function setupReceiver (connection) {
  connection.on('data', (data) => {
    if (data.type === 'request') {
      var request = Object.keys(data.request)[0]
      handlers[request](data.request, sendResponse.bind(null, data.id, connection))
    } else if (data.type === 'response') {
      callbacks[data.id](data.response.errors, data.response)
      delete callbacks[data.id]
    }
  })
}

function sendResponse (id, connection, data) {
  var response = {
    id,
    type: 'response',
    response: data
  }
  connection.send(response)
}

export var peerId

export function startServer (key) {
  peer = new Peer({
    key: key
  })

  peer.on('connection', (connection) => {
    setUpListeners(connection)
  })

  return new Promise((resolve, reject) => {
    peer.on('open', (id) => {
      peerId = id
      resolve(id)
    })
  })
}

export function connectToPeer (peerId) {
  if (connections[peerId]) {
    return new Promise((resolve, reject) => {
      resolve(peerId)
    })
  } else {
    var connection = peer.connect(peerId)
    return setUpListeners(connection)
  }
}

export function sendRequest (peerId, request, cb) {
  connectToPeer(peerId).then(() => {
    var req = {
      id: uuid.v1(),
      type: 'request',
      request
    }
    connections[peerId].send(req)
    callbacks[req.id] = cb
  })
}

export function on (requestName, func) {
  handlers[requestName] = func
}
