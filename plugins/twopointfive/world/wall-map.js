import { tpfMap } from "./map";

const { tpfTile } = require("./tile");

export class tpfWallMap extends tpfMap{
	createTileAtPosition( tile, x, y, anim ) {
		
		// We need 4 tiles, one for each side of the block		
		var tiles = {};
		for( var name in tpfWallMap.offsets ) {
			var off = tpfWallMap.offsets[name];
			
			var t = new tpfTile( this.tiles, tile, this.tilesize );
			
			t.quad.setPosition(
				(x + off.x/2 + 0.5) * this.tilesize,
				0,
				(y + off.y/2 + 0.5) * this.tilesize
			);
			t.quad.setRotation(0, off.rot, 0);
			t.anim = anim;

			tiles[name] = t;
		}
		
		return tiles;
	}
	
	applyLightMap( lightMap ) {
		for( var y in this.tileData ) {
			for( var x in this.tileData[y] ) {
				
				var tiles = this.tileData[y][x],
					rx = x|0,
					ry = y|0;
				
				for( var name in tiles ) {
					var off = tpfWallMap.offsets[name];
					tiles[name].quad.setColor( lightMap.getLight(rx+off.x, ry+off.y) );
				}
			}
		}
	}
	
	getTilesInRect( xs, ys, w, h ) {
		var tiles = [];

		for( var y = ys; y < ys + h; y++ ) {			
			for( var x = xs; x < xs + w; x++ ) {

				// Take care to get the walls _facing_ to this tile, instead of just
				// the walls _on_ this tile
				for( var name in tpfWallMap.offsets ) {
					var off = tpfWallMap.offsets[name];
					var tx = x - off.x, 
						ty = y - off.y;

					if( this.hasTile(tx, ty) && this.tileData[ty][tx][name] ) {
						tiles.push(this.tileData[ty][tx][name]);
					}
				}

			}
		}
		return tiles;
	}
	

	// Typically, all walls that are visible are connected to floor tiles,
	// so we can safely remove those that are not.
	
	eraseDisconnectedWalls( floorMap ) {
		for( var y in this.tileData ) {
			for( var x in this.tileData[y] ) {
				
				var tiles = this.tileData[y][x],
					rx = x|0,
					ry = y|0;
				
				for( var name in tpfWallMap.offsets ) {
					var off = tpfWallMap.offsets[name];
					if( !floorMap.hasTile(rx + off.x, ry + off.y) ) {
						delete tiles[name];
					}
				}
				
			}
		}
  }
  
  static offsets = {
    top: 	{x: 0, y:-1, rot: (180).toRad() },
    bottom:	{x: 0, y: 1, rot: (0).toRad() },
    right: 	{x: 1, y: 0, rot: (90).toRad() },
    left: 	{x:-1, y: 0, rot: (-90).toRad() }
  }
};
