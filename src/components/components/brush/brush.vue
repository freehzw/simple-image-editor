<template>
  <div class="flex flex-col gap-4">
    <template v-for="item in brushList" :key="item.name">
      <component :is="item.icon" :size="24" class="cursor-pointer" :class="activeClass(item.name)"
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

const handleSelectBrush = (brush) => {
  if (props.curBrush === brush) return;
  emit('onSelectBrush', brush);
};
</script>