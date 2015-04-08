require('babel/register')({stage: 0})

var hashes = require('./models/hashes')

hashes.getHashForFileNode('http://localhost:8081/me.jpg').then(function() {
  console.log('done')
})
