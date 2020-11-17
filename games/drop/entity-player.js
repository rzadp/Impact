import { igEntity } from '../../lib/impact/entity';
import { igAnimationSheet } from '../../lib/impact/animation';
import { igSound } from '../../lib/impact/sound';

// The Bouncing Player Ball thing
export class EntityPlayer extends igEntity{
	size= {x:4, y:4};
	checkAgainst= igEntity.TYPE.B;
	
	animSheet= new igAnimationSheet( 'drop/player.png', 4, 4 );
	
	maxVel= {x: 50, y: 300};
	friction= {x: 600, y:0};
	speed= 300;
	bounciness= 0.5;
	sound= new igSound('drop/bounce.ogg');
	
	constructor( x, y, settings ) {
    super(x, y, settings);
		this.addAnim( 'idle', 0.1, [0] );		
	}
	
	update() {
		// User Input
		if( ig.input.state('left') ) {
			this.accel.x = -this.speed;
		}
		else if( ig.input.state('right') ) {
			this.accel.x = this.speed;
		}
		else {
			this.accel.x = 0;
		}
		
		super.update()
	}
	
	handleMovementTrace( res ) {
		if( res.collision.y && this.vel.y > 32 ) {
			this.sound.play();
    }
    super.handleMovementTrace(res)
	}
	
	check( other ) {
		other.pickup();
	}
}
