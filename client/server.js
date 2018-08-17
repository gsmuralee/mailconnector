const express = require("express");
const path = require("path");
const LOCALPORT = 5000;
var app = express();
app.use(express.static(path.join(__dirname,"./build")));
app.listen(LOCALPORT,function(){
    console.log("Started listening on port", LOCALPORT);
})
