import { igAnimationSheet } from "../../../lib/impact/animation";
import { igSound } from "../../../lib/impact/sound";
import { igEntity } from "../../../lib/impact/entity";
import { tpfEntity } from "../../../plugins/twopointfive/entity";
import { WeaponGrenadeLauncher } from "../weapons/grenade-launcher";

export class EntityGrenadePickup extends tpfEntity{
	checkAgainst= igEntity.TYPE.A;
	
	size= {x: 16, y: 16};
	vpos= 0.5;
	scale= 0.5;
	amount= 8;

	dynamicLight= true;
	_wmBoxColor= '#55ff00';
	
	animSheet= new igAnimationSheet( 'blaster/grenade-pickup.png', 32, 32 );
	pickupSound= new igSound( 'blaster/sounds/health-pickup.*' );
	bounceTimer= null;
	
	constructor( x, y, settings ) {
		super( x, y, settings );
		this.addAnim( 'idle', 10, [0] );
	}

	update() {
		super.update()
	}
	
	check( other ) {
		other.giveAmmo(WeaponGrenadeLauncher, this.amount);
		this.pickupSound.play();
		this.kill();
	}
};
