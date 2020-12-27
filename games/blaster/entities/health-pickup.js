import { tpfEntity } from '../../plugins/twopointfive/entity';
import { igTimer } from '../../lib/impact/timer';
import { igEntity } from '../../lib/impact/entity';
import { igAnimationSheet } from '../../lib/impact/animation';
import { igSound } from '../../lib/impact/sound';

export class EntityHealthPickup extends tpfEntity{
	checkAgainst= igEntity.TYPE.A;
	
	size= {x: 16, y: 16};
	vpos= 0.5;
	scale= 0.5;
	amount= 25;
	gravityFactor= 0;

	dynamicLight= true;
	_wmBoxColor= '#55ff00';
	
	animSheet= new igAnimationSheet( 'media/health.png', 32, 32 );
	pickupSound= new igSound( 'media/sounds/health-pickup.*' );
	bounceTimer= null;
	
	constructor( x, y, settings ) {
		super( x, y, settings );
		this.addAnim( 'idle', 10, [0] );
		this.bounceTimer = new igTimer();
	}

	update() {
		// Give the item an Arcade-like bounce animation
		this.pos.z = (Math.cos(this.bounceTimer.delta()*3)+1) * 3;
		super.update(_)
	}
	
	check( other ) {
		if( other.giveHealth(this.amount) ) {
			this.pickupSound.play();
			this.kill();
		}
	}
};
