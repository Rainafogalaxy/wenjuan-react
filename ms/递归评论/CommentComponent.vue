<template>
  <div class="comment">
    <div class="content">
      <strong>User {{ comment.author_id }}:</strong> {{ comment.content }}
      <button @click="$emit('delete', comment.id)">删除</button>
    </div>
    <div class="replies" v-if="comment.children && comment.children.length">
      <CommentComponent
        v-for="child in comment.children"
        :key="child.id"
        :comment="child"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps, emit } from "vue";

const props = defineProps({
  comment: Object,
});

const handleDelete = (id) => {
  emit("delete", id); // 触发删除事件
};
</script>

<style scoped>
.comment {
  margin-left: 20px;
  border-left: 1px solid #ccc;
  padding-left: 20px;
}
</style>
