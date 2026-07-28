Game.addToManifest({

	credits0001: "sprites/credits/credits0001.png", // nicky case
	credits0002: "sprites/credits/credits0002.png", // playtesters
	credits0003: "sprites/credits/credits0003.png", // patreon
	credits0004: "sprites/credits/credits0004.png", // patreon
	credits0005: "sprites/credits/credits0005.png", // patreon
	credits0006: "sprites/credits/credits0006.png", // patreon
	credits0007: "sprites/credits/credits0007.png", // and thank...
	credits0008: "sprites/credits/credits0008.png", // ...YOU!

});

function Scene_Credits(){
	
	var self = this;
	Scene.call(self);

	// Layers, yo.
	var cont = new PIXI.Container();
	Game.stage.addChild(cont);

	function makeSlide(titleText, bodyText) {
		var slide = new PIXI.Container();
		
		var title = new PIXI.Text(titleText, {
			font: "bold 26px Poppins, sans-serif",
			fill: "#FFFFFF",
			align: "center",
			wordWrap: true,
			wordWrapWidth: 840
		});
		title.anchor.x = 0.5;
		title.anchor.y = 0.5;
		title.x = Game.width / 2;
		title.y = Game.height / 2 - 60;
		slide.addChild(title);

		var body = new PIXI.Text(bodyText, {
			font: "22px Poppins, sans-serif",
			fill: "#CCCCCC",
			align: "center",
			wordWrap: true,
			wordWrapWidth: 840
		});
		body.anchor.x = 0.5;
		body.anchor.y = 0.5;
		body.x = Game.width / 2;
		body.y = Game.height / 2 + 30;
		slide.addChild(body);

		slide.alpha = 0;
		return slide;
	}

	var s1 = makeSlide("REAL-WORLD EXAMPLE: MEDIA & DEMOCRACY", "In 'ब्रेकिंग इंडिया: नफ़रत LIVE', TV news amplifies hatred and conflict for engagement.\nIn Indian democracy today, similar media dynamics have sparked widespread youth protests.");
	var s2 = makeSlide("THE CJP PROTESTS & 'GODI MEDIA'", "During the Cockroach Janata Party (CJP) demonstrations at Jantar Mantar protesting exam leaks\nand demanding accountability, youth chanted slogans against mainstream 'Godi Media' —\naccusing TV news channels of ignoring real grievances and distorting facts to serve power.");
	var s3 = makeSlide("BYPASSING SENSATIONALISM WITH DIGITAL TRUTH", "Instead of relying on biased television broadcasts that thrive on division and 'whataboutery',\nthe CJP protesters adopted a digital-first strategy — using social media to share raw truth,\nmobilize citizens, and challenge mainstream media gatekeepers directly.");
	var s4 = makeSlide("THE LESSON OF THE GAME", "When traditional media trades integrity for sensationalism, democracy suffers.\nReal change happens when citizens reject divisive narratives and demand accountability.\n\nThank you for playing.");

	cont.addChild(s1);
	cont.addChild(s2);
	cont.addChild(s3);
	cont.addChild(s4);

	// TWEEN ANIM
	Tween_get(s1).wait(_s(BEAT*1.5))
	.to({alpha:1}, _s(BEAT), Ease.quadInOut)
	.wait(_s(BEAT*5.5))
	.to({alpha:0}, _s(BEAT), Ease.quadInOut)
	.call(function(){

		Tween_get(s2)
		.to({alpha:1}, _s(BEAT), Ease.quadInOut)
		.wait(_s(BEAT*6.5))
		.to({alpha:0}, _s(BEAT), Ease.quadInOut)
		.call(function(){

			Tween_get(s3)
			.to({alpha:1}, _s(BEAT), Ease.quadInOut)
			.wait(_s(BEAT*6.5))
			.to({alpha:0}, _s(BEAT), Ease.quadInOut)
			.call(function(){

				Tween_get(s4)
				.to({alpha:1}, _s(BEAT), Ease.quadInOut)
				.wait(_s(BEAT*6.5))
				.to({alpha:0}, _s(BEAT), Ease.quadInOut)
				.call(function(){
					
					// Fade everything out, and NIGHTTIME SOUNDS
					Tween_get(cont)
					.wait(_s(BEAT))
					.to({alpha:0}, _s(BEAT), Ease.quadInOut)
					.call(function(){
						Game.sceneManager.gotoScene("Post_Credits");
					});

					// Background Ambience
					var ambience = Game.sounds.bg_nighttime;
					if(ambience){
						ambience.loop(true);
						ambience.volume(0);
						ambience.play();
						ambience.fade(0, 1, 2000);
					}

				});
			});
		});
	});

}