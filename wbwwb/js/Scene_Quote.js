Game.addToManifest({
	blackout: "sprites/quote/quote0001.png",
	quote0002: "sprites/quote/quote0002.png",
	quote0003: "sprites/quote/quote0003.png",
	quote0004: "sprites/quote/quote0004.png",

	bg_park: "sounds/bg_park.mp3"
});

function Scene_Quote() {

	var self = this;
	Scene.call(self);

	// Layers, yo.
	var q1 = MakeSprite("blackout");
	var q2 = new PIXI.Text("ब्रेकिंग इंडिया: नफ़रत LIVE", { font: "bold 72px Poppins, sans-serif", fill: "#FF2222", align: "center", stroke: "#000000", strokeThickness: 6 });
	q2.anchor.set(0.5);
	q2.x = Game.width / 2;
	q2.y = Game.height / 2 - 60;

	var q3 = new PIXI.Text("The monster was not the press; \n the monster was the public,\n and the press was only its mirror.", { font: "48px Poppins, sans-serif", fill: "#FFFFFF", align: "center" });
	q3.anchor.x = 0.5;
	q3.anchor.y = 0.5;
	q3.x = Game.width / 2;
	q3.y = Game.height / 2 - 20;

	var q4 = new PIXI.Text("— Thomas Harris", { font: "28px Poppins, sans-serif", fill: "#AAAAAA", align: "center" });
	q4.anchor.x = 0.5;
	q4.anchor.y = 0.5;
	q4.x = Game.width / 2;
	q4.y = Game.height / 2 + 230;

	// Add 'em in.
	q2.alpha = q3.alpha = q4.alpha = 0;
	Game.stage.addChild(q1);
	var text = new PIXI.Container();
	Game.stage.addChild(text);
	text.addChild(q2);
	text.addChild(q3);
	text.addChild(q4);

	// TWEEN ANIM
	Tween_get(q2)
		.wait(_s(BEAT * 1.5))
		.to({ alpha: 1 }, _s(BEAT), Ease.quadInOut).call(function () {
			Tween_get(q3)
				.wait(_s(0.5 * BEAT))
				.to({ alpha: 1 }, _s(BEAT), Ease.quadInOut).call(function () {
					Tween_get(q4)
						.wait(_s(BEAT))
						.to({ alpha: 1 }, _s(BEAT), Ease.quadInOut)
						.call(function () {

							// Background Ambience
							var ambience = Game.sounds.bg_park;
							if (ambience) {
								ambience.loop(true);
								ambience.volume(0);
								ambience.play();
								ambience.fade(0, 1, 2000);
							}

						})
						.wait(_s(4.0 * BEAT))
						.call(function () {

							Tween_get(text).to({ alpha: 0 }, _s(BEAT), Ease.quadInOut).call(function () {
								Game.sceneManager.gotoScene("Game");
							});

						});
				});
		});

}