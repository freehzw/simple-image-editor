import { fabric } from 'fabric';
import config from './config';

class Cropper {
    isCropping = false;
    strokeWidth = 2;
    strokeColor = 'green';
    fillColor = 'transparent';
    coord = [];

    constructor(canvas, history) {
        this.canvas = canvas;
        this.history = history;
        this.curRect = null;
    }

    init = () => {
        return this.initEvent();
    };

    initEvent = () => {
        this.canvas.on('mouse:down', this.onMouseDown);
        this.canvas.on('mouse:move', this.onMouseMove);
        this.canvas.on('mouse:up', this.onMouseUp);

        return () => {
            this.canvas.off('mouse:down', this.onMouseDown);
            this.canvas.off('mouse:move', this.onMouseMove);
            this.canvas.off('mouse:up', this.onMouseUp);
        };
    };

    onMouseDown = e => {
        if (e.target) return;

        this.isCropping = true;

        let pointer = this.canvas.getPointer(e.e);
        this.startX = pointer.x;
        this.startY = pointer.y;
        // 重绘图像 (每次鼠标点击都要重绘，清除之前的矩形),保证每次只显示一个矩形
        if (this.curRect) {
            this.canvas.remove(this.curRect);
        }

        let curRect = new fabric.Rect({
            ...config.rect,
            ...config.controls,

            left: this.startX,
            top: this.startY,
            originX: 'left',
            originY: 'top',
            width: pointer.x - this.startX,
            height: pointer.y - this.startY,
            stroke: this.strokeColor,
            strokeWidth: this.strokeWidth,
            fill: this.fillColor
        });

        curRect.setControlVisible('mtr', false);

        this.canvas.add(curRect);
        this.curRect = curRect;
    };

    onMouseMove = e => {
        if (!this.isCropping) return;

        let pointer = this.canvas.getPointer(e.e);

        if (this.startX > pointer.x) {
            this.curRect.set({ left: Math.abs(pointer.x) });
        }
        if (this.startY > pointer.y) {
            this.curRect.set({ top: Math.abs(pointer.y) });
        }
        this.curRect.set({ width: Math.abs(this.startX - pointer.x) });
        this.curRect.set({ height: Math.abs(this.startY - pointer.y) });
        this.curRect.setCoords();

        this.canvas.renderAll();
    };

    onMouseUp = () => {
        if (this.isCropping) {
            this.history.record();
        }

        this.isCropping = false;
        this.coord = this.curRect.getCoords();
        // console.log(this.curRect.getBoundingRect());
        // console.log(this.curRect.toDataURL());
        this.update();
    };
    // update = () => {
    //     if (!this.curRect) return;

    //     const { left, top, width, height } = this.curRect.getBoundingRect();

    //     const objects = this.canvas.getObjects()
    //     let img = null
    //     // 移除图片元素
    //     for (const i in objects) {
    //         if (objects[i].type === 'image') {
    //             img = objects[i]
    //             break
    //         }
    //     }
    //     // 创建一个新的画布来绘制裁剪后的图像
    //     const croppedCanvas = document.createElement('canvas');
    //     croppedCanvas.width = width;
    //     croppedCanvas.height = height;
    //     const croppedCtx = croppedCanvas.getContext('2d');

    //     // 使用 drawImage() 的裁剪功能
    //     croppedCtx.drawImage(
    //         img.getElement(),
    //         left,        // 源图像的起始 X 坐标
    //         top,        // 源图像的起始 Y 坐标
    //         width,         // 源图像的宽度
    //         height,        // 源图像的高度
    //         0,             // 目标画布的起始 X 坐标
    //         0,             // 目标画布的起始 Y 坐标
    //         width,         // 目标画布的宽度
    //         height          // 目标画布的高度
    //     );

    //     // 将裁剪后的画布转换为 Data URL
    //     const croppedDataURL = croppedCanvas.toDataURL('image/jpeg');  // 可以更改图像格式

    //     // 创建预览图片
    //     const previewImage = document.createElement('img');
    //     previewImage.src = croppedDataURL;
    //     previewContainer.appendChild(previewImage);
    // }
    update() {
        if (!this.curRect) return;

        const { left, top, width, height } = this.curRect.getBoundingRect()

        const objects = this.canvas.getObjects()
        let img = null
        // 移除图片元素
        for (const i in objects) {
            if (objects[i].type === 'image') {
                img = objects[i]
                break
            }
        }

        if (img && img.type === 'image') {
            // 获取图片的真实坐标
            const imgTopLeft = img.getPointByOrigin('left', 'top')
            const imgLeft = imgTopLeft.x
            const imgTop = imgTopLeft.y

            // 计算裁剪矩形相对于图片的坐标和大小
            const rectLeft = (left - imgLeft) / (img.scaleX || 1);
            const rectTop = (top - imgTop) / (img.scaleY || 1)
            const rectWidth = width / (img.scaleX || 1);
            const rectHeight = height / (img.scaleY || 1);

            // 创建裁剪后的 Canvas 元素
            const cropCanvas = document.createElement('canvas')
            const cropCtx = cropCanvas.getContext('2d')

            // 设置 Canvas 尺寸与裁剪区域相同
            cropCanvas.width = width
            cropCanvas.height = height

            // 将图片数据绘制到 Canvas 上进行裁剪
            cropCtx.drawImage(
                img.getElement(),
                rectLeft, // 裁剪区域在原始图片中的 x 坐标
                rectTop, // 裁剪区域在原始图片中的 y 坐标
                rectWidth, // 裁剪区域的宽度
                rectHeight, // 裁剪区域的高度
                0, // 在目标 Canvas 中绘制的 x 坐标（目标 Canvas 的左上角）
                0, // 在目标 Canvas 中绘制的 y 坐标（目标 Canvas 的左上角）
                width, // 在目标 Canvas 中绘制的宽度（裁剪区域的宽度）
                height // 在目标 Canvas 中绘制的高度（裁剪区域的高度）
            );

            // 创建裁剪后的 Fabric.Image 对象
            fabric.Image.fromURL(cropCanvas.toDataURL(), (croppedImg) => {
                // 设置裁剪后图片的位置和尺寸
                croppedImg.set({
                    left: left,
                    top: top,
                    scaleX: img.scaleX,
                    scaleY: img.scaleY
                })

                // 替换原始图片对象
                this.canvas.remove(img)
                this.canvas.add(croppedImg)
                this.canvas.setActiveObject(croppedImg)

                // 清除裁剪矩形对象
                this.removeCropRect()

                // 渲染画布
                this.canvas.renderAll()
            })
        }
    }
}


export default Cropper;
