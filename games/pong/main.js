import { igFont } from '../../lib/impact/font';
import { igGame } from "../../lib/impact/game";
import { igKEY } from '../../lib/impact/input';
import { LevelMain } from './levels/main';
import { EntityPaddleCpu } from './entities/paddle-cpu';
import { EntityPaddlePlayer } from './entities/paddle-player';
import { EntityPuck } from './entities/puck';

export class PongGame extends igGame {
	
	font= new igFont( 'fonts/04b03.font.png' );
	
	
	constructor() {
    super()
		ig.input.bind( igKEY.UP_ARROW, 'up' );
		ig.input.bind( igKEY.DOWN_ARROW, 'down' );
    
    console.log('constructor mygame', this)
		this.loadLevel( LevelMain );
	}
	
	update() {
    // Update all entities and backgroundMaps
		super.update();
		
		// Add your own, additional update code here
	}
	
	draw() {
		// Draw all entities and backgroundMaps
		super.draw();
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
  ig.main( '#canvas', PongGame, 60, 768, 480, 1 );
}
