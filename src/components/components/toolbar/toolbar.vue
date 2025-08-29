<template>
  <draggable class="imgdw-toolbar flex flex-col gap-4 p-4" ref="draggableRef">
    <brush :curBrush="curBrush" @onSelectBrush="handleSelectBrush" />

    <!-- <div class="imgdw-split-line" /> -->

    <!-- <icon class="imgdw-btn imgdw-btn-undo" icon="icon-chexiao" @click.native.stop="handleUndo" /> -->
    <!-- <icon class="imgdw-btn imgdw-btn-narrow" icon="icon-suoxiao" @click.native.stop="handleScale('narrow')" />
    <icon class="imgdw-btn imgdw-btn-enlarge" icon="icon-fangda" @click.native.stop="handleScale('enlarge')" /> -->
    <Undo2 :size="24" color="#fff" class="cursor-pointer" @click="handleUndo" />
    <ZoomIn :size="24" color="#fff" class="cursor-pointer" @click="handleScale('enlarge')" />
    <ZoomOut :size="24" color="#fff" class="cursor-pointer" @click="handleScale('narrow')" />
    <!-- <span class="imgdw-scale-percent">{{ parseInt(canvasScale * 100) }}%</span> -->

    <!-- <icon class="imgdw-btn imgdw-btn-cancel" icon="icon-guanbi" @click.native.stop="handleCancel" /> -->
    <!-- <icon class="imgdw-btn imgdw-btn-confirm" icon="icon-duigou" @click.native.stop="handleConfirm" /> -->
    <CircleX :size="24" class="cursor-pointer text-red-500" @click="handleCancel" />
    <CircleCheck :size="24" class="cursor-pointer text-green-500" @click="handleConfirm" />
  </draggable>
</template>

<script setup>
import { ref } from 'vue';
import icon from '../icon/icon.vue';
import { Undo2, ZoomIn, ZoomOut, CircleX, CircleCheck } from 'lucide-vue-next';
import draggable from '../draggable/draggable.vue';
import brush from '../brush/brush.vue';

const props = defineProps({
  canvasScale: Number,
  curBrush: String
});

const draggableRef = ref(null);

const emit = defineEmits(['onSelectBrush', 'onUndo', 'onScale', 'onCancel', 'onConfirm']);

function initPosition() {
  // this.$refs.draggable.initPosition();
  draggableRef.value.initPosition();
}

function handleSelectBrush(brush) {
  emit('onSelectBrush', brush);
}

function handleUndo() {
  emit('onUndo');
}

function handleScale(type) {
  if (type === 'enlarge' && props.canvasScale < 2) {
    emit('onScale', parseFloat((props.canvasScale + 0.1).toFixed(1)));
  }

  if (type === 'narrow' && props.canvasScale > 0.1) {
    emit('onScale', parseFloat((props.canvasScale - 0.1).toFixed(1)));
  }
}

function handleCancel() {
  emit('onCancel');
}

function handleConfirm() {
  emit('onConfirm');
}

defineExpose({
  initPosition
});
</script>
<script>
export default {
  name: 'imgdwToolbar',
};
</script>
<style lang="less" scoped>
.imgdw-toolbar {
  position: absolute;
  // width: 40px;
  // height: 42px;
  background-color: rgb(162, 163, 175);
  // display: flex;
  // align-items: center;
  padding: 0 15px;
  border-radius: 2px;
  box-shadow: 0 0 3px 0 #333;

  * {
    user-select: none;
  }
}

.imgdw-btn {
  font-size: 26px;
  cursor: pointer;
  color: #fff;
}

.imgdw-split-line {
  height: 24px;
  border-right: 1px solid #ddd;
  margin-right: 20px;
}

.imgdw-scale-percent {
  width: 60px;
}
</style>
