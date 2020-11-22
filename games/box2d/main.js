import { igBox2DGame } from '../../plugins/box2d/game';
import { igFont } from '../../lib/impact/font';
import { igSound } from '../../lib/impact/sound';
import { igKEY } from '../../lib/impact/input';
import {LevelTest} from './levels/test'

class MyGame extends igBox2DGame{
	
	gravity= 100; // All entities are affected by this
	
	// Load a font
	font= new igFont( 'fonts/04b03.font.png' );
	clearColor= '#1b2026';
	
	constructor() {
    super();
		// Bind keys
		ig.input.bind( igKEY.LEFT_ARROW, 'left' );
		ig.input.bind( igKEY.RIGHT_ARROW, 'right' );
		ig.input.bind( igKEY.X, 'jump' );
		ig.input.bind( igKEY.C, 'shoot' );
		
		if( ig.ua.mobile ) {
			ig.input.bindTouch( '#buttonLeft', 'left' );
			ig.input.bindTouch( '#buttonRight', 'right' );
			ig.input.bindTouch( '#buttonShoot', 'shoot' );
			ig.input.bindTouch( '#buttonJump', 'jump' );
		}
		
		// Load the LevelTest as required above ('game.level.test')
		this.loadLevel( LevelTest );
	}
	
	loadLevel( data ) {
		super.loadLevel( data );
		for( var i = 0; i < this.backgroundMaps.length; i++ ) {
			this.backgroundMaps[i].preRender = true;
		}
	}
	
	update() {
		// Update all entities and BackgroundMaps
	  super.update();
		
		// screen follows the player
		var player = this.getEntitiesByType( EntityPlayer )[0];
		if( player ) {
			this.screen.x = player.pos.x - ig.system.width/2;
			this.screen.y = player.pos.y - ig.system.height/2;
		}
	}
	
	draw() {
		// Draw all entities and BackgroundMaps
		super.draw();
		
		if( !ig.ua.mobile ) {
			this.font.draw( 'Arrow Keys, X, C', 2, 2 );
		}
  }
  
  getEntityClass(type) {
    if (typeof(type) !== 'string') return type

    switch (type) {
      // case 'EntityBlob':
      //   return EntityBlob;
      default:
       throw new Error(`Unregistered entity class: ${type}`)
    }
  }
};

window.onload = () => {
  if( ig.ua.iPad ) {
    igSound.enabled = false;
    ig.main('#canvas', MyGame, 60, 240, 160, 2);
  }
  else if( ig.ua.mobile ) {	
    igSound.enabled = false;
    ig.main('#canvas', MyGame, 60, 160, 160, 2);
  }
  else {
    ig.main('#canvas', MyGame, 60, 320, 240, 2);
  }
  
}

