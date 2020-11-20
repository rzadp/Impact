// Our Main Game class. This will load levels, host all entities and
// run the game.

import { igGame } from '../../lib/impact/game';
import { igImage } from '../../lib/impact/image'
import { igFont } from '../../lib/impact/font'
import { igSound } from '../../lib/impact/sound'
import { igKEY } from '../../lib/impact/input'
import { igCollisionMap } from '../../lib/impact/collision-map'
import { igBackgroundMap } from '../../lib/impact/background-map'
// import { igGAMEPAD } from '../../plugins/gamepad'
import { igImpactSplashLoader } from '../../plugins/impact-splash-loader';
import { LevelGrasslands } from './levels/grasslands';
import { LevelTitle } from './levels/title';
import { EntityBlob } from './entities/blob';
import { EntityPlayer } from './entities/player';
import { EntityCoin } from './entities/coin';
import { EntityFireball } from './entities/fireball';
import { EntityLevelchange } from './entities/levelchange';
import { EntityTrigger } from './entities/trigger';
import { EntityHurt } from './entities/hurt';
import { igCamera } from '../../plugins/camera';

class MyGame extends igGame{
	
	clearColor= "#d0f4f7";
	gravity= 800; // All entities are affected by this
	
	// Load a font
	font= new igFont( 'jumpnrun/fredoka-one.font.png' );

	// HUD icons
	heartFull= new igImage( 'jumpnrun/heart-full.png' );
	heartEmpty= new igImage( 'jumpnrun/heart-empty.png' );
	coinIcon= new igImage( 'jumpnrun/coin.png' );
	
	
	constructor() {
    super();
		// We want the font's chars to slightly touch each other,
		// so set the letter spacing to -2px.
		this.font.letterSpacing = -2;		
		
		// Load the LevelGrasslands as required above ('game.level.grassland')
		this.loadLevel( LevelGrasslands );
  }
  
  getEntityClass(type) {
    if (typeof(type) !== 'string') return type

    switch (type) {
      case 'EntityBlob':
        return EntityBlob;
      case 'EntityPlayer':
        return EntityPlayer;
      case 'EntityCoin':
        return EntityCoin;
      case 'EntityFireball':
        return EntityFireball;
      case 'EntityHurt':
        return EntityHurt;
      case 'EntityLevelchange':
        return EntityLevelchange;
      case 'EntityTrigger':
        return EntityTrigger;
      default:
       throw new Error(`Unregistered entity class: ${type}`)
    }
  }

	loadLevel( data ) {
		// Remember the currently loaded level, so we can reload when
		// the player dies.
		this.currentLevel = data;

		// Call the parent implemenation; this creates the background
		// maps and entities.
		super.loadLevel( data );
		
		this.setupCamera();
	}
	
	setupCamera() {
		// Set up the camera. The camera's center is at a third of the screen
		// size, i.e. somewhat shift left and up. Damping is set to 3px.		
		this.camera = new igCamera( ig.system.width/3, ig.system.height/3, 3 );
		
		// The camera's trap (the deadzone in which the player can move with the
		// camera staying fixed) is set to according to the screen size as well.
    	this.camera.trap.size.x = ig.system.width/10;
    	this.camera.trap.size.y = ig.system.height/3;
		
		// The lookahead always shifts the camera in walking position; you can 
		// set it to 0 to disable.
    	this.camera.lookAhead.x = ig.system.width/6;
		
		// Set camera's screen bounds and reposition the trap on the player
    	this.camera.max.x = this.collisionMap.pxWidth - ig.system.width;
    	this.camera.max.y = this.collisionMap.pxHeight - ig.system.height;
    	this.camera.set( this.player );
	}

	reloadLevel() {
		this.loadLevelDeferred( this.currentLevel );
	}
	
	update() {		
		// Update all entities and BackgroundMaps
		super.update();
		
		// Camera follows the player
		this.camera.follow( this.player );
		
		// Instead of using the camera plugin, we could also just center
		// the screen on the player directly, like this:
		// this.screen.x = this.player.pos.x - ig.system.width/2;
		// this.screen.y = this.player.pos.y - ig.system.height/2;
	}
	
	draw() {
		// Call the parent implementation to draw all Entities and BackgroundMaps
		super.draw();
		

		// Draw the heart and number of coins in the upper left corner.
		// 'this.player' is set by the player's init method
		if( this.player ) {
			var x = 16, 
				y = 16;

			for( var i = 0; i < this.player.maxHealth; i++ ) {
				// Full or empty heart?
				if( this.player.health > i ) {
					this.heartFull.draw( x, y );
				}
				else {
					this.heartEmpty.draw( x, y );	
				}

				x += this.heartEmpty.width + 8;
			}

			// We only want to draw the 0th tile of coin sprite-sheet
			x += 48;
			this.coinIcon.drawTile( x, y+6, 0, 36 );

			x += 42;
			this.font.draw( 'x ' + this.player.coins, x, y+10 )
		}
		
		// Draw touch buttons, if we have any
		if( window.myTouchButtons ) {
			window.myTouchButtons.draw(); 
		}
	}
};



// The title screen is simply a Game Class itself; it loads the LevelTitle
// runs it and draws the title image on top.

class MyTitle extends igGame{
	clearColor= "#d0f4f7";
	gravity= 800;

	// The title image
	title= new igImage( 'jumpnrun/title.png' );

	// Load a font
	font= new igFont( 'jumpnrun/fredoka-one.font.png' );

	constructor() {
    super();
		// Bind keys
		ig.input.bind( igKEY.LEFT_ARROW, 'left' );
		ig.input.bind( igKEY.RIGHT_ARROW, 'right' );
		ig.input.bind( igKEY.X, 'jump' );
		ig.input.bind( igKEY.C, 'shoot' );

		// ig.input.bind( igGAMEPAD.PAD_LEFT, 'left' );
		// ig.input.bind( igGAMEPAD.PAD_RIGHT, 'right' );
		// ig.input.bind( igGAMEPAD.FACE_1, 'jump' );
		// ig.input.bind( igGAMEPAD.FACE_2, 'shoot' );	
		// ig.input.bind( igGAMEPAD.FACE_3, 'shoot' );	


		
		// Align touch buttons to the screen size, if we have any
		if( window.myTouchButtons ) {
			window.myTouchButtons.align(); 
		}

		// We want the font's chars to slightly touch each other,
		// so set the letter spacing to -2px.
		this.font.letterSpacing = -2;

		this.loadLevel( LevelTitle );
		this.maxY = this.backgroundMaps[0].pxHeight - ig.system.height;
  }
  
  getEntityClass(type) {
    if (typeof(type) !== 'string') return type

    switch (type) {
      case 'EntityBlob':
        return EntityBlob;
      case 'EntityPlayer':
        return EntityPlayer;
      case 'EntityCoin':
        return EntityCoin;
      case 'EntityFireball':
        return EntityFireball;
      case 'EntityHurt':
        return EntityHurt;
      case 'EntityLevelchange':
        return EntityLevelchange;
      case 'EntityTrigger':
        return EntityTrigger;
      default:
       throw new Error(`Unregistered entity class: ${type}`)
    }
  }

	update() {
		// Check for buttons; start the game if pressed
		if( ig.input.pressed('jump') || ig.input.pressed('shoot') ) {
			ig.system.setGame( MyGame );
			return;
		}
		
		
		super.update();

		// Scroll the screen down; apply some damping.
		var move = this.maxY - this.screen.y;
		if( move > 5 ) {
			this.screen.y += move * ig.system.tick;
			this.titleAlpha = this.screen.y / this.maxY;
		}
		this.screen.x = (this.backgroundMaps[0].pxWidth - ig.system.width)/2;
	}

	draw() {
		super.draw();

		var cx = ig.system.width/2;
		this.title.draw( cx - this.title.width/2, 60 );
		
		var startText = ig.ua.mobile
			? 'Press Button to Play!'
			: 'Press X or C to Play!';
		
		this.font.draw( startText, cx, 420, igFont.ALIGN.CENTER);

		// Draw touch buttons, if we have any
		if( window.myTouchButtons ) {
			window.myTouchButtons.draw(); 
		}
	}
};


if( ig.ua.mobile ) {
	// Use the TouchButton Plugin to create a TouchButtonCollection that we
	// can draw in our game classes.
	
	// Touch buttons are anchored to either the left or right and top or bottom
	// screen edge.
	var buttonImage = new igImage( 'jumpnrun/touch-buttons.png' );
	myTouchButtons = new igTouchButtonCollection([
		new igTouchButton( 'left', {left: 0, bottom: 0}, 128, 128, buttonImage, 0 ),
		new igTouchButton( 'right', {left: 128, bottom: 0}, 128, 128, buttonImage, 1 ),
		new igTouchButton( 'shoot', {right: 128, bottom: 0}, 128, 128, buttonImage, 2 ),
		new igTouchButton( 'jump', {right: 0, bottom: 96}, 128, 128, buttonImage, 3 )
	]);
}

// If our screen is smaller than 640px in width (that's CSS pixels), we scale the 
// internal resolution of the canvas by 2. This gives us a larger viewport and
// also essentially enables retina resolution on the iPhone and other devices 
// with small screens.
var scale = (window.innerWidth < 640) ? 2 : 1;


// Listen to the window's 'resize' event and set the canvas' size each time
// it changes.
window.addEventListener('resize', function(){
	// If the game hasn't started yet, there's nothing to do here
	if( !ig.system ) { return; }
	
	// Resize the canvas style and tell Impact to resize the canvas itself;
	canvas.style.width = window.innerWidth + 'px';
	canvas.style.height = window.innerHeight + 'px';
	ig.system.resize( window.innerWidth * scale, window.innerHeight * scale );
	
	// Re-center the camera - it's dependend on the screen size.
	if( ig.game && ig.game.setupCamera ) {
		ig.game.setupCamera();
	}
	
	// Also repositon the touch buttons, if we have any
	if( window.myTouchButtons ) {
		window.myTouchButtons.align(); 
	}
}, false);


// Finally, start the game into MyTitle and use the ImpactSplashLoader plugin 
// as our loading screen
var width = window.innerWidth * scale,
	height = window.innerHeight * scale;

window.onload = () => {
  // We want to run the game in "fullscreen", so let's use the window's size
  // directly as the canvas' style size.
  var canvas = document.getElementById('canvas');
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';

  ig.main( '#canvas', MyTitle, 60, width, height, 1, igImpactSplashLoader );
}
