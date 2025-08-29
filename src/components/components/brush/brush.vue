<template>
  <div class="flex flex-col gap-5 items-center">
    <template v-for="item in brushList" :key="item.name">
      <component :is="item.icon" :size="20" class="cursor-pointer" :class="activeClass(item.name)"
        @click.stop="handleSelectBrush(item.name)" />
    </template>
  </div>
</template>

<script setup>
import brushList from './brush-config';

const props = defineProps({
  curBrush: String
});

const emit = defineEmits(['onSelectBrush']);
const activeClass = (name) => props.curBrush === name ? 'text-green-500' : 'text-white';

const handleSelectBrush = (brushName) => {
  if (props.curBrush === brushName) return;
  emit('onSelectBrush', brushName);
};
</script>