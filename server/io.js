import http from 'http'
import socketio from 'socket.io'

var app = http.createServer()
var io = socketio(app)

app.listen(8081)

export default io
