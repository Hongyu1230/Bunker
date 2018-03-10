'use strict';

const DynamicObject= require('incheon').serialize.DynamicObject;

class Reach extends DynamicObject {

    static get netScheme(){
        return Object.assign({}, super.netScheme);
    }

    static newFrom(sourceObj){
        let newReach = new Reach();
        newReach.copyFrom(sourceObj);

        return newReach;
    }

    get bendingMultiple() { return 0.8; }
    get velocityBendingMultiple() { return 0; }

    constructor(id, x, y){
        super(id, x, y);

        this.class = Reach;

        this.velocity.set(0, 0);
    };

}

module.exports = Reach;
