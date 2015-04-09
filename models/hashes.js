import crypto from 'crypto'
import request from 'request'

import {db} from './db'

export function getHashForFile(url) {
  return new Promise((resolve, reject) => {
    db.get(url + 'hash').then((hash) => {
      if (hash) {
        resolve(hash)
      } else {
        var hasher = crypto.createHash('sha1')
        request.get(url, (error, response, body) => {
          var hash = hasher.digest('hex')
          db.set(url + 'hash', hash).then(() => {
            resolve(hash)
          })
        }).on('data', (chunk) => {
          hasher.update(chunk)
        })
      }
    })
  })
}
