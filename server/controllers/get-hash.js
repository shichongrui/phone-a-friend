import log from 'pretty-log'

import * as HashModel from '../models/hashes'

export default function getHash(socket, url, cb) {
  HashModel.getHashForFile(url).then((hash) => {
    cb({url, hash})
  })
}
