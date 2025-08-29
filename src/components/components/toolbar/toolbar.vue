<template>
  <div
    class="absolute top-[150px] right-[50px] flex flex-col items-center gap-5 p-4 border border-solid border-gray-200 rounded">
    <brush :curBrush="curBrush" @onSelectBrush="handleSelectBrush" />

    <div class="divider" />

    <Undo2 :size="20" color="#fff" class="cursor-pointer" @click="handleUndo" />
    <ZoomIn :size="20" color="#fff" class="cursor-pointer" @click="zoom('in')" />
    <ZoomOut :size="20" color="#fff" class="cursor-pointer" @click="zoom('out')" />
    <!-- <span class="imgdw-scale-percent">{{ parseInt(canvasScale * 100) }}%</span> -->

    <div class="divider" />

    <CircleX :size="20" class="cursor-pointer text-red-500" @click="handleCancel" />
    <CircleCheck :size="20" class="cursor-pointer text-green-500" @click="handleConfirm" />
  </div>
</template>

<script setup>
import { Undo2, ZoomIn, ZoomOut, CircleX, CircleCheck } from 'lucide-vue-next';
import brush from '../brush/brush.vue';

const props = defineProps({
  canvasScale: Number,
  curBrush: String
});

const emit = defineEmits(['onSelectBrush', 'onUndo', 'onScale', 'onCancel', 'onConfirm']);

function handleSelectBrush(brush) {
  emit('onSelectBrush', brush);
}

function handleUndo() {
  emit('onUndo');
}

function zoom(type) {
  if (type === 'in' && props.canvasScale < 2) {
    emit('onScale', parseFloat((props.canvasScale + 0.1).toFixed(1)));
  }

  if (type === 'out' && props.canvasScale > 0.1) {
    emit('onScale', parseFloat((props.canvasScale - 0.1).toFixed(1)));
  }
}

function handleCancel() {
  emit('onCancel');
}

function handleConfirm() {
  emit('onConfirm');
}
</script>

<style scoped>
.divider {
  width: 100%;
  height: 1px;
  border: none;
  border-top: 1px solid #fff;
}
</style>
