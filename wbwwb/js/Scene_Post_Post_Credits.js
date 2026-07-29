Game.addToManifest({
	
	logo: "sprites/postcredits/logo.png",
	
	facebook: "sprites/postcredits/facebook.png",
	twitter: "sprites/postcredits/twitter.png",

	end_button: "sprites/postcredits/end_button.json"

});

function Scene_Post_Post_Credits(){
	
	var self = this;
	Scene.call(self);

	self.UNPAUSEABLE = true; // HACK.

	// Layers, yo.
	Game.stage.addChild(MakeSprite("blackout"));
	var cont = new PIXI.Container();
	Game.stage.addChild(cont);

	var creditCont = new PIXI.Container();
	cont.addChild(creditCont);
	creditCont.alpha = 0;

	var createdBy = new PIXI.Text("Created by Akshar Pandey", {font:"bold 36px Poppins, sans-serif", fill:"#FFFFFF", align:"center"});
	createdBy.anchor.x = 0.5;
	createdBy.anchor.y = 0.5;
	createdBy.x = Game.width / 2;
	createdBy.y = Game.height / 2 - 25;
	creditCont.addChild(createdBy);

	var inspiredBy = new PIXI.Text("Inspired by Nicky Case", {font:"24px Poppins, sans-serif", fill:"#AAAAAA", align:"center"});
	inspiredBy.anchor.x = 0.5;
	inspiredBy.anchor.y = 0.5;
	inspiredBy.x = Game.width / 2;
	inspiredBy.y = Game.height / 2 + 25;
	creditCont.addChild(inspiredBy);

	var interactiveCont = new PIXI.Container();
	cont.addChild(interactiveCont);
	interactiveCont.alpha = 0;
	var endTitle1 = new PIXI.Text("ब्रेकिंग इंडिया:", {font:"bold 64px Poppins, sans-serif", fill:"#FFFFFF", align:"center"});
	endTitle1.anchor.x = 0.5;
	endTitle1.anchor.y = 0.5;
	endTitle1.x = Game.width / 2;
	endTitle1.y = 100;
	interactiveCont.addChild(endTitle1);

	var endTitle2 = new PIXI.Text("नफ़रत LIVE", {font:"bold 80px Poppins, sans-serif", fill:"#FFFFFF", align:"center"});
	endTitle2.anchor.x = 0.5;
	endTitle2.anchor.y = 0.5;
	endTitle2.x = Game.width / 2;
	endTitle2.y = 190;
	interactiveCont.addChild(endTitle2);

	// _addButton
	var isHovering = false;
	var _addButton = function(x, labelFrame, callback){

		var button = new PIXI.Container();
		button.x = x;
		button.y = 280;
		interactiveCont.addChild(button);

		var bg = MakeMovieClip("end_button");
		bg.anchor.x = bg.anchor.y = 0.5;
		button.addChild(bg);

		var label = MakeMovieClip("end_button");
		label.anchor.x = label.anchor.y = 0.5;
		label.gotoAndStop(labelFrame);
		button.addChild(label);

		// INTERACTIVITY!
		button.interactive = true;
		button.mouseover = function(){
			isHovering = true;
			bg.gotoAndStop(1);
			Tween_get(button.scale).to({x:1.05, y:1.05}, _s(0.2));
		};
		button.mouseout = function(){
			isHovering = false;
			bg.gotoAndStop(0);
			Tween_get(button.scale).to({x:1, y:1}, _s(0.2));
		};
		button.mousedown = button.touchstart = function(){
			isHovering = false;
			Game.sounds.squeak.play();
			callback();
		};

	};
	_addButton(Game.width / 2, 4, function(){
		Game.sceneManager.gotoScene("Quote");
	});

	// CURSOR
    var cursor = new Cursor(self);
    var g = cursor.graphics;
    cont.addChild(g);
    g.scale.x = g.scale.y = 0.5;
    g.x = Game.width/2;
    g.y = Game.height/2;

	// TWEEN ANIM
	Tween_get(creditCont)
	.wait(_s(BEAT*0.5))
	.to({alpha:1}, _s(BEAT), Ease.quadInOut)
	.wait(_s(BEAT*3))
	.to({alpha:0}, _s(BEAT), Ease.quadInOut)
	.call(function(){
		Tween_get(interactiveCont)
		.to({alpha:1}, _s(BEAT), Ease.quadInOut);
	});

	// Update!
	self.update = function(){
		cursor.update(isHovering);
	}

}