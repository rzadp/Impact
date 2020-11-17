import { igGame } from '../../lib/impact/game'
import { igImage } from '../../lib/impact/image'
import { igFont } from '../../lib/impact/font'
import { igSound } from '../../lib/impact/sound'
import { igKEY } from '../../lib/impact/input'
import { igCollisionMap } from '../../lib/impact/collision-map'
import { igBackgroundMap } from '../../lib/impact/background-map'
import {FullsizeBackdrop} from './backdrop'
import {DropLoader} from './drop-loader'
import {EntityCoin} from './entity-coin'
import {EntityPlayer} from './entity-player'

// The actual Game Source
class DropGame extends igGame{
	clearColor= null; // don't clear the screen
	gravity= 240;
	player= null;
		
	map= [];
	score= 0;
	speed= 1;
	
	tiles= new igImage( 'drop/tiles.png' );
	backdrop= new FullsizeBackdrop( 'drop/backdrop.png' );
	font= new igFont( 'fonts/04b03.font.png' );
	gameOverSound= new igSound( 'drop/gameover.ogg' );
	
	constructor() {
    super();
		// uncomment this next line for more authentic (choppy) scrolling
		//ig.system.smoothPositioning = false; 
		
		ig.input.bind(igKEY.LEFT_ARROW, 'left');
		ig.input.bind(igKEY.RIGHT_ARROW, 'right');
		ig.input.bind(igKEY.ENTER, 'ok');
		
		// The first part of the map is always the same
		this.map = [
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,1,1,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
		];
		
		// Now randomly generate the remaining rows
		for( var y = 8; y < 18; y++ ) {	
			this.map[y] = this.getRow();
		}
		
		// The map is used as CollisionMap AND BackgroundMap
		this.collisionMap = new igCollisionMap( 8, this.map );
		this.backgroundMaps.push( new igBackgroundMap(8, this.map, 'drop/tiles.png' ) );
		
		this.player = this.spawnEntity( EntityPlayer, ig.system.width/2-2, 16 );
	}
	
	
	getRow() {
		// Randomly generate a row of block for the map. This is a naive approach,
		// that sometimes leaves the player hanging with no block to jump to. It's
		// random after all.
		var row = [];
		for( var x = 0; x < 8; x++ ) {
			row[x] = Math.random() > 0.93 ? 1 : 0;
		}
		return row;
	}
	
	
	placeCoin() {
		// Randomly find a free spot for the coin, max 12 tries
		for( var i = 0; i < 12; i++ ) {
			var tile = (Math.random() * 8).ceil();
			if(
				this.map[this.map.length-1][tile] &&
				!this.map[this.map.length-2][tile]
			) {
				var y = (this.map.length-1) * 8;
				var x = tile * 8 + 1;
				this.spawnEntity( EntityCoin, x, y );
				return;
			}
		}
	}
	
	
	update() {
		if( ig.input.pressed('ok') ) {
			ig.system.setGame( DropGame );
		}
			
		if( this.gameOver ) {
			return;
		}
		
		this.speed += ig.system.tick * (10/this.speed);
		this.screen.y += ig.system.tick * this.speed;
		this.score += ig.system.tick * this.speed;
		
		// Do we need a new row?
		if( this.screen.y > 40 ) {
			
			// Move screen and entities one tile up
			this.screen.y -= 8;
			for( var i =0; i < this.entities.length; i++ ) {
				this.entities[i].pos.y -= 8;
			}
			
			// Delete first row, insert new
			this.map.shift();
			this.map.push(this.getRow());
			
			// Place coin?
			if( Math.random() > 0.5 ) {
				this.placeCoin();
			}
		}
		super.update();
		
		// check for gameover
		var pp = this.player.pos.y - this.screen.y;
		if( pp > ig.system.height + 8 || pp < -32 ) {
			this.gameOver = true;
			this.gameOverSound.play();
			
		}
	}
	
	
	draw() {
		this.backdrop.draw();
		
		if( this.gameOver ) {
			this.font.draw( 'Game Over!', ig.system.width/2, 32, igFont.ALIGN.CENTER );
			this.font.draw( 'Press Enter', ig.system.width/2, 48, igFont.ALIGN.CENTER );
			this.font.draw( 'to Restart', ig.system.width/2, 56, igFont.ALIGN.CENTER );
		}
		else {
			super.draw()
		}
		
		this.font.draw( this.score.floor().toString(), ig.system.width -2, 2, igFont.ALIGN.RIGHT );
	}
}


window.onload = () => {
  ig.main('#canvas', DropGame, 30, 64, 96, 5, DropLoader );
}
