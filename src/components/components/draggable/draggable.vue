<template>
  <!--  -->
  <div class="imgdw-draggable" ref="draggable" @mousedown="handleDragStart" @mouseup="handleDragEnd"
    :style="{ top: position.y + 'px', left: position.x + 'px' }">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const draggable = ref(null);
const position = ref({
  x: 0,
  y: 0
});
let subX = ref(0);
let subY = ref(0);

const initPosition = () => {
  if (draggable.value) {
    let width = draggable.value.clientWidth;
    let height = draggable.value.clientHeight;
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    // position.value.x = windowWidth - width - 50;
    // position.value.y = windowHeight - height - 50;
    position.value.x = windowWidth - 150;
    position.value.y = windowHeight - 50;
  }
};

const handleDragStart = (e) => {
  if (draggable.value) {
    subX.value = e.pageX - draggable.value.offsetLeft;
    subY.value = e.pageY - draggable.value.offsetTop;
    document.addEventListener('mousemove', handleMouseMove);
  }
};

const handleDragEnd = () => {
  document.removeEventListener('mousemove', handleMouseMove);
};

const handleMouseMove = (e) => {
  position.value = {
    x: e.pageX - subX.value,
    y: e.pageY - subY.value
  };
};

onMounted(() => {
  initPosition();
});

defineExpose({
  initPosition
});
</script>

<style scoped>
.imgdw-draggable {
  position: absolute;
  top: 50px;
  right: 50px;
  cursor: move;
}
</style>
