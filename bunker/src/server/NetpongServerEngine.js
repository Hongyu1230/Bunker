'use strict';

const ServerEngine = require('incheon').ServerEngine;

class NetpongServerEngine extends ServerEngine{
	
    constructor(io, gameEngine, inputOptions){
        super(io, gameEngine, inputOptions);
        this.serializer.registerClass(require('../common/Paddle'));
        this.serializer.registerClass(require('../common/Ball'));
        this.serializer.registerClass(require('../common/Target'));
    };

    start(){
        super.start();
        this.gameEngine.initGame();
		setInterval(myTimer, 5000);
		var serverengine = this;
		var gameengine = this.gameEngine;
    	function myTimer() {
			var id = ++gameengine.world.idCount;
			var pipx = Math.floor(Math.random()*(gameengine.worldSettings.width-200)) + 200;
            var pipy = Math.floor(Math.random()*(gameengine.worldSettings.height-200)) + 200;
            var pip = gameengine.addpip(id, pipx, pipy);
			pip.attachAI();
    	}
		this.gameEngine.on('assignedword', (id, word, lockedby) => {
			setTimeout(() => {
				this.io.sockets.emit('clientwordupdate', id, word, lockedby);
			}, 100);
		});
		this.gameEngine.on('updatescore', (score1, score2) => {
			setTimeout(() => {
				this.io.sockets.emit('clientscoreupdate', score1, score2);
			}, 100);
		});
        this.players = {
            player1: null,
            player2: null
        };

        this.gameEngine.on('pipHit', (target) => {
            if (target.health > 0) {
                target.health = target.health - 20;
            }
            setTimeout(() => {
                this.io.sockets.emit('healthUpdate', target.health, target.player1on, target.player2on);
            }, 100);
        });

        this.gameEngine.on('syncHP', (target) => {
            setTimeout(() => {
                this.io.sockets.emit('healthUpdate', target.health, target.player1on, target.player2on);
            }, 100);
        });
    };

    onPlayerConnected(socket){
        super.onPlayerConnected(socket);

        // attach newly connected player an available paddle
        if (this.players.player1 == null){
            this.players.player1 = socket.id;
			this.gameEngine.attachID(1, socket.playerId);
        } else if (this.players.player2 == null) {
            this.players.player2 = socket.id;
			this.gameEngine.attachID(2, socket.playerId);
        }
		socket.on('requestRestart', () => {
			this.gameEngine.resetall();
		})
		socket.on('disablescoring', () => {
			this.gameEngine.disablescore = true;
		})
		socket.on('updateotherplayer', () => {
			this.gameEngine.disablescore = false;
		})
    };
	
    onPlayerDisconnected(socketId, playerId){
        super.onPlayerDisconnected(socketId, playerId);

        if (this.players.player1 == socketId){
            this.players.player1 = null;
			this.gameEngine.detachID(1);
        } else if (this.players.player2 == socketId){
            this.players.player2 = null;
			this.gameEngine.detachID(2);
        }

    };

}

module.exports = NetpongServerEngine;
