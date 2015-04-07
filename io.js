import http from 'http'
import socketio from 'socket.io'

var app = http.createServer()
var io = socketio(app)

app.listen(8080)

export default io
