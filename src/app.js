import * as Worker from './utils/worker'
import * as PeerServer from './utils/peer-server'
import * as PeerHandlers from './utils/peer-handlers'
import * as WorkerHandlers from './utils/worker-handlers'

var peer = null

var ready = PeerServer.startServer('txhk8bqkc2pam7vi').then(() => {
  return Worker.sendMessage({
    request: 'ready',
    ready: true
  })
})

// peer handlers
PeerServer.on('file', PeerHandlers.getFile)

// worker handlers
Worker.on('file-from-user', WorkerHandlers.getFile)
Worker.on('peer-id', WorkerHandlers.getPeerId)
