'use strict';

class Sprite{
  constructor(img, width, height){
    this.img = new Image();
    this.img.src = img;
    this.x = this.y = 0;
    this.width = width || 32;
    this.height = height || 32;
    this.frame = 0;
    this.vx = this.vy = 0;
    this.shiftX = this.shiftY = 0;
    this.rotate = 0;
  }

  update(canvas){
    this.render(canvas);
    this.openterFrame();
    this.x += this.vx;
    this.y += this.vy;
  }

  render(canvas){
    if(this.x + this.shiftX < -1 * this.width || this.x + this.shiftX > canvas.width) return;
    if(this.y + this.shiftY < -1 * this.height || this.y + this.shiftY > canvas.height) return;

    const frameX = this.frame % (this.img.width / this.width);
    const frameY = Math.floor(this.frame / (this.img.width / this.width));

    const ctx = canvas.getContext('2d');
    const _translateX = this.x + this.width / 2 + this.shiftX;
    const _translateY = this.y + this.height / 2 + this.shiftY;
    ctx.save();
    ctx.translate(_translateX, _translateY);
    ctx.rotate(this.rotate * Math.PI / 180);
    ctx.translate(-1 * _translateX, -1 * _translateY);
    ctx.drawImage(
      this.img, 
      this.width * frameX, 
      this.height * frameY, 
      this.width,
      this.height,
      this.x + this.shiftX, 
      this.y + this.shiftY, 
      this.width, 
      this.height
      );
    ctx.restore();
  }

  getRelactiveFingerPosition(fingerPosition){
    const _relactiveFingerPosition = {
      x: fingerPosition.x - this.x - this.shiftX,
      y: fingerPosition.y - this.y - this.shiftY
    };

    const inRange = (num, min, max) =>{
      const _inRange = (min <= num && num <= max);
      return _inRange;
    }

    if(
    inRange(_relactiveFingerPosition.x, 0, this.width) && 
    inRange(_relactiveFingerPosition.y, 0, this.height)) 
    return _relactiveFingerPosition;
    return false;
  }

  assignTouchevent(eventType, fingerPosition){
    const _relactiveFingerPosition = this.getRelactiveFingerPosition(fingerPosition);

    switch(eventType){
      case 'touchstart':
        if(_relactiveFingerPosition) this.ontouchstart(_relactiveFingerPosition.x, _relactiveFingerPosition.y);
        break;
      case 'touchmove':
        if(_relactiveFingerPosition) this.ontouchmove(_relactiveFingerPosition.x, _relactiveFingerPosition.y);
        break;
      case 'touchend':
        this.ontouchend(_relactiveFingerPosition.x, _relactiveFingerPosition.y);
        break;
    }
  }

  openterFrame() {}

  ontouchstart() {}

  ontouchmove() {}

  ontouchend() {}
}