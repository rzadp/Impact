import { igImage } from '../../lib/impact/image';

// The Backdrop image for the game, subclassed from ig.Image
// because it needs to be drawn in it's natural, unscaled size, 
export class FullsizeBackdrop extends igImage{
	resize(){}
	draw() {
		if( !this.loaded ) { return; }
		ig.system.context.drawImage( this.data, 0, 0 );
	}
}
