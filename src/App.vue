<template>
  <div class="h-screen w-screen">
    <button @click="handleOpenDrawer">打开图片</button>
    <ImageDrawer ref="refImageDrawer" @onSave="handleSave" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ImageDrawer from './components/index.vue';

const refImageDrawer = ref(null);

function handleOpenDrawer() {
  refImageDrawer.value.openUrl('./demo.jpg');
}

function handleSave(base64, file) {
  console.log(base64);
  console.log(file);
}
</script>
