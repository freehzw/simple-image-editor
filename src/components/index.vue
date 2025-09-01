<template>
  <div class="editor-wrapper" v-if="visible">
    <div class="canvas-wrapper" v-if="imageSize" :style="canvasWrapperStyle" @wheel="handleWheel">
      <img class="image-wrapper" :src="imgBase64" />
      <canvas ref="canvas" :width="imageSize.width" :height="imageSize.height" />
    </div>

    <Toolbar ref="toolbar" :active-brush="activeBrush" :canvas-scale="canvasScale" @action="action" />
  </div>
</template>

<script setup>
import { ref, nextTick, computed } from 'vue';
import Drawer from './drawer/Drawer';
import Toolbar from './toolbar/toolbar.vue';
import { getImg, blobToBase64, getImgSize, base64ToBlob } from './drawer/utils';

const emit = defineEmits(['onSave']);

const visible = ref(false);
const saving = ref(false);
const imageSize = ref(null);
const drawer = ref(null);
const activeBrush = ref('');
const canvasScale = ref(1);
const imgBase64 = ref('');
const canvas = ref(null);
const toolbar = ref(null);

const canvasWrapperStyle = computed(() => ({
  width: `${imageSize.value?.width}px`,
  height: `${imageSize.value?.height}px`,
  transform: `scale(${canvasScale.value})`,
}));

/**
 * 滚轮事件，canvas 放大缩小
 * @param event
 */
const handleWheel = (event) => {
  event.preventDefault();
  const delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
  let scale = canvasScale.value + delta * 0.1;
  scale = Math.max(0.1, Math.min(10, scale)).toFixed(1); // 限制缩放比例在 0.1 到 10 之间
  canvasScale.value = Number(scale);
};


const initData = () => {
  imageSize.value = null;
  activeBrush.value = '';
  canvasScale.value = 1;
  visible.value = true;
  saving.value = false;
};

const openUrl = async (url) => {
  initData();

  const imgBlob = await getImg(url);
  const imgBase64Value = await blobToBase64(imgBlob);
  imageSize.value = await getImgSize(imgBase64Value);
  imgBase64.value = imgBase64Value;

  nextTick(() => {
    drawer.value = new Drawer(canvas.value, imgBase64Value);
    actions.selectBrush('rect'); // 默认选择矩形
  });
};

const openBase64 = async (imgBase64Value) => {
  initData();

  imageSize.value = await getImgSize(imgBase64Value);
  imgBase64.value = imgBase64Value;

  nextTick(() => {
    drawer.value = new Drawer(canvas.value, imgBase64Value);
  });
};

const actions = {
  // 选择画笔工具
  selectBrush: (brush) => {
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
    activeBrush.value = brush;
  },
  // 设置画笔颜色
  setStrokeColor: (color) => {
    drawer.value.setStrokeColor(color);
  },
  // 撤销上一步
  undo: () => {
    drawer.value.history.undo();
  },
  // 放大缩小
  scale: (sizeValue) => {
    canvasScale.value = sizeValue;
  },
  // 取消，关闭画板
  cancel: () => {
    visible.value = false;
  },
  // 保存
  confirm: async () => {
    if (saving.value) return;
    saving.value = true;

    const base64 = await drawer.value.getImage(imageSize.value.scale);
    const imgBlob = base64ToBlob(base64);

    emit('onSave', base64, imgBlob);
    visible.value = false;
  },
  // preview
  preview: async () => {
    const base64 = await drawer.value.getImage(imageSize.value.scale);
    // 将base64转换为Blob URL并在新窗口打开
    const imgBlob = base64ToBlob(base64);
    const blobUrl = URL.createObjectURL(imgBlob);
    window.open(blobUrl, '_blank');
    // 稍后释放URL对象
    setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
  },
  // 下载图片
  download: async () => {
    const base64 = await drawer.value.getImage(imageSize.value.scale);
    const imgBlob = base64ToBlob(base64);

    const a = document.createElement('a');
    a.href = URL.createObjectURL(imgBlob);;
    a.download = 'temp.jpg';
    a.click();
    a.remove(); // 删除新创建的a元素
  }
};

// 处理 action
function action({ name, value }) {
  if (value) actions[name](value);
  else actions[name]();
}


defineExpose({
  openUrl,
  openBase64
});
</script>

<style scoped>
.editor-wrapper {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  z-index: 999;
  padding: 50px;
  background: rgba(0, 0, 0, 0.6);
  overflow-y: auto;
  overflow-x: hidden;
}

.canvas-wrapper {
  position: relative;
  width: 100%;
  background-color: #fff;
  /*  关键：设置缩放中心,这样始终保持图片顶部可见 */
  transform-origin: top center;
}

.image-wrapper {
  position: absolute;
  inset: 0;
  z-index: 0;
}
</style>
