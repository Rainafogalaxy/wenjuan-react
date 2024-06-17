// 通过监听message事件接收来自主线程的消息，当主线程发送文件块到这个worker时，它通过self.onMessage函数处理
self.onmessage = function (e) {
  const { chunk } = e.data;
  const reader = new FileReader(); //使用FileReader对象读取传入的文件块内容
  reader.readAsArrayBuffer(chunk);
  reader.onload = function () {
    //这里的onload事件处理器在文件块读取完成后触发
    const buffer = reader.result;
      const hash = crypto.subtle.digest("SHA-256", buffer).then((hashed) => {
        // 计算完hash后，将hash值从ArrayBuffer转换为一个16进制字符串，便于传输和存储
      const hashArray = Array.from(new Uint8Array(hashed));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      self.postMessage({ hash: hashHex });
    });
  };
};
