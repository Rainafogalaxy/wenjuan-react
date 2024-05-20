const webSocket = new webSocket("ws://example.com/socket");
const state = webSocket.readyState;
if (state === WebSocket.CONNECTING) {
  //表示连接正在建立阶段
} else if (state === webSocket.OPEN) {
  //表示连接已经建立且可以通信
} else if (state === webSocket.CLOSING) {
  //表示连接正在关闭的过程
}else if(state === webSocket.CLOSED){
  // 表示连接已经关闭或者未能建立连接
}
