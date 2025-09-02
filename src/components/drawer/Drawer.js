import { fabric } from 'fabric';
import config from './config';
import Rect from './Rect';
import Circle from './Circle';
import Text from './Text';
import Cropper from './Cropper';
import Freedraw from './Freedraw';
import History from './History';

class Drawer {
  constructor(el, imgBase64) {
    this.canvas = new fabric.Canvas(el, {
      ...config.canvas
    });
    this.imgBase64 = imgBase64;
    this.history = new History(this.canvas);
    this.strokeColor = config.strokeColor;

    this.rect = new Rect(this.canvas, this.history);
    this.circle = new Circle(this.canvas, this.history);
    this.text = new Text(this.canvas, this.history);
    this.freedraw = new Freedraw(this.canvas, this.history);
    this.cropper = new Cropper(this.canvas, this.history);

    this.initEvent();
  }

  initEvent = () => {
    // loadFromJSON 后部分配置会丢失，需要选中的时候重新设置
    this.canvas.on('selection:created', e => {
      if (e.target) {
        e.target.setControlVisible('mtr', false);
      }
    });
  };

  clearPrevBrush() {
    // 清除文字聚焦
    this.text.blur();
    // 清除上一个画笔的事件
    if (this.fnClearPrevBrush) this.fnClearPrevBrush();
  }

  drawRect() {
    this.clearPrevBrush();
    this.fnClearPrevBrush = this.rect.init();
  }

  drawCircle() {
    this.clearPrevBrush();
    this.fnClearPrevBrush = this.circle.init();
  }

  drawText() {
    this.clearPrevBrush();
    this.fnClearPrevBrush = this.text.init();
  }

  drawLine() {
    this.clearPrevBrush();
    this.fnClearPrevBrush = this.freedraw.init();
  }

  // drawCropper() {
  //   this.clearPrevBrush();
  //   this.fnClearPrevBrush = this.cropper.init();
  // }

  setStrokeColor(color) {
    this.strokeColor = color;
    this.rect.strokeColor = color;
    this.circle.strokeColor = color;
    this.freedraw.strokeColor = color;
    this.text.fontcolor = color;
  }

  getImage = scale => {
    return new Promise(resolve => {
      let img = new Image();
      img.src = this.imgBase64;

      // 等待图片加载完成后再设置背景
      img.onload = () => {
        let bgImg = new fabric.Image(img);
        bgImg.set({ scaleX: scale, scaleY: scale, originX: 'left', originY: 'top' });

        this.canvas.setBackgroundImage(bgImg, () => {
          let base64 = this.canvas.toDataURL({ // fabric.js 默认生成 PNG 图片
            format: 'jpeg', // 指定生成 JPG 图片
            quality: 0.85, // 指定 JPG 图片的质量，范围是 0 到 1
          });
          resolve(base64);
        });
      };
    });
  };

  // 销毁画布
  dispose = async () => {
    if (this.canvas) {
      await this.canvas.dispose();
      this.canvas = null;
    }
  }
}

export default Drawer;
