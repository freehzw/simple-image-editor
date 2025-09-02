<template>
    <div class="cropper-wrapper">
        <cropper ref="cropperRef" :src="imageSrc" @change="change" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const props = defineProps({
    imageSrc: String, // base64
});

const emit = defineEmits(['cropped', 'close']);

const cropperRef = ref(null);
const imageSrc = ref(props.imageSrc);


let canvasBase64 = null; // 生成的图片base64


// 裁剪图片，可以向父组件发送图片base64，也可以直接返回新的图片base64
function cropImage() {
    imageSrc.value = canvasBase64;
    emit('cropped', canvasBase64);

    return canvasBase64;
}

function change({ coordinates, canvas }) {
    // 获取裁剪的坐标 {width, height, left, top}
    // console.log(coordinates);
    canvasBase64 = canvas.toDataURL();
}

defineExpose({
    cropImage,
});


</script>
<style scoped>
.cropper-wrapper {
    position: absolute;
    inset: 0;
}
</style>