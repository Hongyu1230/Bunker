'use strict';

const GameEngine = require('incheon').GameEngine;
const Ball = require('./Ball');
const Target = require('./Target');
const dictionary2 = require('../words/commonWords/commonWordsL2');
const dictionary3 = require('../words/commonWords/commonWordsL3');
const dictionary4 = require('../words/commonWords/commonWordsL4');
const dictionary5 = require('../words/commonWords/commonWordsL5');
const dictionary6 = require('../words/commonWords/commonWordsL6');
const dictionary7 = require('../words/commonWords/commonWordsL7');
const dictionary8 = require('../words/commonWords/commonWordsL8');
const dictionary9 = require('../words/commonWords/commonWordsL9');
const dictionary10 = require('../words/commonWords/commonWordsL10');
const dictionary11 = require('../words/commonWords/commonWordsL11');
const dictionary12 = require('../words/commonWords/commonWordsL12');
const dictionary13 = require('../words/commonWords/commonWordsL13');
const dictionary14 = require('../words/commonWords/commonWordsL14');

class NetpongGameEngine extends GameEngine {
    
    constructor(options){
        super(options);
    }
    
    start() {
        
        super.start();
        this.disablescore = false;
        this.worldSettings = {
            width: 800,
            height: 500,
            targetWidth: 50,
            targetHeight: 50,
            //targetx: (width/2) - (targetWidth/2),
            //targety: (height/2) - (targetHeight/2)
            targetx: (800/2) - (50/2),
            targety: (500/2) - (50/2)
        };
        // TODO is there an end game function?
        
        this.on('collisionStart', function(e) {
            let collisionObjects = Object.keys(e).map(k => e[k]);
            let target = collisionObjects.find(o => o.class === Target);
            let ball = collisionObjects.find(o => o.class === Ball);
            if (ball && target) {
                this.emit('pipHit', target);
				this.destroyPip(ball.id);
            }
        });
		var thisworld = this;
		this.dictionary = dictionary2
		setInterval(myTimer, 100);
    	function myTimer() {
			for (let objId of Object.keys(thisworld.world.objects)) {
			    if (thisworld.world.objects[objId].class == Ball) {
					thisworld.emit('assignedword', objId, thisworld.world.objects[objId].valuename, thisworld.world.objects[objId].lockedby);
				}
			}
			thisworld.emit("updatescore", thisworld.player1score, thisworld.player2score);
            thisworld.emit("syncHP", thisworld.target);
			var totalscore = Math.floor(((thisworld.player1score + thisworld.player2score)/10) + 2);
			if (totalscore >= 0 && totalscore <=12) {
				thisworld.dictionary = eval("dictionary" + totalscore);
			}
		}
		this.filter = new Array();
        this.player1score = 0;
		this.player2score = 0;
        this.on('postStep', ()=>{ this.postStepHandleBall(); });
    };
    
    processInput(inputData, playerId){
        super.processInput(inputData, playerId);
		if (this.target.player1on == playerId && this.disablescore == false) {
			this.updatePip(inputData.input);
		} else if (this.target.player2on == playerId && this.disablescore == false) {
			this.updatePip2(inputData.input);
		} 
    };
	
	attachID(ID, playersocket){
        if (ID === 1) {
            this.target.player1on = playersocket;
        } else if (ID === 2) {
            this.target.player2on = playersocket;
        }
    }
	
	detachID(ID){
        if (ID === 1) {
            this.target.player1on = null;
        } else if (ID === 2) {
            this.target.player2on = null;
        }
    }
    
    initGame(){
        // create field objects
        // adjust for size. object positions are referred to as top left corner. adjustments should be half of target's actual size in style.css
        // waiting for marco to get back to me on size
        this.target = new Target(++this.world.idCount, (this.worldSettings.width / 2) - 25, (this.worldSettings.height / 2) - 25);
		this.balls = new Array();
        
        // associate paddels with the right players
        
        // add objects to the game world
        this.addObjectToWorld(this.target);
        this.lockedtarget = null;
		this.lockedtarget2 = null;
    }
	
	addpip (id, pipx, pipy) {
        var newball = new Ball(id, pipx, pipy, this);
        this.addObjectToWorld(newball);
	    return newball;
    }
    
    postStepHandleBall(){
		var thisworld = this;
        for (let objId of Object.keys(this.world.objects)) {
			if (this.world.objects[objId].class == Ball && this.world.objects[objId].changed == false) {
				var filteredlist = this.dictionary.filter(function (e) {
					return this.indexOf(e[0])<0;
				},this.filter);
				var randomword = filteredlist[Math.floor(Math.random()*filteredlist.length)];
				this.addelements(this.world.objects[objId], randomword);
			} 
		}
    }
	
	addelements(ob, word) {
		ob.starter = word[0];
		ob.valuename = word;
		ob.changed = true;
		this.filter.push(word[0]);
	}

    destroyPip(id) {
        if (this.world.objects[id]) {
			this.filter.splice(this.filter.indexOf(this.world.objects[id].starter), 1);
            this.removeObjectFromWorld(id);
        }
    }
    
    updatePip(key) {
        if (this.lockedtarget == null) {
            for (let objId of Object.keys(this.world.objects)) {
                if (this.world.objects[objId].class == Ball && this.world.objects[objId].changed == true && this.world.objects[objId].lockedon == false) {
                    if (this.world.objects[objId].valuename[0] == key) {
                        if (this.world.objects[objId].valuename.length == 1) {
							this.world.objects[objId].valuename = "";
							this.destroyPip(objId);
							this.player1score += 1
                            return this.lockedtarget;
                        } else {
                            this.world.objects[objId].valuename = this.world.objects[objId].valuename.substr(1);
							this.world.objects[objId].lockedon = true;
							this.world.objects[objId].lockedby = 1;
                            this.lockedtarget = objId;
							this.player1score += 1
                            return this.lockedtarget;
                        }
                    }
                }
            }
        } else {
            if (typeof(this.world.objects[this.lockedtarget]) != 'undefined') {
                if (this.world.objects[this.lockedtarget].valuename[0] == key) {
                    if (this.world.objects[this.lockedtarget].valuename.length == 1) {
						this.world.objects[this.lockedtarget].valuename = "";
						this.destroyPip(this.lockedtarget)
                        this.lockedtarget = null;
						this.player1score += 1
                        return this.lockedtarget;
                    } else {
                        this.world.objects[this.lockedtarget].valuename = this.world.objects[this.lockedtarget].valuename.substr(1);
						this.player1score += 1
                        return this.lockedtarget;
                    }
                }
            } else {
                this.lockedtarget = null;
                return this.lockedtarget;
            }
        }
    }
	
	updatePip2(key) {
        if (this.lockedtarget2 == null) {
            for (let objId of Object.keys(this.world.objects)) {
                if (this.world.objects[objId].class == Ball && this.world.objects[objId].changed == true && this.world.objects[objId].lockedon == false) {
                    if (this.world.objects[objId].valuename[0] == key) {
                        if (this.world.objects[objId].valuename.length == 1) {
							this.world.objects[objId].valuename = "";
							this.destroyPip(objId);
							this.player2score += 1
                            return this.lockedtarget2;
                        } else {
                            this.world.objects[objId].valuename = this.world.objects[objId].valuename.substr(1);
							this.world.objects[objId].lockedon = true;
							this.world.objects[objId].lockedby = 2;
                            this.lockedtarget2 = objId;
							this.player2score += 1
                            return this.lockedtarget2;
                        }
                    }
                }
            }
        } else {
            if (typeof(this.world.objects[this.lockedtarget2]) != 'undefined') {
                if (this.world.objects[this.lockedtarget2].valuename[0] == key) {
                    if (this.world.objects[this.lockedtarget2].valuename.length == 1) {
						this.world.objects[this.lockedtarget2].valuename = "";
						this.destroyPip(this.lockedtarget2)
                        this.lockedtarget2 = null;
						this.player2score += 1
                        return this.lockedtarget2;
                    } else {
                        this.world.objects[this.lockedtarget2].valuename = this.world.objects[this.lockedtarget2].valuename.substr(1);
						this.player2score += 1
                        return this.lockedtarget2;
                    }
                }
            } else {
                this.lockedtarget2 = null;
				this.player2score += 1
                return this.lockedtarget2;
            }
        }
    }
	
	resetall() {
		this.target.health = 100;
		this.player1score = 0;
		this.player2score = 0;
		this.disablescore = false;
		for (let objId of Object.keys(this.world.objects)) {
            if (this.world.objects[objId].class == Ball) {
				this.destroyPip(objId);
			}
		}
	}
}

module.exports = NetpongGameEngine;
