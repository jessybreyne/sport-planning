module.exports = {
  mongodb: {
    local:{
      host: '127.0.0.1', //127.0.0.1
      port:'27017',
      db: 'plannings'
    },
    docker:{
      host: 'mongo',
      port:'27017',
      db: 'plannings'
    }
  },
  express: {
    cookieSecret: 'secret',
    port: 3000,
    docker:{
      ip: '0.0.0.0'
      },
    local:{
      ip: '127.0.0.1'
    },
  }
}
