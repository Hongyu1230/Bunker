'use strict';

const Renderer = require('incheon').render.Renderer;
let Paddle = require('../common/Paddle');
let Ball = require('../common/Ball');
let Target = require('../common/Target');

class NetpongRenderer extends Renderer {
    
    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        
        // TODO: the world settings are really a property of the GameEngine.
        //       but they are currently used by interpolate function of DynamicObject.
        this.worldSettings = {
            width: 800,
            height: 500
        };
        
        this.sprites = {};
    }
    
    draw() {
        super.draw();
        
        // note - animating via the top attribute of a DOM element is a usually
        // bad practice, but used here for code brevity
        for (let objId of Object.keys(this.sprites)) {
            if (this.sprites[objId].el) {
                // console.log(this.sprites[objId].el.class);
                this.sprites[objId].el.style.top = this.gameEngine.world.objects[objId].y + 'px';
                this.sprites[objId].el.style.left = this.gameEngine.world.objects[objId].x + 'px';
            }
        }
        
        
    }
    
    // add one object
    // return a reference to the object
    addObject(objData) {
        let sprite= {
            
        };
        
        if (objData.class == Paddle) {
            sprite.playerId = objData.playerId;
            
            if (objData.id == 1){
                sprite.el = document.querySelector('.player1Paddle');
            } else if (objData.id == 2){
                sprite.el = document.querySelector('.player2Paddle');
            }
        } else if (objData.class == Ball) {
                var newDiv = document.createElement("div");
                newDiv.className = "ball";
                newDiv.id = objData.id;
                newDiv.innerHTML = objData.valuename;
                document.getElementById("mainbox").appendChild(newDiv);
                sprite.el = newDiv;
        } else if (objData.class == Target) {
            sprite.el = document.getElementById('target');
        } 
        
        this.sprites[objData.id] = sprite;
        return sprite;
    }
    
    // remove an object from the scene
    removeObject(o) {
        // TODO not working correctly atm, should get health from Target object
		    this.sprites[o.id].el.remove();
            delete this.sprites[o.id];
    }
    
    updateObject(id, word, lockedby) {
		if (document.getElementById(id) != null){
            document.getElementById(id).innerHTML = word;
		} 
		if (document.getElementById(id) != null && lockedby == 1){
            document.getElementById(id).className = "ball2";
		} else if (document.getElementById(id) != null && lockedby == 2){
            document.getElementById(id).className = "ball3";
		}
        return word;
    }
    updateHealth(health) {
        var elem = document.getElementById("myBar");
        elem.style.width = (100 - health) + '%';
    }
	
	updateScore(score1, score2) {
        document.getElementById("player1score").innerHTML = score1;
        document.getElementById("player2score").innerHTML = score2;
    }
}

module.exports = NetpongRenderer;
