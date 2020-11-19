import { igEntity } from '../../lib/impact/entity';
import { igAnimationSheet } from '../../lib/impact/animation';
import { igSound } from '../../lib/impact/sound';
	
export class EntityBlob extends igEntity{
	size= {x: 40, y: 28};
	offset= {x: 24, y: 0};
	maxVel= {x: 100, y: 100};
	friction= {x: 150, y: 0};
	
	type= igEntity.TYPE.B; // Evil enemy group
	checkAgainst= igEntity.TYPE.A; // Check against friendly
	collides= igEntity.COLLIDES.PASSIVE;
	
	health= 1;
	
	
	speed= 36;
	flip= false;
	
	animSheet= new igAnimationSheet( 'jumpnrun/blob.png', 64, 28 );
	sfxDie= new igSound( 'jumpnrun/sounds/blob-die.*' );
	
	
	constructor( x, y, settings ) {
		super( x, y, settings );
		
		this.addAnim( 'crawl', 0.2, [0,1] );
		this.addAnim( 'dead', 1, [2] );
	}
	
	
	update() {
		// Near an edge? return!
		if( !ig.game.collisionMap.getTile(
				this.pos.x + (this.flip ? +4 : this.size.x -4),
				this.pos.y + this.size.y+1
			)
		) {
			this.flip = !this.flip;
			
			// We have to move the offset.x around a bit when going
			// in reverse direction, otherwise the blob's hitbox will
			// be at the tail end.
			this.offset.x = this.flip ? 0 : 24;
		}
		
		var xdir = this.flip ? -1 : 1;
		this.vel.x = this.speed * xdir;
		this.currentAnim.flip.x = !this.flip;
		
		super.update();
	}
	
	kill() {
		this.sfxDie.play();
		super.kill();
		
	}
	
	handleMovementTrace( res ) {
		super.handleMovementTrace( res );
		
		// Collision with a wall? return!
		if( res.collision.x ) {
			this.flip = !this.flip;
			this.offset.x = this.flip ? 0 : 24;
		}
	}
	
	check( other ) {
		other.receiveDamage( 1, this );
	}
};
