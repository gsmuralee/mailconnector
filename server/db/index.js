'use strict'

const OrientDB = require('orientjs');
let db;

const serverConf = {
    "host": "localhost",
    "port": 2424,
    "username": "root",
    "password": "root",
    "pool": {
      "max": 10
    }
}
const config = {
    "name":     "luna_latest",
    "user":     "admin",
    "password": "admin"
  }
exports.connect = function(){
  if(!db){
      const server = OrientDB(serverConf);
      db = server.use(config);
      return db;
  } else {
      return db;
  }
}