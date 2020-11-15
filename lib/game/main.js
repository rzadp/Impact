import { igFont } from '../impact/font';
import { igInput } from '../impact/input';
import { igGame } from "../impact/game";
import { igKEY } from '../impact/input';
import { LevelMain } from './levels/main';
import { EntityPaddleCpu } from './entities/paddle-cpu';
import { EntityPaddlePlayer } from './entities/paddle-player';
import { EntityPuck } from './entities/puck';

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
  
  getEntityClass(type) {
    if (typeof(type) !== 'string') return type

    switch (type) {
      case 'EntityPaddleCpu':
        return EntityPaddleCpu;
      case 'EntityPaddlePlayer':
        return EntityPaddlePlayer
      case 'EntityPuck':
        return EntityPuck
      default:
       throw new Error(`Unregistered entity class: ${type}`)
    }
  }
}

window.onload = () => {
  ig.main( '#canvas', MyGame, 60, 768, 480, 1 );
}
