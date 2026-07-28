/**************************************

GAME CLASS SINGLETON:
Handles the DOM, load, init, update & render loops

**************************************/

(function(exports){

// Singleton
var Game = {};
exports.Game = Game;

// PROPERTIES
Game.width = 960;
Game.height = 540;
Game.stats = true;

// INIT
Game.init = function(HACK){

	// Set up PIXI
	Game.renderer = new PIXI.WebGLRenderer(Game.width, Game.height);
	document.querySelector("#stage").appendChild(Game.renderer.view);
	Game.stage = new PIXI.Container();
	Game.stage.interactive = true;

	// Mr Doob Stats
	if(Game.stats){
		Game.stats = new Stats();
		Game.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
		document.body.appendChild(Game.stats.dom);
	}

	// Scene Manager
	Game.scene = null;
	Game.sceneManager = new SceneManager();

	if(HACK){
		// NOT preloader - jump direct to a scene
		Game.loadAssets(function(){ // well, also get preloader assets...
			Game.loadAssets(function(){
				Game.sceneManager.gotoScene(HACK);
				setInterval(Game.update,1000/60);
				Game.animate();
			}, function(){}, false);
		}, function(){}, true);
	}else{
		// Preloader
		Game.loadAssets(function(){
			Game.sceneManager.gotoScene("Preloader");
			setInterval(Game.update,1000/60);
			Game.animate();
		}, function(){}, true);
	}

};

// UPDATE & ANIMATE

Game.paused = false;

Game.update = function(){
	if(Game.paused) return;
	Tween.tick();
	Game.sceneManager.update();
};

Game.animate = function(){
	if(Game.stats) Game.stats.begin();
	if(!Game.paused){
    	Game.renderer.render(Game.stage);
    }
    if(Game.stats) Game.stats.end();
    requestAnimationFrame(Game.animate);
};

// GAME PAUSED?
// ON BLUR & PAUSE

var modal_shade = document.getElementById("modal_shade");
var paused = document.getElementById("paused");
window.onblur = function(){
	if(Game.scene && Game.scene.UNPAUSEABLE) return;
	modal_shade.style.display = "block";
	paused.style.display = "block";
	Game.paused = true;
	Howler.mute(true);
}
modal_shade.onclick = paused.onclick = function(){
	modal_shade.style.display = "none";
	paused.style.display = "none";
	Game.paused = false;
	Howler.mute(false);
};

// FULLSCREEN TOGGLE (Press 'F' or Double-click game canvas)
var toggleFullscreen = function(){
	if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
		if (document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen();
		} else if (document.documentElement.webkitRequestFullscreen) {
			document.documentElement.webkitRequestFullscreen();
		} else if (document.documentElement.mozRequestFullScreen) {
			document.documentElement.mozRequestFullScreen();
		}
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		}
	}
};
window.addEventListener("keydown", function(e){
	if(e.key === "f" || e.key === "F" || e.key === "F11"){
		toggleFullscreen();
	}
});
window.addEventListener("DOMContentLoaded", function(){
	var stageEl = document.querySelector("#stage");
	if(stageEl) stageEl.addEventListener("dblclick", toggleFullscreen);
	var fsBtn = document.querySelector("#fullscreen_btn");
	if(fsBtn) fsBtn.addEventListener("click", toggleFullscreen);
});

// LOADING, and ADDING TO MANIFEST.
// TO DO: Progress, too

Game.manifest = {};
Game.manifest2 = {}; // FOR PRELOADER
Game.sounds = {};

Game.loadAssets = function(completeCallback, progressCallback, PRELOADER){

	var manifest = PRELOADER ? Game.manifest2 : Game.manifest;

	// ABSOLUTE NUMBER OF ASSETS!
	var _totalAssetsLoaded = 0;
	var _totalAssetsToLoad = 0;
	for(var key in manifest){
		var src = manifest[key];
		var cleanSrc = src.split("?")[0];
		if(cleanSrc.slice(-5)==".json"){
			// Is Sprite. Actually TWO assets.
			_totalAssetsToLoad += 2;
		}else{
			_totalAssetsToLoad += 1;
		}
	}
	var _onAssetLoad = function(){
		_totalAssetsLoaded++;
		progressCallback(_totalAssetsLoaded/_totalAssetsToLoad); // PROGRESS.
	};

	// META: Groups To Load – just images & sounds
	var _groupsToLoad = PRELOADER ? 1 : 2;
	var _onGroupLoaded = function(){
		_groupsToLoad--;
		if(_groupsToLoad==0) completeCallback(); // DONE.
	};

	// Howler
	var _soundsToLoad = 0;
	var _onSoundLoad = function(){
		_soundsToLoad--;
		_onAssetLoad();
		if(_soundsToLoad<=0) _onGroupLoaded();
	};

	// PIXI
	var loader = PIXI.loader;
	var resources = PIXI.loader.resources;

	for(var key in manifest){

		var src = manifest[key];
		var cleanSrc = src.split("?")[0];

		// Is MP3. Leave it to Howler.
		if(cleanSrc.slice(-4)==".mp3"){
			var suffix = src.indexOf("?")>=0 ? "?"+src.split("?")[1] : "";
			var sound = new Howl({ src:[
				cleanSrc.slice(0, cleanSrc.length-4)+".opus"+suffix,
				cleanSrc.slice(0, cleanSrc.length-4)+".m4a"+suffix,
				src
			] });
			_soundsToLoad++;
			sound.once('load', _onSoundLoad);
			sound.once('loaderror', _onSoundLoad);
			Game.sounds[key] = sound;
			continue;
		}

		// Otherwise, is an image. Leave it to PIXI.
	    loader.add(key, src);

	}

	if(!PRELOADER && _soundsToLoad==0) _onGroupLoaded();

	// PIXI
	loader.on('progress',_onAssetLoad);
	loader.once('complete', _onGroupLoaded);
	loader.load();

};

// Add To Manifest
Game.addToManifest = function(keyValues, PRELOADER){
	var manifest = PRELOADER ? Game.manifest2 : Game.manifest;
	for(var key in keyValues){
		manifest[key] = keyValues[key];
	}
};

})(window);