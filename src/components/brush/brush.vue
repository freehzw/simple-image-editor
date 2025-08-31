<template>
  <template v-for="item in brushList" :key="item.name">
    <component :is="item.icon" :size="20" class="cursor-pointer" :class="activeClass(item.name)"
      @click.stop="handleSelectBrush(item.name)" />
  </template>
</template>

<script setup>
import brushList from './brush-config';

const props = defineProps({
  activeBrush: String
});

const emit = defineEmits(['onSelectBrush']);
const activeClass = (name) => props.activeBrush === name ? 'text-green' : 'text-white';

const handleSelectBrush = (brushName) => {
  if (props.activeBrush === brushName) return;
  emit('onSelectBrush', brushName);
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.text-white {
  color: white;
}

.text-green {
  color: green;
}
</style>