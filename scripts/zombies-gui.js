Quintus.ZombiesGUI = function(Q) {
    
    //side panel that shows stats and holds buttons
    Q.UI.Container.extend('SidePanel', {
      init: function(p) {
        this._super(Q._defaults(p, {
          fill: '#E1DEB7',
          x: 120/2,
          y: 720/2,
          radius: 0,
          border: 0,
          shadow: 0,
          w: 120,
          h: 720,
        }));

        this.on('inserted');

        //update sun stats when player sun changes
        Q.state.on('change.sun', function() {
          Q('SidePanel',0).items[0].refreshStats();
        });
      },
      //this is executed after the object is inserted in the stage
      inserted: function() {  
        //now we can access the stage with this.stage
        this.stage.insert(new Q.Sprite({
          asset: 'sun.png',
          x: 60,
          y: 40
        }));

        this.totalSun = this.stage.insert(new Q.UI.Text({
          x: 60,
          y: 100,
          label: '100'
        }));

        //start showing the correct stats
        this.refreshStats();

        //insert plant type buttons
        var x = 40, y = 180, plantObject;
        Q._each(this.p.plantTypes, function(element, index, list) {
          plantObject = Q.plantTypes[element];
          this.stage.insert(new Q.PlantButton({x: x, y: y, asset: plantObject.asset, plant: plantObject}));
          this.stage.insert(new Q.UI.Text({x: x+40, y: y, label: plantObject.cost+''}));
          y += 90;
        }, this);
      },
      //you could have other game stats here
      refreshStats: function() {
        this.totalSun.p.label = Q.state.get('sun') + '';
      }
    });    
    
    Q.UI.Button.extend("PlantButton", {
      init: function(p) {
        this._super(Q._defaults(p, {
          scale: 0.6
        }), function() {

          var plantButtons = Q("PlantButton", 0).items;
          Q._each(plantButtons, function(element, index, list){
            element.trigger("unselected");
          }, this);

          this.p.opacity = 0.5;
          Q.state.set("currentPlant", this.p.plant);
        });

        this.on("unselected", function() {
          this.p.opacity = 1;
        });
      } 
    });
};