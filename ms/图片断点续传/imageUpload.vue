<template>
  <div>
    <input type="file" @change="handleFileChange" />
    <button @click="uploadFile" :disabled="!file">开始上传</button>
    <p v-if="uploadStatus">{{ uploadStatus }}</p>
    <p>Progress: {{ uploadedChunks }}/{{ totalChunks }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const file = ref(null);
const uploadStatus = ref("");
const totalChunks = ref(0); //文件分块总数
const uploadedChunks = ref(0);
const worker = new Worker("/hash-worker.js");

function handleFileChange(event) {
  file.value = event.target.files[0];
}

async function uploadFile() {
  const chunkSize = 1024 * 1024; // 定义每块分割的文件大小为1MB
  totalChunks.value = Math.ceil(file.value.size / chunkSize); //然后向上取整，计算当前上传的文件以供要分为多少块
  uploadedChunks.value = 0; //将上传进度初始化为0
  uploadStatus.value = "上传中..."; //设置当前上传状态

  //实现并行上传文件的关键
  // 目的是将一个大文件切割成多个小块(chunks),然后同时上传这些小块，以提高上传效率和减少总的上传时间
  const uploadPromises = []; //这个数组用来存储每个文件块上传任务的Promise对象
  for (let i = 0; i < totalChunks.value; i++) {
    const chunk = file.value.slice(i * chunkSize, (i + 1) * chunkSize); //切割文件
    uploadPromises.push(uploadChunk(chunk, i)); //上传文件块，函数接收两个参数，一个是当前文件快，一个是当前块的索引
  }
  /* 
   并行处理
   当所有文件块的上传任务都被初始化并存储在  uploadPromises 数组中后，使用Promise.all(uploadPromises)
   来等待所有上传任务完成
*/
  Promise.all(uploadPromises)
    .then(() => {
      uploadStatus.value = "所有块上传完成，正在合并...";
      combineChunks();
    })
    .catch((error) => {
      uploadStatus.value = "上传失败";
      console.error("Upload error:", error);
    });
}

async function uploadChunk(chunk, index) {
  return new Promise((resolve, reject) => {
    worker.postMessage({ chunk });
    worker.onmessage = async function (e) {
      const { hash } = e.data;
      try {
        const formData = new FormData();
        formData.append("file", chunk);
        formData.append("hash", hash);
        formData.append("index", index);
        await axios.post("http://localhost:3000/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        uploadedChunks.value++;
        resolve();
      } catch (error) {
        reject(error);
      }
    };
  });
}

async function combineChunks() {
  try {
    await axios.post("http://localhost:3000/combine", {
      fileName: file.value.name,
      totalChunks: totalChunks.value,
    });
    uploadStatus.value = "文件合并成功";
  } catch (error) {
    uploadStatus.value = "文件合并失败";
    console.error("Combine error:", error);
  }
}
</script>
