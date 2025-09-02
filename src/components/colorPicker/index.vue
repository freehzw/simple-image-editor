<template>
    <div class="color-picker" :style="{ backgroundColor: color }" @click.stop="show = !show" />

    <div class="color-picker-container">
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

<style scoped>
.color-picker {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    cursor: pointer;
    border: 1px solid #ffffff;
}

.color-picker-container {
    position: fixed;
    top: 250px;
    right: 120px;
}
</style>