import { igFont } from '../impact/font';
import { igInput } from '../impact/input';
import { igGame } from "../impact/game";
import { igKEY } from '../impact/input';
import { LevelMain } from './levels/main';

export class MyGame extends igGame {
	
	// Load a font
	font= new igFont( 'media/04b03.font.png' );
	
	
	constructor() {
    super()
		igInput.bind( igKEY.UP_ARROW, 'up' );
		igInput.bind( igKEY.DOWN_ARROW, 'down' );
    
    console.log('constructor mygame', this)
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

window.onload = () => {
  ig.main( '#canvas', MyGame, 60, 768, 480, 1 );
}
