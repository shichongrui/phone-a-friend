import * as io from './utils/socket-io'
import * as messenger from './utils/messenger'
import * as messageHandlers from './utils/message-handlers'
import * as fetchCatcher from './utils/fetch-catcher'

messenger.on('file', messageHandlers.getFile)
messenger.on('ready', messageHandlers.readyStateChange)
messenger.on('manifest', messageHandlers.getUsersManifest)
messenger.on('remove-manifest', messageHandlers.removeManifestForPeer)
