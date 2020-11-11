import { igFont } from '../impact/font';
import { igInput } from '../impact/input';
import { igGame } from "../impact/game";
import { igKEY } from '../impact/input';

export class MyGame extends igGame {
	
	// Load a font
	font= new igFont( 'media/04b03.font.png' );
	
	
	init() {
		igInput.bind( igKEY.UP_ARROW, 'up' );
		igInput.bind( igKEY.DOWN_ARROW, 'down' );
		
		this.loadLevel( LevelMain );
	}
	
	update() {
		// Update all entities and backgroundMaps
		this.parent();
		
		// Add your own, additional update code here
	}
	
	draw() {
		// Draw all entities and backgroundMaps
		this.parent();
	}
}


ig.main( '#canvas', MyGame, 60, 768, 480, 1 );
