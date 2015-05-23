import * as Worker from './utils/worker'
import * as PeerServer from './utils/peer-server'
import * as PeerHandlers from './utils/peer-handlers'
import * as WorkerHandlers from './utils/worker-handlers'

console.log('Starting peer server')
var ready = PeerServer.startServer('txhk8bqkc2pam7vi').then((peerId) => {
  console.log('Client ready')
  return Worker.sendMessage({
    request: 'ready',
    ready: true,
    peerId
  })
})

// peer handlers
console.log('setting up peer server handlers')
PeerServer.on('file', PeerHandlers.getFile)
PeerServer.on('manifest', PeerHandlers.getManifest)
PeerServer.on('badFile', PeerHandlers.removeFromManifest)
PeerServer.on('close', PeerHandlers.removePeerFromManifest)

// worker handlers
console.log('setting up worker handlers')
Worker.on('file-from-user', WorkerHandlers.getFile)
Worker.on('peer-id', WorkerHandlers.getPeerId)
Worker.on('remove-from-manifest', WorkerHandlers.removeFileFromManifest)
