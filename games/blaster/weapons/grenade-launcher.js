import { igEntity } from "../../lib/impact/entity";
import { tpfEntity } from "../../plugins/twopointfive/entity";
import { igAnimationSheet } from "../../lib/impact/animation";
import { igSound } from "../../lib/impact/sound";

const { tpfHudTile } = require("plugins/twopointfive/world/tile");

export class WeaponGrenadeLauncher extends Weapon{
	offset= {x: 0, y: 128};
	// projectileOffset= -8;

	maxAmmo= 80;

	cooldown= 0.5;

	animSheet= new ig.AnimationSheet( 'blaster/grenade-launcher.png', 180, 134);
	shootSound= new ig.Sound( 'blaster/sounds/grenade-launcher.*' );
	emptySound= new ig.Sound( 'blaster/sounds/empty-click.*' );
	ammoIconImage= new ig.Image( 'blaster/grenade.png' );
	ammoIcon= null;

	constructor( ammo ) {
		super( ammo );
		this.addAnim( 'idle', 100, [0] );
		this.addAnim( 'shoot', 0.1, [1,0], true );

		this.ammoIcon = new tpfHudTile( this.ammoIconImage, 0, 32, 32);
		this.ammoIcon.setPosition( 200, 460)
		this.shootSound.volume = 0.8;
	}

	depleted() {
		if( this.shootTimer.delta() > 0 && this.ammo <= 0 ) {
			this.shootTimer.set( this.cooldown );
			this.emptySound.play();
			return true;
		}
		else {
			return false
		}
	}

	shoot( x, y, angle ) {
		ig.game.spawnEntity(EntityGrenade, x, y, {angle: angle} );
		this.currentAnim = this.anims.shoot.rewind();
		this.shootSound.play();

		this.flash(0.2);
	}
};


export class EntityGrenade extends tpfEntity{
	checkAgainst= igEntity.TYPE.B;
	collides= igEntity.COLLIDES.NEVER;

	size= {x: 8, y: 8};
	speed= 440;
	scale= 0.25;

	bounciness= 0.8;
	minBounceVelocity= 0.5;

	blastSettings= {radius: 100, damage: 100};
	explosionParticles= 20;
	explosionRadius= 60;

	animSheet= new igAnimationSheet( 'blaster/grenade.png', 32, 32 );
	explodeSound= new igSound( 'blaster/sounds/explosion.*' );
	bounceSound= new ig.Sound( 'blaster/sounds/grenade-bounce.*' );
	dynamicLight= true;


	constructor( x, y, settings ) {
		super( x-this.size.x/2, y-this.size.y/2, settings ); // center on spawn pos
		this.addAnim( 'idle', 1, [0] );
		this.bounceSound.volume = 0.6;
		this.explodeSound.volume = 0.9;

		this.vel.x = -Math.sin(this.angle) * this.speed;
		this.vel.y = -Math.cos(this.angle) * this.speed;
		this.vel.z = 1.2;
		this.pos.z = 12;
	}
	
	reset( x, y, settings ) {
		super.reset(x,y,settings);
		this.vel.x = -Math.sin(this.angle) * this.speed;
		this.vel.y = -Math.cos(this.angle) * this.speed;
		this.vel.z = 1.2;
		this.pos.z = 12;
		this.currentAnim = this.anims.idle.rewind();
  }

	update() {
		if( this.currentAnim.loopCount > 0 ) {
			this.kill();
			return;
		}

		var zvel = this.vel.z;
		
		super.update()();

		// If the z-velocity did invert in the parent update, we bounced
		// of the ground - play the bounce sound!
		if( zvel < 0 && this.vel.z > 0 ) {
			this.bounceSound.play();
		}
	}

	check( other ) {
		this.kill();
	}

	handleMovementTrace( res ) {
		if( res.collision.x || res.collision.y ) {
			this.bounceSound.play();
		}
		super.handleMovementTrace(res);
	}

	kill() {
		for( var i = 0; i < this.explosionParticles; i++ ) {
			var x = this.pos.x
				+ Math.random() * this.explosionRadius * 2
				- this.explosionRadius;
			var y = this.pos.y
				+ Math.random() * this.explosionRadius * 2
				- this.explosionRadius;
			ig.game.spawnEntity(EntityGrenadeExplosion, x, y );
		}

		ig.game.spawnEntity(EntityBlastRadius, this.pos.x, this.pos.y, this.blastSettings );
		this.explodeSound.play();
		super.kill();
	}
};

ig.EntityPool.enableFor(EntityGrenade);


// This invisible entity will spawn and immediately die a frame later. It will 
// give every other entity it touches a bit of damage.
export class EntityBlastRadius extends igEntity{
	frame= 0;
	radius= 8;
	damage= 20;
	checkAgainst= igEntity.TYPE.B;
	
	constructor( x, y, settings ) {
		var offset = settings.radius || this.radius;
		this.size.x = this.size.y = offset * 2;
		super( x - offset, y - offset, settings );
	}
	
	update() {
		if( this.frame == 2 ) {
			this.kill();
		}
		this.frame++;
	}
	
	draw() {}
	
	check( other ) {
		if( this.frame != 1 ) { return; }

		var f = 1 - (this.distanceTo(other) / this.radius); // normalize to 0..1 range
		if( f > 0 ) {
			var damage = Math.ceil( Math.sqrt(f) * this.damage);
			other.receiveDamage( damage, this );
		}
	}
};


export class EntityGrenadeExplosion extends tpfEntity{
	size= {x: 0, y: 0};
	vpos= 2;
	scale= 1;

	gravityFactor= 0;

	animSheet= new igAnimationSheet( 'blaster/explosion.png', 32, 32 );

	constructor( x, y, settings ) {
		var frameTime = Math.random() * 0.1 + 0.03;
		this.addAnim( 'idle', frameTime, [0,1,2,3], true );
		super( x, y, settings );

		this.pos.z = Math.random() * 20;
	}
	
	reset(x,y,settings) {
		this.currentAnim.rewind();
		super.reset(x,y,settings);
	}

	update() {
		super.update()
		if( this.currentAnim.loopCount ) {
			this.kill();
		}
	}
};

ig.EntityPool.enableFor(EntityGrenadeExplosion);
