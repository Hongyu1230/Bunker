'use strict';

const DynamicObject= require('incheon').serialize.DynamicObject;

class Target extends DynamicObject {

    static get netScheme(){
        return Object.assign({}, super.netScheme);
    }

    static newFrom(sourceObj){
        let newTarget = new Target();
        newTarget.copyFrom(sourceObj);

        return newTarget;
    }

    constructor(id, x, y){
        super(id, x, y);
        this.class = Target;
        this.health = 100;
		this.player1on = false;
		this.player2on = false;
    };

}

module.exports = Target;
