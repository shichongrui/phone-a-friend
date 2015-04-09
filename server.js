require('babel/register')({
  stage: 0
})

var io = require('./io')
var uuid = require('node-uuid')
var log = require('pretty-log')

//controllers
var userConnected = require('./controllers/user-connected')
var PeerId = require('./controllers/peer-id')
var getFile = require('./controllers/get-file')
var getHash = require('./controllers/get-hash')
var userDisconnected = require('./controllers/user-disconnected')

io.on('connection', function (socket) {
  log.debug('Waiting for requests')

  socket.on('disconnect', userDisconnected.bind(null, socket))

  socket.on('file', getFile.bind(null, socket))
  socket.on('hash', getHash.bind(null, socket))
  socket.on('record-peer-id', PeerId.recordPeerId.bind(null, socket))
  socket.on('remove-peer-id', PeerId.removePeerId.bind(null, socket))

})
