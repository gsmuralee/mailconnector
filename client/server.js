const express = require("express");
const path = require("path");
const LOCALPORT = 9090;
var app = express();
app.use(express.static(path.join(__dirname,"./build")));
app.listen(LOCALPORT,function(){
    console.log("Started listening on port", LOCALPORT);
})
