'use strict';

class Game{
  constructor(width, height){
    this.canvas = document.querySelector('canvas');
    this.canvas.width = width || 320;
    this.canvas.height = height || 320;
    this.scenes = [];
    this.currentScene;
    this.sounds = [];
    this._isAlreadyTouched = false;
    this._hasFinishedSetting = false;
    this._preloadPromises = [];
    this._temporaryCurrentScene;
    this.input = {};
    this.keys = {};
  }

  preload(){
    const _assets = arguments;

    for(let i = 0; i < _assets.length; i++){
      this._preloadPromises[i] = new Promise((resolve, reject) =>{
        if(_assets[i].match(/\.(jpg|jpeg|png|gif)$/i)){
          let _img = new Image();
          _img.src = _assets[i];

          _img.addEventListener('load', () =>{
            resolve();
          }, {passive: true, once: true});

          _img.addEventListener('error', () =>{
            reject(`「${_assets[i]}」は読み込めないよ!`);
          }, {passive: true, once: true});
        }
        else if(_assets[i].match(/\.(wav|wave|mp3|ogg)$/i)){
          let _sound = new Sound();
          _sound.src = _assets[i];
          this.sounds[_assets[i]] = _sound;
          this.sounds[_assets[i]].load();

          _sound.addEventListener('canplaythrough', () =>{
            resolve();
          }, {passive: true, once: true});

          _sound.addEventListener('error', () =>{
            reject(`「${_assets[i]}」は読み込めないよ!`);
          }, {passive: true, once: true});
        }
        else{
          reject(`「${_assets[i]}」の形式は、プリロードに対応していないよ!`)
        }
      });
    }
  }

  main(callback){
    Promise.all(this._preloadPromises).then(result =>{
      callback();
    }).catch(reject =>{
      alert(reject);
    })
  }

  start(){
    this.keyBind('up', 'ArrowUp');
    this.keyBind('down', 'ArrowDown');
    this.keyBind('left', 'ArrowLeft');
    this.keyBind('right', 'ArrowRight');

    this.currentScene = this.currentScene || this.scenes[0];

    const _resizeEvent = () =>{
      const _ratio = Math.min(innerWidth / this.canvas.width, innerHeight / this.canvas.height);
      this.canvas.style.width = this.canvas.width * _ratio + 'px';
      this.canvas.style.height = this.canvas.height * _ratio + 'px';
    }
    
    addEventListener('resize', _resizeEvent, {passive: true});
    _resizeEvent();

    this.mainLoop();

    this._waitUserManipulation();
  }

  setEventListener(){
    const keyEvent = e =>{
      e.preventDefault();
      for(let key in this.keys){
        switch(e.type){
          case 'keydown':
            if(e.key === this.keys[key]) this.input[key] = true;
            break;
          case 'keyup':
            if(e.key === this.keys[key]) this.input[key] = false;
            break;
        }
      }
    }

    addEventListener('keydown', keyEvent, {passive: false});
    addEventListener('keyup', keyEvent, {passive: false});

    const _touchEvent = e =>{
      e.preventDefault();
      const _touches = e.changedTouches[0];
      const _rect = _touches.target.getBoundingClientRect();
      const _fingerPosition = {
        x:(_touches.clientX - _rect.left) / _rect.width * this.canvas.width,
        y:(_touches.clientY - _rect.top) / _rect.height * this.canvas.height
      };
      const _eventType = e.type;
      this.currentScene.assignTouchevent(_eventType, _fingerPosition);
    }

    this.canvas.addEventListener('touchstart', _touchEvent, {passive: false});
    this.canvas.addEventListener('touchmove', _touchEvent, {passive: false});
    this.canvas.addEventListener('touchend', _touchEvent, {passive: false});
  }

  _waitUserManipulation(){
    const _playAllSounds = e =>{
      e.preventDefault();
      this._isAlreadyTouched = true;
      const _playPromises = [];

      for(let sound in this.sounds){
        this.sounds[sound].load();
        this.sounds[sound].muted = true;
        _playPromises.push(this.sounds[sound].play());
      }

      Promise.all(_playPromises).then(() =>{
        for(let sound in this.sounds){
          this.sounds[sound].stop();
        }
      }).catch(err =>{
        console.log(err);
      });

      setTimeout(() =>{
        this.setEventListener();
        this._hasFinishedSetting = true;
      }, 2000);
    }

    this.canvas.addEventListener('touchstart', _playAllSounds, {passive: false, once: true});
    addEventListener('keydown', _playAllSounds, {passive: false, once: true});
  }

  mainLoop(){
    const ctx = this.canvas.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if(!this._isAlreadyTouched) this.startPanel();
    else if(this._hasFinishedSetting){
      this.currentScene.update();
  
      if(this._temporaryCurrentScene !== this.currentScene) this.currentScene.onchangescene();
  
      for(let i = 0; i < this.currentScene.objs.length; i++){
        this.currentScene.objs[i].update(this.canvas);
      }
  
      this._temporaryCurrentScene = this.currentScene;
    }

    requestAnimationFrame(this.mainLoop.bind(this));
  }

  startPanel(){
    const _text = 'タップ、またはなにかキーを押してね!';
    const _font = "游ゴシック体, 'Yu Gothic', YuGthic, sans-serif";
    const _fontsize = this.canvas.width / 20;
    const _ctx = this.canvas.getContext('2d');
    const _textwidth = _ctx.measureText(_text).width;
    _ctx.font = `normal ${_fontsize}px ${_font}`;
    _ctx.textBaseline = 'middle';
    _ctx.fillStyle = '#aaaaaa';
    _ctx.fillText(_text,(this.canvas.width - _textwidth) / 2, this.canvas.height / 2);
  }

  add(scene){
    if(scene instanceof Scene) this.scenes.push(scene);
    else alert('Gameに追加できるのはSceneだけだよ!');
  }

  keyBind(name, key){
    this.keys[name] = key;
    this.input[name] = false;
  }
}