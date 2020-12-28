import { igFontTpf } from "../../lib/impact/font-tpf";
import { igFont } from "../../lib/impact/font";

const { tpfQuad } = require("./renderer/quad");

export class tpfFont extends igFontTpf{
	_quads= [];
	_glAlpha= 1;

	draw( text, x, y, align, alpha ) {
		this._glAlpha = typeof(alpha) != 'undefined' ? alpha : 1;
		super.draw(text, x, y, align);
	}
	
	_drawChar( c, targetX, targetY ) {
		if( !this.loaded || c < 0 || c >= this.indices.length ) { return 0; }		
		
		var charX = this.indices[c];
		var charY = 0;
		var charWidth = this.widthMap[c];
		var charHeight = (this.height-2);		
		
		var q = this._quads[c];
		q.setAlpha(this._glAlpha);
		q.setPosition(targetX + charWidth/2, targetY + charHeight/2, 0);
		ig.system.renderer.pushQuad(q);
		
		return charWidth + this.letterSpacing;
	}

	
	onload( event ) {
		super.onload(event);

		var charHeight = this.height-2;
		for( var i = 0; i < this.indices.length; i++ ) {
			var index = this.indices[i];
			var charWidth = this.widthMap[i];

			var q = new tpfQuad(charWidth, charHeight, this.texture);
			q.setUV(
				index / this.data.width, 0,
				(index + charWidth) / this.data.width, charHeight / this.data.height
			);

			this._quads.push(q);
		}
	}
};
