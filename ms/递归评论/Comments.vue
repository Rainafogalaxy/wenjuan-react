<template>
  <div>
    <div v-for="comment in treeComments" :key="comment.id">
      <CommentComponent :comment="comment" @delete="deleteComment" />
    </div>
    <form @submit.prevent="submitComment">
      <textarea v-model="newComment" placeholder="写下你的评论..."></textarea>
      <button type="submit">提交</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import CommentComponent from "./CommentComponent.vue";

const comments = ref([]);
const treeComments = ref([]);
const newComment = ref("");
const postId = 1; // 假设这是以某种方式提供的，例如通过属性或上下文

// 从服务器获取评论并构建树结构
const fetchComments = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/posts/${postId}/comments`
    );
    comments.value = response.data;
    treeComments.value = buildTree(); // 构建评论的树形结构
  } catch (error) {
    console.error("获取评论失败:", error);
  }
};

// 递归函数构建树结构
const buildTree = (parentId = null) => {
  return comments.value
    .filter((comment) => comment.parent_id === parentId)
    .map((comment) => ({
      ...comment,
      children: buildTree(comment.id), // 递归调用
    }));
};

const submitComment = async () => {
  const response = await axios.post("http://localhost:3000/comments", {
    content: newComment.value,
    author_id: 1, // 假设用户ID已知
    parent_id: null, // 如果回复其他评论，则需要设置
    post_id: postId,
  });
  newComment.value = "";
  comments.value.push(response.data);
  treeComments.value = buildTree(); // 重新构建评论树以包含新评论
};

const deleteComment = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/comments/${id}`);
    comments.value = comments.value.filter((comment) => comment.id !== id);
    treeComments.value = buildTree(); // 删除后重新构建树
  } catch (error) {
    console.error("删除评论失败:", error);
  }
};

onMounted(fetchComments);
</script>

<style scoped>
.comment {
  margin-bottom: 10px;
}
</style>
