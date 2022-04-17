'use strict';

addEventListener('load', () =>{
  const game = new Game();
  game.preload(
    'img/fox.png', 
    'img/rico.png', 
    'img/aru.png', 
    'img/start.png', 
    'img/goal.png', 
    'img/tile.png', 
    'img/dpad.png', 
    'sound/bgm.mp3', 
    'sound/start.mp3', 
    'sound/clear.mp3');
  game.keyBind('space', ' ');

  game.main(() =>{
    const titleScene = () =>{
      const scene = new Scene();
      const titleText = new Text('クロネコヤマト');
      titleText.center().middle();
      scene.add(titleText);

      scene.onchangescene = () =>{
        game.sounds['sound/clear.mp3'].stop();
        game.sounds['sound/start.mp3'].start();
      }
  
      scene.ontouchstart = () =>{
        game.currentScene = mainScene();
      }
  
      scene.openterFrame = () =>{
        if(game.input.space) game.currentScene = mainScene();
      }
  
      return scene;
    }
  
    const mainScene = () =>{     
      const TILE_SIZE = 32;
      const WALKING_SPEED = 4;
    
      const scene = new Scene();
    
      const tilemap = new Tilemap('img/tile.png');
      tilemap.data = map;
      tilemap.x = TILE_SIZE * 4 - TILE_SIZE / 2;
      tilemap.y = TILE_SIZE * 3 - TILE_SIZE / 2;
      tilemap.walls = [0, 3, 6, 7, 8, 9, 10, 11];
      scene.add(tilemap);
    
      const start = new Tile('img/start.png');
      start.x = TILE_SIZE;
      start.y = TILE_SIZE * 2;
      tilemap.add(start);
    
      const goal = new Tile('img/goal.png');
      goal.x = TILE_SIZE * 8;
      goal.y = TILE_SIZE * 8;
      tilemap.add(goal);
    
      const fox = new Character('img/fox.png');
      fox.x = fox.y = (TILE_SIZE * 5 - TILE_SIZE / 2);
      fox.isSynchronize = false;
      tilemap.add(fox);
  
      const rico = new Character('img/rico.png');
      rico.x = TILE_SIZE * 7 - TILE_SIZE / 2;
      rico.y = TILE_SIZE * 5 - TILE_SIZE / 2;
      rico.isSynchronize = false;
      tilemap.add(rico);
  
      const aru = new Character('img/aru.png');
      aru.x = TILE_SIZE * 7 - TILE_SIZE / 2;
      aru.y = TILE_SIZE * 6 - TILE_SIZE / 2;
      aru.isSynchronize = false;
      tilemap.add(aru);
  
      const party = new Party(fox, rico, aru);
      party.speed = WALKING_SPEED;
  
      const dpad = new DPad('img/dpad.png', 80);
      dpad.x = 10;
      dpad.y = 230;
      scene.add(dpad);

      scene.onchangescene = () =>{
        game.sounds['sound/start.mp3'].stop();
        game.sounds['sound/bgm.mp3'].loop();
      }
    
      let toggleForAnimation = 0;
      let hasGoalText = false;
      let isMovable = true;
    
      scene.openterFrame = () => {
        if(
        (tilemap.x - TILE_SIZE / 2) % TILE_SIZE === 0 && 
        (tilemap.y - TILE_SIZE / 2) % TILE_SIZE === 0){
          tilemap.vx = tilemap.vy = 0;
          for(let i in party.member){
            party.member[i].vx = party.member[i].vy = 0;
            party.member[i].animation = 1;
          }
    
          if(fox.isOverlapped(goal)){
            if(!hasGoalText){
              const goalText = new Text('ゴール!!');
              goalText.size = 50;
              goalText.center().middle();
              scene.add(goalText);
              hasGoalText = true;
              isMovable = false;

              game.sounds['sound/bgm.mp3'].stop();
              game.sounds['sound/clear.mp3'].start();
  
              setTimeout(() =>{
                game.currentScene = titleScene();
              }, 6000);
            }
          }
          
          if(isMovable){
            if(game.input.left || dpad.arrow.left){
              party.setMemberVelocity('left');
              tilemap.vx = WALKING_SPEED;
              fox.direction = 1;
            } else if(game.input.right || dpad.arrow.right){
              party.setMemberVelocity('right');
              tilemap.vx = -1 * WALKING_SPEED;
              fox.direction = 2;
            } else if(game.input.up || dpad.arrow.up){
              party.setMemberVelocity('up');
              tilemap.vy = WALKING_SPEED;
              fox.direction = 3;
            } else if(game.input.down || dpad.arrow.down){
              party.setMemberVelocity('down');
              tilemap.vy = -1 * WALKING_SPEED;
              fox.direction = 0;
            } 
      
            const foxCoordinateAfterMoveX = fox.mapX - tilemap.vx / WALKING_SPEED;
            const foxCoordinateAfterMoveY = fox.mapY - tilemap.vy / WALKING_SPEED;
            if(tilemap.hasWall(foxCoordinateAfterMoveX, foxCoordinateAfterMoveY)){
              tilemap.vx = tilemap.vy = 0;
              for(let i in party.member){
                party.member[i].vx = party.member[i].vy = 0;
              }
            }
  
            if(tilemap.vx !== 0 || tilemap.vy !== 0) party.setMemberDirection();
          }
        } 
        else if(
        (tilemap.x + TILE_SIZE / 2) % (TILE_SIZE / 2) === 0 && 
        (tilemap.y + TILE_SIZE / 2) % (TILE_SIZE / 2) === 0){
          toggleForAnimation ^= 1;
          for(let i in party.member){
            if(toggleForAnimation === 0) party.member[i].animation = 2;
            else party.member[i].animation = 0;
          }
        }
      }
      return scene;
    }
  
    game.add(titleScene());
    game.add(mainScene());
    
    game.start();
  });
});