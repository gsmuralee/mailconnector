'use strict'

const OrientDB = require('orientjs');
const config = require("config");
let db;

const server = {
    "host": "localhost",
    "port": 2424,
    "username": "root",
    "password": "root",
    "pool": {
      "max": 10
    }
}
const credentials = {
    "name":     "luna_local",
    "user":     "admin",
    "password": "admin"
  }
exports.connect = function(){
  if(!db){
      const server = OrientDB(config.get('db.server'));
      db = server.use(config.get('db.database'));
      return db;
  } else {
      return db;
  }
}