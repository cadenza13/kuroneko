'use strict';

class Text{
  constructor(text){
    this.text = text;
    this.font = "游ゴシック体, 'Yu Gothic', YuGothic, sans-serif";
    this.x = this.y = 0;
    this.vx = this.vy = 0;
    this.baseline = 'top';
    this.size = 20;
    this.color = '#ffffff';
    this.weight = 'normal';
    this.width = 0;
    this.height = 0;
    this.isCenter = false;
    this.isMiddle = false;
  }

  center(){
    this.isCenter = true;
    return this;
  }

  middle(){
    this.baseline = 'middle';
    this.isMiddle = true;
    return this;
  }

  update(canvas){
    const ctx = canvas.getContext('2d');

    ctx.font = `${this.weight} ${this.size}px ${this.font}`;
    ctx.fillStyle = this.color;
    ctx.textBaseline = this.baseline;

    this.width = ctx.measureText(this.text).width;
    this.height = 
    Math.abs(ctx.measureText(this.text).actualBoundingBoxAscent) + 
    Math.abs(ctx.measureText(this.text).actualBoundingBoxDescent);

    if(this.isCenter) this.x = (canvas.width - this.width) / 2;
    if(this.isMiddle) this.y = canvas.height / 2;

    this.render(canvas, ctx);
    this.openterFrame();

    this.x += this.vx;
    this.y += this.vy;
  }

  render(canvas, ctx){
    if(this.x < -1 * this.width || this.x > canvas.width) return;
    if(this.y < -1 * this.height || this.y > canvas.height + this.height) return;

    ctx.fillText(this.text, this.x, this.y);
  }

  getRelactiveFingerPosition(fingerPosition){
    let _relactiveFingerPosition = {
      x: fingerPosition.x - this.x,
      y: fingerPosition.y - this.y + this.height
    };
    if(this.baseline === 'top' || this.baseline === 'hanging'){
      _relactiveFingerPosition = {
        x: fingerPosition.x - this.x,
        y: fingerPosition.y - this.y
      };
    }
    if(this.baseline === 'middle'){
      _relactiveFingerPosition = {
        x: fingerPosition.x - this.x,
        y: fingerPosition.y + this.height / 2
      };
    }

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