import redis from 'then-redis'

var db = redis.createClient('tcp://localhost:6379')

// for now we are going to flush the database everytime the server is restarted
// TODO: Remove this once this becomes production ready
db.flushall()

export default db
