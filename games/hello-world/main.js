import { igFont } from '../../lib/impact/font';
import { igGame } from "../../lib/impact/game";

export class HelloWorld extends igGame {
	
	font= new igFont( 'fonts/04b03.font.png' );
	
	
	constructor() {
    super()
	}
	
	update() {
    // Update all entities and backgroundMaps
		super.update();
		
		// Add your own, additional update code here
	}
	
	draw() {
    // Draw all entities and backgroundMaps
    super.draw();
    
    var x = ig.system.width/2,
			y = ig.system.height/2;
    
      console.log('drawing..', x, y, igFont.ALIGN.CENTER)
		this.font.draw( 'It Works!', x, y, igFont.ALIGN.CENTER );
  }
}

window.onload = () => {
  // Start the Game with 60fps, a resolution of 320x240, scaled
  // up by a factor of 2
  ig.main( '#canvas', HelloWorld, 60, 320, 240, 2 );
}
