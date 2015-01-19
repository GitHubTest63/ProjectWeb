var Character = function(scene, name, spriteList){
	if(typeof(scene) == "undefined"){
		return;
	}
	var self = this;
	this.scene = scene;
	this.game = this.scene.game;
	this.name = name;
	this.sprites = {};
	for(var spriteName in spriteList){
		this.loadSprite(spriteName, spriteList[spriteName]);	
	}
	
	//this.currentSprite = this.sprites["idle"];

	this.x = 0;
	this.y = 0;
	
	this.scale = 0.3;
	this.speed = Character.DEFAULT_SPEED;
	
	this.movementListeners = [];
};

Character.DEFAULT_SPEED = 200 / 1000;
//Character.MIN_Y = 1550;
//Character.MAX_Y = 2040;
//Character.MIN_SCALE = 0.6;
//Character.MAX_SCALE = 1;

Character.prototype = new DrawableControl();

Character.prototype.loadSprite = function(spriteName, spriteData){
	var self = this;
	var img = new Image();
	img.src = spriteData.img;
	img.addEventListener("load", function(){
		self.sprites[spriteName] = new Sprite(img, spriteData.nbCol, spriteData.nbRow, spriteData.loop);
		if(spriteName == "idle"){
			self.setCurrentSprite(spriteName);
		}
	});
};

Character.prototype.setCurrentSprite = function(spriteName){
	this.currentSprite = this.sprites[spriteName];
	/*if(this.currentSprite && !this.currentSprite.loop)
		this.nextSprite = spriteName;
	else{
		var self = this;
		this.currentSprite = this.sprites[spriteName];
		if(!this.currentSprite.loop)
			this.currentSprite.play(function(){
				self.playNextSprite();
			});		
	}*/
};	

Character.prototype.playNextSprite = function(){
	this.currentSprite = false;	
	this.currentSprite.currentFrame = 0;
}

Character.prototype.render = function(g){
	if(this.currentSprite){
		g.save();
			g.translate(this.x, this.y);		
			g.scale(this.scale, this.scale);
			g.translate(-this.currentSprite.spriteWidth * 0.5, -this.currentSprite.spriteHeight * 0.9);
			this.currentSprite.render(g);
		g.restore();
	}	
};

Character.prototype.update = function(tpf){
	if(this.moveTime && this.game.time.localTime <= this.moveTime + this.moveDuration){
		var f = (this.game.time.localTime - this.moveTime) / this.moveDuration;		
		//f = Math.pow(f, 0.6);
		this.setPosition(f * (this.targetX - this.startX)  + this.startX, f * (this.targetY - this.startY)  + this.startY);
	}else if(this.x != this.targetX || this.y != this.targetY){
		this.setPosition(this.targetX, this.targetY);
		this.setCurrentSprite("idle");
	}
};

Character.prototype.addMovementListener = function(listener){
	this.movementListeners.push(listener);
};

//Position
Character.prototype.setPosition = function(x, y){
	this.x = x;
	this.y = y;
	for(var i = 0; i<this.movementListeners.length; i++){
		this.movementListeners[i](x, y);
	}
	
	//this.scale = ((Math.max(this.y, Character.MIN_Y) - Character.MIN_Y )/ (Character.MAX_Y - Character.MIN_Y)) * (Character.MAX_SCALE - Character.MIN_SCALE) + Character.MIN_SCALE;
};

Character.prototype.moveTo = function(x, y){
	this.startX = this.x;
	this.startY = this.y;
	this.targetX = x;
	this.targetY = y;
	this.moveTime = this.game.time.localTime;

	var dist = Math.sqrt(Math.pow(this.targetX - this.startX, 2) + Math.pow(this.targetY - this.startY, 2));
	this.moveDuration = dist / this.speed;
	
	//this.setCurrentSprite("move");
};


//Health
var hp = 0;

Character.prototype.takeDamage = function(){

};
