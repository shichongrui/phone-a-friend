import redis from 'then-redis'

var db = redis.createClient('tcp://localhost:6379')

export default db
