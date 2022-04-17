'use strict';

class DPad extends Sprite{
  constructor(img, size){
    super(img, size, size);
    this.size = size;
    this.arrow = {
      up: false,
      down: false,
      left: false,
      right: false
    };
  }

  ontouchstart(fingerPositionX, fingerPositionY){
    this._applyToDPad(fingerPositionX, fingerPositionY);
  }

  ontouchmove(fingerPositionX, fingerPositionY){
    this._applyToDPad(fingerPositionX, fingerPositionY);
  }

  ontouchend(fingerPositionX, fingerPositionY){
    this.frame = 0;
    this.arrow = {
      up: false,
      down: false,
      left: false,
      right: false
    };
  }

  _applyToDPad(fingerPositionX, fingerPositionY){
    this.frame = 1;
    this.arrow = {
      up: false,
      down: false,
      left: false,
      right: false
    };

    if(fingerPositionX > fingerPositionY && fingerPositionX < this.size - fingerPositionY){
      this.arrow.up = true;
      this.rotate = 0;
    }
    else if(fingerPositionX > this.size - fingerPositionY && fingerPositionX < fingerPositionY){
      this.arrow.down = true;
      this.rotate = 180;
    }
    else if(fingerPositionY > fingerPositionX && fingerPositionY < this.size - fingerPositionX){
      this.arrow.left = true;
      this.rotate = 270;
    }
    else if(fingerPositionY > this.size - fingerPositionX && fingerPositionY < fingerPositionX){
      this.arrow.right = true;
      this.rotate = 90;
    }
  }
}