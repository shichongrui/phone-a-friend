import * as Worker from './utils/worker'
import * as PeerServer from './utils/peer-server'
import * as PeerHandlers from './utils/peer-handlers'
import * as WorkerHandlers from './utils/worker-handlers'

console.log('Starting peer server')
var ready = PeerServer.startServer('txhk8bqkc2pam7vi').then(() => {
  console.log('Client ready')
  return Worker.sendMessage({
    request: 'ready',
    ready: true
  })
})

console.log('setting up peer server handlers')
// peer handlers
PeerServer.on('file', PeerHandlers.getFile)
PeerServer.on('manifest', PeerHandlers.getManifest)

console.log('setting up worker handlers')
// worker handlers
Worker.on('file-from-user', WorkerHandlers.getFile)
Worker.on('peer-id', WorkerHandlers.getPeerId)
