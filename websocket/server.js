const Websocket = require("ws");
const wss = new Websocket.Server({ port: 8080 });
wss.on("Connection",function connection(ws){
  console.log("A new client connected");
});
