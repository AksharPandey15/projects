/**************************************

TV:
Is a prop you can add a photo to.

**************************************/

Game.addToManifest({
	tv: "sprites/tv.png",
	chyron: "sprites/chyron.png",
	chyron2: "sprites/chyron2.png",
	chyron3: "sprites/chyron3.png",
	body: "sprites/peeps/body.json",
	face: "sprites/peeps/face.json"
});

function TV(scene){

	var self = this;
	self._CLASS_ = "TV";

	// Properties
	self.scene = scene;
	self.x = Game.width/2;
	self.y = Game.height/2 + 80;
	self.width = 150;
	self.height = 180;

	// Graphics
	var resources = PIXI.loader.resources;
    var g = new PIXI.Container();
    var bg = new PIXI.Sprite(resources.tv.texture);
    bg.anchor.x = 0.5;
    bg.anchor.y = 1.0;
    bg.scale.x = bg.scale.y = 0.5;
    g.addChild(bg);
    self.graphics = g;

    // Offset
    self.offset = {
    	x: 0,
    	y: -113.5,
    	scale: 8
    };

    // Photo container
    var photoContainer = new PIXI.Container();
    var conversion = 0.5; // from 1/4 to 1/8
    photoContainer.x = self.offset.x - Camera.WIDTH*0.5*conversion;
    photoContainer.y = self.offset.y - Camera.HEIGHT*0.5*conversion;
    photoContainer.scale.x = photoContainer.scale.y = conversion;
    g.addChild(photoContainer);

    // Update
	self.update = function(){
		self.updateGraphics();
	};
	self.updateGraphics = function(){
		g.x = self.x;
    	g.y = self.y;
	};

	// PHOTO
	var photo;
	self.placePhoto = function(options){

		// OPTIONS
		var photoTexture = options.photo;
		var text = options.text || "";

		// Clear screen
		photoContainer.removeChildren();

		// Add photo now
		photo = new PIXI.Sprite(photoTexture);
	    photoContainer.addChild(photo);

		// Chryon container
		var chyron = new PIXI.Container();
		chyron.alpha = 0;
		chyron.x = -15;
		Tween_get(chyron).to({alpha:1}, _s(0.5), Ease.quadInOut);
		Tween_get(chyron).to({x:0}, _s(0.8), Ease.quadInOut);
		photoContainer.addChild(chyron);

		// Chyron BG
		var resourceName;
		if(options.nothing) resourceName="chyron3";
		else if(options.fail) resourceName="chyron2";
		else resourceName="chyron";
		var bg = new MakeSprite(resourceName);
		bg.scale.x = bg.scale.y = 1/8;
		chyron.addChild(bg);

		// Chyron Text
		if(!options.nothing){
			var fontsize=100, max=14;
			if(text.length>max){ // more than [max] chars...
				fontsize = Math.floor(max*fontsize/text.length);
			}
		    var text = new PIXI.Text(text, {font:"bold "+fontsize+"px Poppins", fill:"#FFF"});
		    text.scale.x = text.scale.y = 0.2;
		    text.anchor.x = 0;
		    text.anchor.y = 0.5;
		    text.x = 45;
		    text.y = 115;
		    chyron.addChild(text);
		}

		// LIVE NEWS REPORTER OVERLAY
		if(self._reporterInterval) clearInterval(self._reporterInterval);
		if(!options.nothing){
			var reporterBox = new PIXI.Container();
			reporterBox.x = 195;
			reporterBox.y = 100;
			reporterBox.scale.x = reporterBox.scale.y = 0.38;

			// "LIVE" Badge
			var liveBadge = new PIXI.Graphics();
			liveBadge.beginFill(0xEE2222, 1);
			liveBadge.drawRect(-36, -106, 72, 22);
			liveBadge.endFill();
			reporterBox.addChild(liveBadge);

			var liveText = new PIXI.Text("LIVE", {font:"bold 14px Poppins", fill:"#FFF", align:"center"});
			liveText.anchor.set(0.5, 0.5);
			liveText.y = -95;
			reporterBox.addChild(liveText);

			// Reporter Peep Body
			var repBody = MakeMovieClip("body");
			repBody.gotoAndStop(0); // Circle body for professional anchor
			repBody.anchor.set(0.5, 1.0);
			repBody.y = -2;
			reporterBox.addChild(repBody);

			// Reporter Peep Face
			var repFace = MakeMovieClip("face");
			repFace.gotoAndStop(0);
			repFace.anchor.set(0.5, 1.0);
			repFace.y = -2;
			reporterBox.addChild(repFace);

			// Reporter Microphone
			var mic = new PIXI.Graphics();
			mic.beginFill(0x333333, 1);
			mic.drawRect(-3, -35, 6, 25);
			mic.beginFill(0xDD2222, 1);
			mic.drawCircle(0, -38, 7);
			mic.endFill();
			reporterBox.addChild(mic);

			// Add to photo container with slide-in animation
			reporterBox.alpha = 0;
			reporterBox.x = 230;
			Tween_get(reporterBox).wait(_s(0.3)).to({alpha:1, x:195}, _s(0.6), Ease.quadInOut);
			photoContainer.addChild(reporterBox);

			// Animate reporter talking (alternating faces and bobbing)
			self._reporterInterval = setInterval(function(){
				if(!reporterBox.parent || !reporterBox.visible){
					clearInterval(self._reporterInterval);
					return;
				}
				var frames = [0, 5, 4, 5, 0, 1];
				repFace.gotoAndStop(frames[Math.floor(Math.random()*frames.length)]);
				repBody.scale.y = 1 + (Math.random()*0.08 - 0.04);
			}, 180);
		}

	}

	// Update!
	self.update();

}