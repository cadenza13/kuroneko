'use strict';

class Party{
  constructor(){
    this.member = arguments;
    this.speed = 1;
  }

  setMemberDirection(){
    for(let i = 1; i < this.member.length; i++){
      if(this.member[i - 1].mapX < this.member[i].mapX) this.member[i].direction = 1;
      else if(this.member[i - 1].mapX > this.member[i].mapX) this.member[i].direction = 2;
      else if(this.member[i - 1].mapY < this.member[i].mapY) this.member[i].direction = 3;
      else if(this.member[i - 1].mapY > this.member[i].mapY) this.member[i].direction = 0;
    }
  }

  setMemberVelocity(direction){
    for(let i = 1; i < this.member.length; i++){
      let _samePrevX;
      let _samePrevY;
      let _lessThanPrevX;
      let _lessThanPrevY;
      let _moreThanPrevX;
      let _moreThanPrevY;
      let _moreThanOneTile;

      if(direction === 'up'){
        _samePrevX = 0;
        _samePrevY = 1;
        _lessThanPrevX = -1;
        _lessThanPrevY = 0;
        _moreThanPrevX = 1;
        _moreThanPrevY = 2;
        _moreThanOneTile = -1;
      }
      else if(direction === 'down'){
        _samePrevX = 0;
        _samePrevY = -1;
        _lessThanPrevX = -1;
        _lessThanPrevY = -2;
        _moreThanPrevX = 1;
        _moreThanPrevY = 0;
        _moreThanOneTile = 1;
      }
      else if(direction === 'left'){
        _samePrevX = 1;
        _samePrevY = 0;
        _lessThanPrevX = 0;
        _lessThanPrevY = -1;
        _moreThanPrevX = 2;
        _moreThanPrevY = 1;
        _moreThanOneTile = -1;
      }
      else if(direction === 'right'){
        _samePrevX = -1;
        _samePrevY = 0;
        _lessThanPrevX = -2;
        _lessThanPrevY = -1;
        _moreThanPrevX = 0;
        _moreThanPrevY = 1;
        _moreThanOneTile = 1;
      }

      if(this.member[i - 1].mapX === this.member[i].mapX) this.member[i].vx = this.speed * _samePrevX;
      if(this.member[i - 1].mapY === this.member[i].mapY) this.member[i].vy = this.speed * _samePrevY;

      if(this.member[i - 1].mapX < this.member[i].mapX){
        this.member[i].vx = this.speed * _lessThanPrevX;
        if(direction === 'left' && this.member[i].mapX - this.member[i - 1].mapX > 1) 
        this.member[i].vx = this.speed * _moreThanOneTile;
      }
      if(this.member[i - 1].mapX > this.member[i].mapX){
        this.member[i].vx = this.speed * _moreThanPrevX;
        if(direction === 'right' && this.member[i - 1].mapX - this.member[i].mapX > 1) 
        this.member[i].vx = this.speed * _moreThanOneTile;
      }
      if(this.member[i - 1].mapY < this.member[i].mapY){
        this.member[i].vy = this.speed * _lessThanPrevY;
        if(direction === 'up' && this.member[i].mapY - this.member[i - 1].mapY > 1) 
        this.member[i].vy = this.speed * _moreThanOneTile;
      }
      if(this.member[i - 1].mapY > this.member[i].mapY){
        this.member[i].vy = this.speed * _moreThanPrevY;
        if(direction === 'down' && this.member[i - 1].mapY - this.member[i].mapY > 1) 
        this.member[i].vy = this.speed * _moreThanOneTile;
      }
    }
  }
}