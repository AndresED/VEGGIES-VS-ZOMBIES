Quintus.ZombiesGameplay = function(Q) {
    
  //game level
  Q.Sprite.extend('Level', {
    init: function(p) {
        this._super(p, { 
          asset: 'background.png',
          type: Q.SPRITE_GROUND,
          x: 120 + 960/2,
          y: 720/2,
          w: 960,
          h: 720,
          sunFrequency: {min: 3,max: 10}, //min and max number of seconds for sun to appear   
        });

        this.timeNextSun = this.getTimeNextSun(); //time for the next sun to appear

        //level data
        this.zombieIndex = 0; //current index from zombies array
        this.numZombies = this.p.levelData.zombies.length;
        this.levelTime = 0; //keep track of the level duration

        //save the position of each plant in a grid
        this.plantsGrid = new Array(new Array(7), new Array(7), new Array(7), new Array(7), new Array(7), new Array(7));

        this.on('touch');
    },
    step: function(dt) {
      //update level duration
      this.levelTime += dt;

      //check for level passed
      if(this.levelTime >= this.p.levelData.duration) {
        console.log('LEVEL COMPLETED!');

        if(this.p.levelData.nextLevel) {
          Q.stageScene("level", {
            levelData: Q.assets[this.p.levelData.nextLevel]                        
          });
        }
        else {
          console.log('YOU HAVE WON THE GAME!!');
          Q.stageScene("level", {
            levelData: Q.assets["level1.json"]                        
          });
        }
        
      }

      //create zombies at the defined times
      if(this.zombieIndex < this.numZombies) {
          
        var currentZombie = this.p.levelData.zombies[this.zombieIndex];
        if(this.levelTime >= currentZombie.time) {    
          var zombieData = Q.zombieTypes[currentZombie.type];     
          var newZombie = new Q.Zombie(
            Q._extend(zombieData, {y: currentZombie.row * 120 + 60})
          );                 
          this.stage.insert(newZombie);
          
          this.zombieIndex++;
        }
      }               

      //update sun generation timing
      this.timeNextSun -= dt;
      if(this.timeNextSun <= 0) {
        this.timeNextSun = this.getTimeNextSun();

        //create sun in the sun stage
        Q.stage(1).insert(new Q.Sun());
      }
    },
    touch: function(touch) {
      //if a plant is selected
      if(Q.state.get('currentPlant')) {
        //get plantsGrid coordinates
        var row = Math.floor((touch.y)/120);
        var col = Math.floor((touch.x - 240)/120);

        if(row >= 0 && row < this.plantsGrid.length && col >= 0 && col < this.plantsGrid[0].length) {
          if(!this.plantsGrid[row][col] && Q.state.get('sun') >= Q.state.get('currentPlant').cost) {
            Q.state.dec('sun', Q.state.get('currentPlant').cost);
            var newPlant = new Q.Plant(Q._extend({x: 240 + 60 + col*120, y: 60 + row*120}, Q.state.get('currentPlant')));
            this.stage.insert(newPlant);
            this.plantsGrid[row][col] = newPlant;
            newPlant.p.gridRow = row;
            newPlant.p.gridCol = col;
          }
        }
      }            
    },
    getTimeNextSun: function() {
      return this.p.sunFrequency.min + Math.random()*(this.p.sunFrequency.max - this.p.sunFrequency.min);
    },
  });
}

