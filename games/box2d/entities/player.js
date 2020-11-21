import { igEntity } from '../../../lib/impact/entity';
import { igAnimationSheet } from '../../../lib/impact/animation';

export class EntityPlayer extends Box2DEntity{
	size= {x: 8, y:14};
	offset= {x: 4, y: 2};
	
	type= igEntity.TYPE.A;
	checkAgainst= igEntity.TYPE.NONE;
	collides= igEntity.COLLIDES.NEVER; // Collision is already handled by Box2D!
	
	animSheet= new igAnimationSheet( 'media/player.png', 16, 24 );
	
	flip= false;
	
	constructor( x, y, settings ) {
		super( x, y, settings );
		
		// Add the animations
		this.addAnim( 'idle', 1, [0] );
		this.addAnim( 'jump', 0.07, [1,2] );

		if(!ig.global.wm) {
			this.body.SetFixedRotation(true);
		}
	}
	
	
	update() {
		// move left or right
		if( ig.input.state('left') ) {
			this.body.ApplyForce( new Box2D.Common.Math.b2Vec2(-20,0), this.body.GetPosition() );
			this.flip = true;
		}
		else if( ig.input.state('right') ) {
			this.body.ApplyForce( new Box2D.Common.Math.b2Vec2(20,0), this.body.GetPosition() );
			this.flip = false;
		}
		
		// jetpack
		if( ig.input.state('jump') ) {
			this.body.ApplyForce( new Box2D.Common.Math.b2Vec2(0,-30), this.body.GetPosition() );
			this.currentAnim = this.anims.jump;
		}
		else {
			this.currentAnim = this.anims.idle;
		}
		
		// shoot
		if( ig.input.pressed('shoot') ) {
			var x = this.pos.x + (this.flip ? -6 : 6 );
			var y = this.pos.y + 6;
			ig.game.spawnEntity( EntityProjectile, x, y, {flip:this.flip} );
		}
		
		this.currentAnim.flip.x = this.flip;
		
		// move!
		super.update();
	}
};


export class EntityProjectile extends igBox2DEntity{
	size= {x: 8, y: 4};
	
	type= igEntity.TYPE.NONE;
	checkAgainst= igEntity.TYPE.B;
	collides= igEntity.COLLIDES.NEVER; // Collision is already handled by Box2D!
		
	animSheet= new igAnimationSheet( 'media/projectile.png', 8, 4 );
	
	constructor( x, y, settings ) {
		super( x, y, settings );
		
		this.addAnim( 'idle', 1, [0] );
		this.currentAnim.flip.x = settings.flip;
		
		var velocity = (settings.flip ? -10 : 10);
		this.body.ApplyImpulse( new Box2D.Common.Math.b2Vec2(velocity,0), this.body.GetPosition() );
	}	
};
