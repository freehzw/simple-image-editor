<template>
    <div>
        <ColorPicker format="rgb" shape="circle" picker-type="chrome" v-model:pureColor="color" round-history />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";


const props = defineProps({
    color: {
        type: String,
        default: '#000000'
    }
});

const emit = defineEmits(['update:color']);
const color = ref(props.color);

watch(color, (color) => {
    emit('update:color', color);
});
</script>


<style scoped>
:deep(.vc-color-wrap) {
    margin: 0;
}
</style>