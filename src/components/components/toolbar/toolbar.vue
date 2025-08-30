<template>
  <div
    class="fixed top-[50px] right-[50px] flex flex-col items-center gap-4 p-4 bg-neutral-800/50 rounded-xl z-10 backdrop-blur-sm">
    <CircleX :size="20" class="cursor-pointer text-red-500" @click="cancel" />
    <CircleCheck :size="20" class="cursor-pointer text-sky-500" @click="confirm" />

    <div class="divider" />

    <brush :active-brush="activeBrush" @onSelectBrush="handleSelectBrush" />

    <div class="divider" />

    <Undo2 :size="20" color="#fff" class="cursor-pointer" @click="undo" />
    <ZoomIn :size="20" color="#fff" class="cursor-pointer" @click="zoom('in')" title="放大" />
    <ZoomOut :size="20" color="#fff" class="cursor-pointer" @click="zoom('out')" />
    <RefreshCcw :size="20" color="#fff" class="cursor-pointer" @click="zoom('reset')" />
    <div class="divider" />

    <!-- 取色板 -->
    <ColorPicker v-model:color="strokeColor" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Undo2, ZoomIn, ZoomOut, CircleX, CircleCheck, RefreshCcw } from 'lucide-vue-next';
import brush from '../brush/brush.vue';
import config from '../../drawer/config';
import ColorPicker from '../colorPicker/index.vue';

const props = defineProps({
  canvasScale: Number,
  activeBrush: String
});

// const emit = defineEmits(['selectBrush', 'undo', 'scale', 'cancel', 'confirm']);
const emit = defineEmits(['action']);


function handleSelectBrush(brush) {
  emit('action', { name: 'selectBrush', value: brush });
}

function undo() {
  emit('action', { name: 'undo' });
}

function zoom(type) {
  let value = 1;

  if (type === 'reset') {
    value = 1;
  } else if (type === 'in' && props.canvasScale < 2) {
    value = parseFloat((props.canvasScale + 0.1).toFixed(1));
  } else if (type === 'out' && props.canvasScale > 0.1) {
    value = parseFloat((props.canvasScale - 0.1).toFixed(1));
  }

  emit('action', { name: 'scale', value: value });
}

function cancel() {
  emit('action', { name: 'cancel' });
}

function confirm() {
  emit('action', { name: 'confirm' });
}

// 选择stroke颜色
const strokeColor = ref(config.strokeColor);

watch(strokeColor, (color) => {
  emit('action', { name: 'setStrokeColor', value: color });
});

</script>

<style scoped>
.divider {
  width: 100%;
  height: 1px;
  border: none;
  border-top: 1px solid #777;
}
</style>
