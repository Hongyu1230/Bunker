'use strict';

const DynamicObject= require('incheon').serialize.DynamicObject;

class Pip extends DynamicObject {

    static get netScheme(){
        return Object.assign({}, super.netScheme);
    }

    static newFrom(sourceObj){
        let newPip = new Pip();
        newPip.copyFrom(sourceObj);

        return newPip;
    }

    get bendingMultiple() { return 0.8; }
    get velocityBendingMultiple() { return 0; }

    constructor(id, x, y){
        super(id, x, y);

        this.class = Pip;

        this.velocity.set(0, 0);
    };

}

module.exports = Pip;
