'use strict';

class Sound extends Audio{
  constructor(src){
    super(src);
    this.autoplay = false;
  }

  start(){
    this.muted = false;
    this.play();
  }

  loop(){
    super.loop = true;
    this.start();
  }

  stop(){
    this.pause();
    this.currentTime = 0;
  }
}