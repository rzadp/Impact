
// tpfTile encapsulates a tpfQuad and provides a method to set a tile number directly, 
// instead of specifying raw UV coords, and a function to draw itself.

import { tpfQuad } from "../renderer/quad";

export class tpfTile {
	tile= -1;
	scale= 0;
	image= null;
	quad= null;
	
	constructor( image, tile, tileWidth, tileHeight, scale ) {
		this.scale = scale || 1;
		this.image = image;
		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight || tileWidth;
		
		this.quad = new tpfQuad(
			this.tileWidth * this.scale, 
			this.tileHeight * this.scale,
			this.image.texture
		);

		this.setTile( tile || 0 );
	}

	setTile( t ) {
		if( t == this.tile ) { return; }
		this.tile = t;

		var tileSpacing = this.image.seamsExpanded ? 2 : 0,
			tx = t % Math.floor(this.image.width / this.tileWidth),
			ty = Math.floor(t / Math.floor(this.image.width / this.tileWidth));

		var px = (tx * this.tileWidth + tx * tileSpacing) / this.image.textureWidth,
			py = (ty * this.tileHeight + ty * tileSpacing) / this.image.textureHeight,
			wx = this.tileWidth / this.image.textureWidth,
			wy = this.tileHeight / this.image.textureHeight;

		this.quad.setUV(px, py + wy, px + wx, py);
	}
	
	setTileInBuffer(buffer, offset, t) {
		var tileSpacing = this.image.seamsExpanded ? 2 : 0,
			tx = t % Math.floor(this.image.width / this.tileWidth),
			ty = Math.floor(t / Math.floor(this.image.width / this.tileWidth));

		var px = (tx * this.tileWidth + tx * tileSpacing) / this.image.textureWidth,
			py = (ty * this.tileHeight + ty * tileSpacing) / this.image.textureHeight,
			wx = this.tileWidth / this.image.textureWidth,
			wy = this.tileHeight / this.image.textureHeight;

		tpfQuad.setUVInBuffer(buffer, offset, px, py + wy, px + wx, py);
	}

	draw() {
		ig.system.renderer.pushQuad(this.quad);
	}
};



// The tpf.TileMesh collects a number of tpf.Tiles into a single large
// buffer, so it can be drawn directly without copying each Quad first.
// This is used for TwoPointFive's world maps.

export class tpfTileMesh {
  constructor (tiles) {
    this.animatedTiles = [];
    this.length = tiles.length;

    if( !this.length ) {
      return;
    }
  
    this.buffer = new Float32Array(tpfQuad.SIZE * this.length);
    this.texture = tiles[0].quad.texture;
  
    for( var i = 0; i < this.length; i++ ) {
      var tile = tiles[i];
      tile.quad.copyToBuffer(this.buffer, i * tpfQuad.SIZE );
      if( tile.anim ) {
        this.animatedTiles.push({tile: tile, offset: i});
      }
    }
  }

  updateAnimations () {
    for( var i = 0; i < this.animatedTiles.length; i++ ) {
      var at = this.animatedTiles[i];	
      at.tile.setTileInBuffer( this.buffer, at.offset, at.tile.anim.tile );
    }
  };
};


export class tpfHudTile extends tpfTile{	
	constructor( image, tile, tileWidth, tileHeight ) {
		this.image = image;
		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight || tileWidth;
		
		this.quad = new tpfQuad(this.tileWidth, this.tileHeight, this.image.texture);
		this.setTile( tile || 0 );
	}

	setTile( t ) {
		if( t == this.tile ) { return; }
		this.tile = t;

		var tx = (Math.floor(t * this.tileWidth) % this.image.width) / this.image.width,
			ty = (Math.floor(t * this.tileWidth / this.image.width) * this.tileHeight) / this.image.height,
			wx = this.tileWidth / this.image.width,
			wy = this.tileHeight / this.image.height;
		
		// Flipped-Y
		this.quad.setUV(tx, 1-(ty+wy), tx+wx, 1-ty);
	}
	
	setPosition( x, y ) {
		this.quad.setPosition(x + this.tileWidth/2, y + this.tileHeight/2, 0);
	}

	setAlpha( a ) {
		this.quad.setAlpha(a.limit(0,1));
	}
};
