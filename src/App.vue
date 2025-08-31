<template>
  <div class="">
    <button @click="handleOpenDrawer">打开图片</button>
    <ImageDrawer ref="imageDrawerRef" @onSave="onSave" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ImageDrawer from './components/index.vue';

const imageDrawerRef = ref(null);

function handleOpenDrawer() {
  imageDrawerRef.value.openUrl('./demo.jpg');
}

function onSave(base64, file) {
  console.log(base64);
  console.log(file);
}
</script>
