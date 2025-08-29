<template>
  <div class="imgdw-wrapper" v-if="visible">
    <div class="imgdw-canvas-wrapper" v-if="size" :style="{
      width: `${size.width}px`,
      height: `${size.height}px`,
      transform: `translate(-50%, -50%) scale(${canvasScale})`
    }">
      <img class="imgdw-imgbg" :src="imgBase64" />
      <canvas ref="canvas" :width="size.width" :height="size.height"></canvas>
    </div>

    <Toolbar ref="toolbar" :curBrush="curBrush" :canvasScale="canvasScale" @onSelectBrush="handleSelectBrush"
      @onUndo="handleUndo" @onScale="handleScale" @onCancel="handleCancel" @onConfirm="handleConfirm" />
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import Drawer from './drawer/Drawer';
import Toolbar from './components/toolbar/toolbar.vue';
import { getImg, blobToBase64, getImgSize, base64ToBlob } from './drawer/utils';

const visible = ref(false);
const saving = ref(false);
const size = ref(null);
const drawer = ref(null);
const curBrush = ref('');
const canvasScale = ref(1);
const imgBase64 = ref('');
const canvas = ref(null);
const toolbar = ref(null);

const emit = defineEmits(['onSave']);

const initData = () => {
  size.value = null;
  curBrush.value = '';
  canvasScale.value = 1;
  visible.value = true;
  saving.value = false;
  // nextTick(() => {
  //   toolbar.value.initPosition();
  // });
};

const openUrl = async (url) => {
  initData();

  const imgBlob = await getImg(url);
  const imgBase64Value = await blobToBase64(imgBlob);
  size.value = await getImgSize(imgBase64Value);
  imgBase64.value = imgBase64Value;

  nextTick(() => {
    drawer.value = new Drawer(canvas.value, imgBase64Value);
  });
};

const openBase64 = async (imgBase64Value) => {
  initData();

  size.value = await getImgSize(imgBase64Value);
  imgBase64.value = imgBase64Value;

  nextTick(() => {
    drawer.value = new Drawer(canvas.value, imgBase64Value);
  });
};

const handleSelectBrush = (brush) => {
  switch (brush) {
    case 'rect':
      drawer.value.drawRect();
      break;
    case 'circle':
      drawer.value.drawCircle();
      break;
    case 'text':
      drawer.value.drawText();
      break;
    case 'line':
      drawer.value.drawLine();
      break;
  }

  curBrush.value = brush;
};

const handleUndo = () => {
  drawer.value.history.undo();
};

const handleScale = (sizeValue) => {
  canvasScale.value = sizeValue;
};

const handleCancel = () => {
  visible.value = false;
};

const handleConfirm = async () => {
  if (saving.value) return;
  saving.value = true;

  let base64 = await drawer.value.getImage(size.value.scale);
  let imgBlob = await base64ToBlob(base64);

  visible.value = false;

  emit('onSave', base64, imgBlob);
};

defineExpose({
  openUrl,
  openBase64
});
</script>

<style lang="less" scoped>
.imgdw-wrapper {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.6);
  overflow: auto;
}

.imgdw-canvas-wrapper {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: auto;
  background-color: #fff;
  padding: 10px;
  border: 1px solid #fff;
}

.imgdw-imgbg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
}
</style>
