// A Custom Loader for the game, that, after all images have been
// loaded, goes through them and "pixifies" them to create the LCD

import { igImage } from '../../lib/impact/image';
import { igLoader } from '../../lib/impact/loader';
import { FullsizeBackdrop } from './backdrop';

// effect.
export class DropLoader extends igLoader {
	end() {
		for( i in igImage.cache ) {
			var img = igImage.cache[i];
			if( !(img instanceof FullsizeBackdrop) ) {
				this.pixify( img, ig.system.scale );
			}
		}
		super.end()
	}
	
	
	// This essentially deletes the last row and collumn of pixels for each
	// upscaled pixel.
	pixify( img, s ) {
		var ctx = img.data.getContext('2d');
		var px = ctx.getImageData(0, 0, img.data.width, img.data.height);
		
		for( var y = 0; y < img.data.height; y++ ) {
			for( var x = 0; x < img.data.width; x++ ) {
				var index = (y * img.data.width + x) * 4;
				var alpha = (x % s == 0 || y % s == 0) ? 0 : 0.9;
				px.data[index + 3] = px.data[index + 3] * alpha;
			}
		}
		ctx.putImageData( px, 0, 0 );
	}
}
