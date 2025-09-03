<template>
    <div :class="method === 'stroke' ? 'stroke-picker' : 'fill-picker'" :style="style" @click.stop="show = !show" />

    <div class="picker-container" :class="method === 'stroke' ? 'stroke' : 'fill'" v-if="show">
        <div class="title">
            <span>{{ title }}</span>
            <X :size="16" color="#fff" @click="show = false" class="cursor-pointer" />
        </div>
        <SketchPicker v-model="color" />
    </div>
</template>

<script setup>
import { ref, watch, watchEffect } from 'vue';
import { SketchPicker } from 'vue-color';
import 'vue-color/style.css';
import { X } from 'lucide-vue-next';


const props = defineProps({
    method: {
        type: String,
        default: 'stroke'
    },
    color: {
        type: String,
        default: 'transparent'
    }
});

const show = ref(false);

const emit = defineEmits(['update:color']);
const color = ref(props.color);

watch(color, (color) => {
    emit('update:color', color);
});

const style = ref('');
const title = ref('');

watchEffect(() => {
    if (props.method === 'fill') {
        style.value = { backgroundColor: color.value };
        title.value = '填充色 (Fill Color)';
    } else {
        style.value = { borderColor: color.value };
        title.value = '描边色 (Stroke Color)';
    }
});

</script>

<style lang="scss" scoped>
.stroke-picker {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    cursor: pointer;
    border: 3px solid;
}

.fill-picker {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    cursor: pointer;
    border: 1px solid rgba(255, 255, 255, 0.5);
}

.picker-container {
    position: fixed;
    top: 250px;
    right: 70px;
    background-color: rgba(0, 0, 0, 0.75);
    padding: 5px;
    border-radius: 6px;
    box-shadow: 0 0 5px #000;
    backdrop-filter: blur(4px);

    .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        font-weight: lighter;
        margin-bottom: 8px;
        font-size: 14px;
    }
}

.picker-container.stroke {
    top: 200px;
}

.picker-container.fill {
    top: 300px;
}
</style>