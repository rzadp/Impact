import { igEntity } from '../../../lib/impact/entity';
import { igAnimationSheet } from '../../../lib/impact/animation';
import { igTimer } from '../../../lib/impact/timer';
import { tpfEntity } from '../../../plugins/twopointfive/entity';
import { EntityParticle } from './particle';

export class EntityEnemyBlobSpawner extends tpfEntity{
	size= {x: 16, y: 16};
	scale= 0.5;

	dynamicLight= true;
	_wmBoxColor= '#ff0000';

	angle= 0;

	animSheet= new igAnimationSheet( 'blaster/blob-spawn.png', 64, 128 );
	
	constructor( x, y, settings ) {
		super( x, y, settings );
		this.addAnim( 'idle', 1, [0] );
		this.addAnim( 'spawn', 0.05, [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,14,15,16,17,18,19,20,21] );
	}

	update() {
		if( this.currentAnim == this.anims.idle ) {
			if( this.manhattenDistanceTo(ig.game.player) < 512 ) {
				this.currentAnim = this.anims.spawn.rewind();
			}
			else {
				return;
			}
		}

		super.update(_)

		// Spawn anim finished? Spawn the Blob and kill the spawner.
		if( this.currentAnim == this.anims.spawn && this.currentAnim.loopCount ) {
			ig.game.spawnEntity(EntityEnemyBlob, this.pos.x, this.pos.y);
			this.kill();
		}
	}

	manhattenDistanceTo( other ) {
		// This is a tiny bit faster than .distanceTo() and we don't need the precision
		return Math.abs(other.pos.x - this.pos.x) + Math.abs(other.pos.y - this.pos.y);
	}
};


export class EntityEnemyBlob extends tpfEntity{
	type= igEntity.TYPE.B;
	checkAgainst= igEntity.TYPE.A;
	collides= igEntity.COLLIDES.ACTIVE;

	size= {x: 16, y: 16};
	friction= {x: 100, y: 100};
	scale= 0.5;

	health= 10;
	damage= 10;

	dynamicLight= true;
	_wmBoxColor= '#ff0000';

	angle= 0;
	speed= 80;
	injump= false;

	didHurtPlayer= false;
	seenPlayer= false;


	animSheet= new igAnimationSheet( 'blaster/blob.png', 64, 64 );
	
	constructor( x, y, settings ) {
		super( x, y, settings );
		var crawFrameTime = 0.04 + Math.random() * 0.02;

		this.addAnim( 'crawl', 0.04, [0,1,2,3,4,5,4,3,2,1] );
		this.currentAnim.gotoRandomFrame();

		this.hurtTimer = new igTimer(); 
	}


	update() {
		this.angle = this.angleTo( ig.game.player );

		this.vel.x = Math.cos(this.angle) * this.speed;
		this.vel.y = Math.sin(this.angle) * this.speed;
		
		if( ig.game.dead ) {
			// Move away from the player if he's dead
			this.vel.x *= -1;
			this.vel.y *= -1;
		}

		super.update()
	}

	kill() {
		var cx = this.pos.x + this.size.x/2;
		var cy = this.pos.y + this.size.y/2;
		for( var i = 0; i < 20; i++ ) {
			ig.game.spawnEntity( EntityEnemyBlobGib, cx, cy );
		}
		ig.game.blobKillCount++;
		super.kill()
	}

	check( other ) {
		if( this.hurtTimer.delta() < 0 ) {
			// Player already hurt during this attack move?
			return;
		}

		// Only hurt the player once a second
		this.hurtTimer.set(1);

		
		this.vel.x = -this.vel.x;
		this.vel.y = -this.vel.y;
		other.receiveDamage( this.damage, this );
	}
};



export class EntityEnemyBlobGib extends EntityParticle{
	vpos= 0;
	scale= 0.5;
	initialVel= {x:120, y: 120, z: 2.5};
	friction= {x: 10, y: 10};
	
	lifetime= 2;
	
	animSheet= new igAnimationSheet( 'blaster/blob-gib.png', 16, 16 );
	
	constructor( x, y, settings ) {
		this.addAnim( 'idle', 5, [0,1,2,3,4,5,6,7,8,9,10,11] );
		super( x, y, settings );
	}
};
