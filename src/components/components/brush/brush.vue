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
  activeBrush: String
});

const emit = defineEmits(['onSelectBrush']);
const activeClass = (name) => props.activeBrush === name ? 'text-green-500' : 'text-white';

const handleSelectBrush = (brushName) => {
  if (props.activeBrush === brushName) return;
  emit('onSelectBrush', brushName);
};
</script>