<template>
    <div class="cropper-wrapper">
        <cropper ref="cropperRef" :src="imageSrc" @change="change" />

        <div class="button-group">
            <button @click="cropImage" v-if="imageSrc">
                <Check :size="20" />
            </button>
            <!-- <button @click="restore" v-if="isChanged">
                <RefreshCcw :size="20" />
            </button> -->

            <button @click="close" v-if="imageSrc">
                <X :size="20" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import { Check, RefreshCcw, X } from 'lucide-vue-next';

const props = defineProps({
    imageSrc: String, // base64
});

const emit = defineEmits(['cropped', 'close']);

const cropperRef = ref(null);
const imageSrc = ref(props.imageSrc);
const isChanged = ref(false);

let originBase64 = props.imageSrc; // 原始图片base64
let canvasBase64 = null; // 生成的图片base64


// 裁剪图片
function cropImage() {
    imageSrc.value = canvasBase64;
    isChanged.value = true;
    emit('cropped', canvasBase64);
}

function change({ coordinates, canvas }) {
    // 获取裁剪的坐标 {width, height, left, top}
    console.log(coordinates);
    // 获取裁剪后的图片base64
    // canvasBase64 = canvas.toDataURL('image/jpeg');
    canvasBase64 = canvas.toDataURL();
}

function restore() {
    imageSrc.value = originBase64;
    isChanged.value = false;
    emit('cropped', originBase64);
}

function close() {
    isChanged.value = false;
    emit('close');
}

</script>
<style scoped>
.cropper-wrapper {
    position: absolute;
    inset: 0;
}

.button-group {
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

button {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #fff;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    cursor: pointer;
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
}
</style>