# 简单的图像编辑器

Fork自[vue-image-annotation](https://github.com/wawjqyh/vue-image-annotation), 基于`fabric.js`, 支持vue3，增加了裁切图片，取色器，滚轮缩放等功能。

![截图](https://github.com/freehzw/simple-image-editor/raw/master/screen.jpg)

## 安装
```bash
npm install @freehzw/simple-image-editor
或
yarn add @freehzw/simple-image-editor
```

## 使用
```vue
<template>
  <div>
    <button @click="open">打开图片</button>
    <SimpleImageEditor ref="imageDrawerRef" @onSave="onSave" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { SimpleImageEditor } from '@freehzw/simple-image-editor';
import '@freehzw/simple-image-editor/style.css';

const imageDrawerRef = ref(null);

function open() {
  imageDrawerRef.value.openUrl('./demo.jpg');
}

function onSave(base64, file) {
  console.log(base64);
  console.log(file);
}
</script>
```