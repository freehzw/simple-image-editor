<template>
  <div class="toolbar">
    <Save :size="20" class="cursor-pointer text-sky" @click="confirm" />
    <Eye :size="20" color="#fff" class="cursor-pointer" @click="emit('action', { name: 'preview' })"
      v-if="options.show.preview" />
    <Download :size="20" color="#fff" class="cursor-pointer" @click="emit('action', { name: 'download' })"
      v-if="options.show.download" />

    <div class="divider" />
    <div class="crop-buttons">
      <Crop :size="20" class="cursor-pointer" @click="openCrop" :class="isCropping ? 'text-green' : 'text-white'" />

      <div class="group" v-if="isCropping">
        <Check :size="20" @click="cropImage" class="cursor-pointer text-sky" />
        <X :size="20" @click="closeCrop" class="cursor-pointer text-red" />
      </div>
    </div>

    <div class="divider" />
    <brush :active-brush="activeBrush" @onSelectBrush="handleSelectBrush" />

    <div class="divider" />

    <Undo2 :size="20" color="#fff" class="cursor-pointer" @click="undo" />
    <ZoomIn :size="20" color="#fff" class="cursor-pointer" @click="zoom('in')" title="放大" />
    <ZoomOut :size="20" color="#fff" class="cursor-pointer" @click="zoom('out')" />
    <RefreshCcw :size="20" color="#fff" class="cursor-pointer" @click="reset" />
    <div class="divider" />

    <!-- 取色板 -->
    <ColorPicker v-model:color="strokeColor" method="stroke" />
    <ColorPicker v-model:color="fillColor" method="fill" />
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { Undo2, ZoomIn, ZoomOut, X, Check, RefreshCcw, Download, Eye, Crop, Save } from 'lucide-vue-next';
import brush from '../brush/brush.vue';
import config from '../drawer/config';
import ColorPicker from '../colorPicker/index.vue';


const props = defineProps({
  canvasScale: Number,
  activeBrush: String,
  options: {
    type: Object,
    default: () => ({})
  }
});

// 显示工具栏图标, 默认设置
const defaultOpts = reactive({
  show: {
    download: false,
    preview: false,
  }
});
// 工具栏配置
const options = { ...defaultOpts, ...props.options }
const emit = defineEmits(['action']);
const isCropping = ref(false);

function handleSelectBrush(brush) {
  emit('action', { name: 'selectBrush', value: brush });
}

function undo() {
  emit('action', { name: 'undo' });
}

function zoom(type) {
  let value = 1;

  if (type === 'in' && props.canvasScale < 2) {
    value = parseFloat((props.canvasScale + 0.1).toFixed(1));
  } else if (type === 'out' && props.canvasScale > 0.1) {
    value = parseFloat((props.canvasScale - 0.1).toFixed(1));
  }

  emit('action', { name: 'scale', value: value });
}


function reset() {
  emit('action', { name: 'reset' });
}

function confirm() {
  emit('action', { name: 'confirm' });
}

function openCrop() {
  emit('action', { name: 'openCrop' });
  isCropping.value = true;
}

function closeCrop() {
  isCropping.value = false;
  emit('action', { name: 'closeCrop' });
}

function cropImage() {
  emit('action', { name: 'cropImage' });
}


// 选择stroke颜色
const strokeColor = ref(config.strokeColor);
const fillColor = ref(config.fillColor);

watch(strokeColor, (color) => {
  emit('action', { name: 'setStrokeColor', value: color });
});

watch(fillColor, (color) => {
  emit('action', { name: 'setFillColor', value: color });
});

defineExpose({
  closeCrop,
});

</script>

<style lang="scss" scoped>
.toolbar {
  position: fixed;
  top: 100px;
  right: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: rgba(30, 30, 30, 0.8);
  border-radius: 0.25rem;
  z-index: 1000;
  backdrop-filter: blur(4px);
  box-shadow: 0 0 5px #000;
}

.divider {
  width: 100%;
  height: 1px;
  border: none;
  border-top: 1px solid #444;
}


.crop-buttons {
  position: relative;

  .group {
    position: absolute;
    top: 50%;
    left: -105px;
    padding: 10px;
    transform: translateY(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    background-color: rgba(30, 30, 30, 0.8);
    box-shadow: 0 0 5px #000;
    border-radius: 0.25rem;
  }
}
</style>