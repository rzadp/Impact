import { tpfStereoRenderer } from '../../plugins/twopointfive/renderer/stereo-renderer';
import { igTimer } from '../../lib/impact/timer';
import { igSound } from '../../lib/impact/sound';
import { tpfLoader } from '../../plugins/twopointfive/loader';
import { tpfGame } from '../../plugins/twopointfive/game';
import { tpfSystem } from '../../plugins/twopointfive/system';
import { igKEY } from '../../lib/impact/input';
import { MyTitle } from './title';
import { MyHud } from './hud';
import { LevelBase1 } from './levels/base1';

export class MyGame extends tpfGame{
	sectorSize= 4;
	hud= null;

	dead= false;
	menu= null;
	
	touchButtons= null;
	touchFieldMove= null;
	touchFieldTurn= null;

	gravity= 4;

	blobSpawnWaitInitial= 2;
	blobSpawnWaitCurrent= 2;
	blobSpawnWaitDiv= 1.01;
	blobKillCount= 0;
	blobSpawnTimer= null;

	powerupSpawnWait= 8;
	powerupSpawnTimer= null;
	
	constructor() {
    super();
		// Setup HTML Checkboxes and mouse lock on click
		if( !ig.ua.mobile ) {
			ig.$('#requestFullscreen').addEventListener('click', function( ev ) {
				ig.system.requestFullscreen();
				ev.preventDefault();
				this.blur();
				return false;
			},false);

			ig.$('#riftStereoMode').addEventListener('change', function( ev ) {
				ig.system.setStereoMode(ev.target.checked);
				ev.preventDefault();
				this.blur();
				return false;
			},false);

			if( ig.$('#riftStereoMode').checked ) {
				ig.system.setStereoMode(true);
			}

			ig.system.canvas.addEventListener('click', function(){
				ig.system.requestMouseLock();
			});
		}
		
		// Setup Controls
		ig.input.bind( igKEY.MOUSE1, 'click' );
		if( ig.ua.mobile ) { 
			this.setupTouchControls(); 
		}
		else { 
			this.setupDesktopControls(); 
		}
		

		this.setTitle();
	}

	setTitle() {
		this.menu = new MyTitle();
	}

	setGame() {
		this.menu = null;
		this.dead = false;
		this.hud = new MyHud( 640, 480 );

		this.blobKillCount = 0;
    this.blobSpawnWaitInitial = this.blobSpawnWaitInitial;
    console.log('game has ben set..')
		this.blobSpawnTimer = new igTimer(this.blobSpawnWaitInitial);
		this.powerupSpawnTimer = new igTimer(this.powerupSpawnWait);

		// Load the last level we've been in or the default Base1
		this.loadLevel( this.lastLevel || LevelBase1 );
	}
	
	setupDesktopControls() {
		// Setup keyboard & mouse controls
		ig.input.bind( igKEY.UP_ARROW, 'forward' );
		ig.input.bind( igKEY.LEFT_ARROW, 'left' );
		ig.input.bind( igKEY.DOWN_ARROW, 'back' );
		ig.input.bind( igKEY.RIGHT_ARROW, 'right' );
		
		ig.input.bind( igKEY.C, 'shoot' );
		ig.input.bind( igKEY.ENTER, 'shoot' );
		ig.input.bind( igKEY.X, 'run' );
		ig.input.bind( igKEY.V, 'weaponNext' );

		ig.input.bind( igKEY.ESC, 'pause' );
		
		ig.input.bind( igKEY.W, 'forward' );
		ig.input.bind( igKEY.A, 'stepleft' );
		ig.input.bind( igKEY.S, 'back' );
		ig.input.bind( igKEY.D, 'stepright' );
		
		ig.input.bind( igKEY.SHIFT, 'run' );
		ig.input.bind( igKEY.CTRL, 'shoot' );
		
		ig.input.bind( igKEY.MOUSE2, 'run' );
		ig.input.bind( igKEY.MWHEEL_UP, 'weaponNext' );
		ig.input.bind( igKEY.MWHEEL_DOWN, 'weaponPrev' );

    // Setup Gamepad
    if (false) {
      ig.input.bind( ig.GAMEPAD.PAD_TOP, 'forward' );
      ig.input.bind( ig.GAMEPAD.PAD_LEFT, 'left' );
      ig.input.bind( ig.GAMEPAD.PAD_BOTTOM, 'back' );
      ig.input.bind( ig.GAMEPAD.PAD_RIGHT, 'right' );
  
      ig.input.bind( ig.GAMEPAD.RIGHT_SHOULDER_BOTTOM, 'shoot' );
      ig.input.bind( ig.GAMEPAD.LEFT_SHOULDER_BOTTOM, 'run' );
      ig.input.bind( ig.GAMEPAD.FACE_1, 'shoot' );
      ig.input.bind( ig.GAMEPAD.FACE_4, 'reset-tracking' );
      ig.input.bind( ig.GAMEPAD.FACE_3, 'weaponNext' );
      ig.input.bind( ig.GAMEPAD.FACE_2, 'weaponPrev' );
    }
	}

	setupTouchControls() {
		if( this.touchButtons ) { this.touchButtons.remove(); }
		if( this.touchFieldMove ) { this.touchFieldMove.remove(); }
		if( this.touchFieldTurn ) { this.touchFieldTurn.remove(); }

		// Touch buttons are anchored to either the left or right and top or bottom
		// edge of the screen.
		this.touchButtons = new ig.TouchButtonCollection([
			new ig.TouchButton( 'shoot', {right: 0, bottom: 0}, ig.system.width/2, ig.system.height/4 )
		]);
		this.touchButtons.align();
		
		this.touchFieldMove = new ig.TouchField(0, 0, ig.system.width/2, ig.system.height);
		this.touchFieldTurn = new ig.TouchField(ig.system.width/2, 0, ig.system.width/2, ig.system.height/4*3);
	}

	loadLevel( data ) {
		this.lastLevel = data;
		this.clearColor = null;

		// Find the info entity
		var info = null;
		for( var i = 0; i < data.entities.length; i++ ) {
			if( data.entities[i].settings && data.entities[i].settings.name == 'info' ) {
				info = data.entities[i].settings;
			}
		}

		// Use the sector size specified in the info entity or default (4)
		this.sectorSize = (info && info.sectorSize) || 4;

		// Load the map
		super.loadLevel( data );

		// Set the fog and fog color (never use fog on mobile)
		if( info && typeof info.fogColor !== 'undefined' && !ig.ua.mobile ) {
			ig.system.renderer.setFog( parseInt(info.fogColor), info.fogNear, info.fogFar );
		}
		else {
			ig.system.renderer.setFog( false );
		}

		// Remember the floor map, so we know where we can spawn entities
		this.floorMap = this.getMapByName('floor');
	}

	
	update() {
		// Reset tracking position for WebVR on button press
		if( ig.input.pressed('reset-tracking') && ig.system.renderer instanceof tpfStereoRenderer ) {
			ig.system.renderer.reset();
    }

		if( this.menu ) {
			// If we have a menu don't update anything else
			this.menu.update();
			return;
    }
    
    if (!this.hud) {
      console.log('game not set yet - refusing to update.');
      console.log({hud: this.hud, menu: this.menu})
      return;
    }
		
		if( this.dead ) {
			// Wait for keypress if we are dead
			if( ig.input.released('shoot') || (!ig.ua.mobile && ig.input.released('click')) ) {
				this.setTitle();
			}
		}
		else {
			// Is it time to spawn another Blob?
			if( this.blobSpawnTimer.delta() > 0 ) {
				this.spawnBlob();
			}
			if( this.powerupSpawnTimer.delta() > 0 ) {
				this.spawnPowerup();
			}
		}

		// Update all entities and backgroundMaps
		super.update();
		
		// Roll the death animation; just move the camera down a bit.
		if( this.deathAnimTimer ) {
			var delta = this.deathAnimTimer.delta();
			if( delta < 0 ) {
				ig.system.camera.position[1] = delta.map(
					-this.deathAnimTimer.target, 0,
					0, -ig.game.collisionMap.tilesize / 4
				);
			}
			else {
				this.deathAnimTimer = null;
				this.dead = true;
			}
		}
	}

	spawnBlob() {
		var spawnPos = null,
			playerPos = this.player.pos;

		// Try a few times to find a spawn position that's not too close
		// to the player
		for( var i = 0; i < 10; i++ ) {
			spawnPos = this.getRandomSpawnPos();
			if( Math.abs(spawnPos.x - playerPos.x) + Math.abs(spawnPos.y - playerPos.y) > 256 ) {
				// Far enough; all good!
				break;
			}
		}
		this.spawnEntity(EntityEnemyBlobSpawner, spawnPos.x, spawnPos.y);

		this.blobSpawnWaitCurrent /= this.blobSpawnWaitDiv;
		this.blobSpawnTimer.set( Math.max(this.blobSpawnWaitCurrent, 0.5) );
	}

	spawnPowerup() {
		// 1/3 chance for health, 2/3 chance for grenades
		var powerups = [EntityHealthPickup, EntityGrenadePickup, EntityGrenadePickup];
		var entityClass = powerups.random();

		var pos = this.getRandomSpawnPos();
		this.spawnEntity(entityClass, pos.x, pos.y);

		this.powerupSpawnTimer.reset();
	}

	getRandomSpawnPos() {
		// This randomly probes the floor map and stops at the first tile
		// that is set. If the floor map is empty, this results in an 
		// endless loop, so... better have a floor map in your level!
		var ts = this.floorMap.tilesize;
		while( true ) {
			var x = ((Math.random() * this.floorMap.width)|0) * ts + ts/2,
				y = ((Math.random() * this.floorMap.height)|0) * ts + ts/2;
			
			if( this.floorMap.getTile(x, y) ) {				
				return { x: x, y:y };
			}
		}
	}
	
	showDeathAnim() {
		this.deathAnimTimer = new igTimer( 1 );
	}

	drawWorld() {
		super.drawWorld();
	}

	drawHud() {
		ig.system.renderer.hudFreelook = false;
		if( this.player ) {
			ig.game.hud.draw(this.player, this.player.currentWeapon);
		}

		if( this.menu ) {
			ig.system.renderer.hudFreelook = true;
			this.menu.draw();
		}
	}
};





var width = 640;
var height = 480;

// if( window.Ejecta ) {
// 	var canvas = ig.$('#canvas');
// 	width = window.innerWidth;
// 	height = window.innerHeight;
	
// 	canvas.style.width = window.innerWidth + 'px';
// 	canvas.style.height = window.innerHeight + 'px';
// }
// else if( ig.ua.mobile ) {
// 	ig.$('#game').className = 'mobile';
// 	var canvas = ig.$('#canvas');

// 	// Listen to the window's 'resize' event and set the canvas' size each time
// 	// it changes.
// 	// Wait 16ms, because iOS might report the wrong window size immediately
// 	// after rotation.
// 	window.addEventListener('resize', function(){ setTimeout(function(){
// 		if( ig.system ) { ig.system.resize( window.innerWidth, window.innerHeight ); }
// 		if( ig.game ) { ig.game.setupTouchControls(); }
// 	}, 16); }, false);

// 	width = window.innerWidth;
// 	height = window.innerHeight;
// }


// igSound.use = [igSound.FORMAT.OGG, igSound.FORMAT.M4A];

window.onload = () => {
  console.log('I am here')
  document.body.className = (tpfSystem.hasWebGL() ? 'webgl' : 'no-webgl') + ' ' + (ig.ua.mobile ? 'mobile' : 'desktop');

  // Test WebGL support and init
  if( tpfSystem.hasWebGL() ) {
    ig.main( '#canvas', MyGame, 60, width, height, 1, tpfLoader, tpfSystem ); // override system!
  }
  else {
    ig.$('#game').style.display = 'none';
    ig.$('#no-webgl').style.display = 'block';
  }
}
