'use strict';

class Scene{
  constructor(){
    this.objs = [];
  }

  add(obj){
    this.objs.push(obj);
  }

  update(canvas){
    this.openterFrame();
  }

  assignTouchevent(eventType, fingerPosition){
    switch(eventType){
      case 'touchstart':
        this.ontouchstart(fingerPosition.x, fingerPosition.y);
        break;
      case 'touchmove':
        this.ontouchmove(fingerPosition.x, fingerPosition.y);
        break;
      case 'touchend':
        this.ontouchend(fingerPosition.x, fingerPosition.y);
        break;
    }

    for(let i = 0; i < this.objs.length; i++){
      this.objs[i].assignTouchevent(eventType, fingerPosition);
    }
  }

  openterFrame() {}

  ontouchstart() {}

  ontouchmove() {}

  ontouchend() {}

  onchangescene() {}
}