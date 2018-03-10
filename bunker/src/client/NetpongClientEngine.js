const ClientEngine = require('incheon').ClientEngine;
const NetpongRenderer = require('../client/NetpongRenderer');
const Ball = require('../common/Ball');
const Target = require('../common/Target');


class NetpongClientEngine extends ClientEngine{
    constructor(gameEngine, options){
        super(gameEngine, options);
		let that = this;

        // initialize renderer
        this.renderer = new NetpongRenderer(gameEngine);

        this.serializer.registerClass(require('../common/Paddle'));
        this.serializer.registerClass(require('../common/Ball'));
        this.serializer.registerClass(require('../common/Target'));

        this.gameEngine.on('client__preStep', this.preStep.bind(this));
		this.gameEngine.on('objectAdded', (object) => {
            if (object.class == Target){
                this.gameEngine.target = object;
            }

        });
		setInterval(myTimer, 10000);
    	function myTimer() {
			that.gameEngine.filter = [];
		}

        // keep a reference for key press state
        this.pressedKeys = {
            down: false,
            up: false
        };

        document.onkeydown = (e) => { that.onKeyChange(e, true);};
        document.onkeyup = (e) => { that.onKeyChange(e, false);};
    }

    // our pre-step is to process all inputs
    preStep(){
        // continuous press
        if (this.pressedKeys.a) {
            this.sendInput('a');
        }
		if (this.pressedKeys.b) {
            this.sendInput('b');
        }
		if (this.pressedKeys.c) {
            this.sendInput('c');
        }
		if (this.pressedKeys.d) {
            this.sendInput('d');
        }
		if (this.pressedKeys.e) {
            this.sendInput('e');
        }
		if (this.pressedKeys.f) {
            this.sendInput('f');
        }
		if (this.pressedKeys.g) {
            this.sendInput('g');
        }
		if (this.pressedKeys.h) {
            this.sendInput('h');
        }
		if (this.pressedKeys.i) {
            this.sendInput('i');
        }
		if (this.pressedKeys.j) {
            this.sendInput('j');
        }
		if (this.pressedKeys.k) {
            this.sendInput('k');
        }
		if (this.pressedKeys.l) {
            this.sendInput('l');
        }
		if (this.pressedKeys.m) {
            this.sendInput('m');
        }
		if (this.pressedKeys.n) {
            this.sendInput('n');
        }
		if (this.pressedKeys.o) {
            this.sendInput('o');
        }
		if (this.pressedKeys.p) {
            this.sendInput('p');
        }
		if (this.pressedKeys.q) {
            this.sendInput('q');
        }
		if (this.pressedKeys.r) {
            this.sendInput('r');
        }
		if (this.pressedKeys.s) {
            this.sendInput('s');
        }
		if (this.pressedKeys.t) {
            this.sendInput('t');
        }
		if (this.pressedKeys.u) {
            this.sendInput('u');
        }
		if (this.pressedKeys.v) {
            this.sendInput('v');
        }
		if (this.pressedKeys.w) {
            this.sendInput('w');
        }
		if (this.pressedKeys.x) {
            this.sendInput('x');
        }
		if (this.pressedKeys.y) {
            this.sendInput('y');
        }
		if (this.pressedKeys.z) {
            this.sendInput('z');
        }
    }

    onKeyChange(e, isDown) {
        e = e || window.event;

        if (e.keyCode == '65') {
            this.pressedKeys.a = isDown;
        } else if (e.keyCode == '66') {
            this.pressedKeys.b = isDown;
        } else if (e.keyCode == '67') {
            this.pressedKeys.c = isDown;
        } else if (e.keyCode == '68') {
            this.pressedKeys.d = isDown;
        } else if (e.keyCode == '69') {
            this.pressedKeys.e = isDown;
        } else if (e.keyCode == '70') {
            this.pressedKeys.f = isDown;
        } else if (e.keyCode == '71') {
            this.pressedKeys.g = isDown;
        } else if (e.keyCode == '72') {
            this.pressedKeys.h = isDown;
        } else if (e.keyCode == '73') {
            this.pressedKeys.i = isDown;
        } else if (e.keyCode == '74') {
            this.pressedKeys.j = isDown;
        } else if (e.keyCode == '75') {
            this.pressedKeys.k = isDown;
        } else if (e.keyCode == '76') {
            this.pressedKeys.l = isDown;
        } else if (e.keyCode == '77') {
            this.pressedKeys.m = isDown;
        } else if (e.keyCode == '78') {
            this.pressedKeys.n = isDown;
        } else if (e.keyCode == '79') {
            this.pressedKeys.o = isDown;
        } else if (e.keyCode == '80') {
            this.pressedKeys.p = isDown;
        } else if (e.keyCode == '81') {
            this.pressedKeys.q = isDown;
        } else if (e.keyCode == '82') {
            this.pressedKeys.r = isDown;
        } else if (e.keyCode == '83') {
            this.pressedKeys.s = isDown;
        } else if (e.keyCode == '84') {
            this.pressedKeys.t = isDown;
        } else if (e.keyCode == '85') {
            this.pressedKeys.u = isDown;
        } else if (e.keyCode == '86') {
            this.pressedKeys.v = isDown;
        } else if (e.keyCode == '87') {
            this.pressedKeys.w = isDown;
        } else if (e.keyCode == '88') {
            this.pressedKeys.x = isDown;
        } else if (e.keyCode == '89') {
            this.pressedKeys.y = isDown;
        } else if (e.keyCode == '90') {
            this.pressedKeys.z = isDown;
        }
	}
	
		
	connect() {
        return super.connect().then(() => {
			this.socket.on('clientwordupdate', (id, word, lockedby) => {
				this.renderer.updateObject(id,word, lockedby);
			});

            this.socket.on('healthUpdate', (health, online1, online2) => {
				if (health <= 0) {
					this.renderer.updateHealth(health);
					this.socket.emit("disablescoring");
					document.getElementById("gameover").style.display = "block";
					document.getElementById("gameover").disabled = false;
					document.getElementById("gameover").addEventListener('click', () => {
						document.getElementById("gameover").style.display = "none";
					    document.getElementById("gameover").disabled = true;
                        this.socket.emit('requestRestart');
                    });
				} else {
                    this.renderer.updateHealth(health);
					document.getElementById("gameover").style.display = "none";
					document.getElementById("gameover").disabled = true;
					this.socket.emit("updateotherplayer");
				}
				if (online1 == null && online2 == null) {
					document.getElementById("target").className = "target";
				} else if (online1 != null && online2 == null) {
					document.getElementById("target").className = "target2";
				} else if (online1 == null && online2 != null) {
					document.getElementById("target").className = "target3";
				} else if (online1 != null && online2 != null) {
					document.getElementById("target").className = "target4";
				}
				
            });
			
			this.socket.on('clientscoreupdate', (score1, score2) => {
                this.renderer.updateScore(score1, score2);
            });
        });
    }

}

module.exports = NetpongClientEngine;
