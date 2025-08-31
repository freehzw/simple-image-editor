<template>
    <div class="w-[20px] h-[20px] rounded-full cursor-pointer border border-solid border-white"
        :style="{ 'background': color }" @click.stop="show = !show">
    </div>
    <div class="fixed top-[200px] right-[70px]">
        <SketchPicker v-model="color" v-if="show" />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { SketchPicker } from 'vue-color';
import 'vue-color/style.css';

const props = defineProps({
    color: {
        type: String,
        default: '#000000'
    }
});

const show = ref(false);

const emit = defineEmits(['update:color']);
const color = ref(props.color);

watch(color, (color) => {
    emit('update:color', color);
});
</script>