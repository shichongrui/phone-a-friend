import redis from 'then-redis'

export var db = redis.createClient('tcp://localhost:6379')

// for now we are going to flush the database everytime the server is restarted
// TODO: Remove this once this becomes production ready
db.flushall()

export function formatHash(entries) {
  var numEntries = entries.length
  var hashes = []
  for (var i = 0; i < numEntries; i++) {
    hashes[i] = {}
    var numFields = entries[i].length
    for (var field = 0; field < numFields; field += 2) {
      hashes[i][entries[i][field]] = entries[i][field + 1]
    }
  }
  return hashes
}
