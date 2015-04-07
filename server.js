require('babel/register')({
  stage: 0
})

var io = require('./io')
var uuid = require('node-uuid')
var log = require('pretty-log')

//controllers
var userConnected = require('./controllers/user-connected')
var fileRequested = require('./controllers/file-requested')
var userDisconnected = require('./controllers/user-disconnected')

io.on('connection', function (socket) {
  log.debug('Waiting for requests')

//  socket.on('record-user-id', userConnected.bind(null, socket))
  socket.on('disconnect', userDisconnected.bind(null, socket))

  socket.on('file', fileRequested.bind(null, socket))


})
