'use strict';

const DynamicObject= require('incheon').serialize.DynamicObject;

class Ball extends DynamicObject {

    static get netScheme(){
        return Object.assign({}, super.netScheme);
    }

    static newFrom(sourceObj){
        let newBall = new Ball();
        newBall.copyFrom(sourceObj);

        return newBall;
    }

    get bendingMultiple() { return 0.8; }
    get velocityBendingMultiple() { return 0; }
	
    constructor(id, x, y, gameEngine){
        super(id, x, y);
		
        this.class = Ball;
        this.gameEngine = gameEngine;
		this.valuename = null;
		this.changed = false;
		this.starter = null;
		this.lockedon = false;
		this.lockedby = null;
    };
	
	attachAI() {
        this.isBot = true;

        this.onPreStep = () => {
            this.steer();
        };

        this.gameEngine.on('preStep', this.onPreStep);
    }
	
	
	steer() {
		if (this.x >= this.gameEngine.target.x - 25 && this.x <= this.gameEngine.target.x + 25
			&& this.y >= this.gameEngine.target.y - 25 && this.y <= this.gameEngine.target.y + 25
		    && (this.y * this.y + this.x * this.x) <= 625) {
                this.velocity.set(0, 0);
        }
        else if (this.x >= this.gameEngine.target.x - 25 && this.x <= this.gameEngine.target.x + 25
				&& this.y <= this.gameEngine.target.y){
                this.velocity.set(0, 0.5);
        }
		else if (this.x >= this.gameEngine.target.x - 25 && this.x <= this.gameEngine.target.x + 25
				&& this.y >= this.gameEngine.target.y){
                this.velocity.set(0, -0.5);
        }
		 else if (this.y >= this.gameEngine.target.y - 25 && this.y <= this.gameEngine.target.y + 25
				&& this.x <= this.gameEngine.target.x){
                this.velocity.set(0.5, 0);
        }
		else if (this.y >= this.gameEngine.target.y - 25 && this.y <= this.gameEngine.target.y + 25
				&& this.x >= this.gameEngine.target.x){
                this.velocity.set(-0.5, 0);
        }
        else if (this.x < this.gameEngine.target.x && this.y < this.gameEngine.target.y){
                this.velocity.set(0.5, 0.5);
        }
		else if (this.x > this.gameEngine.target.x && this.y < this.gameEngine.target.y){
                this.velocity.set(-0.5, 0.5);
        }
		else if (this.x < this.gameEngine.target.x && this.y > this.gameEngine.target.y){
                this.velocity.set(0.5, -0.5);
        }
		else if (this.x > this.gameEngine.target.x && this.y > this.gameEngine.target.y){
                this.velocity.set(-0.5, -0.5);
        }
		
    }
}

module.exports = Ball;
