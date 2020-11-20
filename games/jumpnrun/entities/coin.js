import { igEntity } from '../../../lib/impact/entity';
import { igAnimationSheet } from '../../../lib/impact/animation';
import { igSound } from '../../../lib/impact/sound';
import { EntityPlayer } from './player';
	
export class EntityCoin extends igEntity{
	size= {x: 36, y: 36};
	
	type= igEntity.TYPE.NONE;
	checkAgainst= igEntity.TYPE.A; // Check against friendly
	collides= igEntity.COLLIDES.NEVER;
	
	animSheet= new igAnimationSheet( 'jumpnrun/coin.png', 36, 36 );
	sfxCollect= new igSound( 'jumpnrun/sounds/coin.*' );
	
	
	constructor( x, y, settings ) {
		super( x, y, settings );
		
		this.addAnim( 'idle', 0.1, [0,0,0,0,0,0,0,0,0,1,2] );
	}
	
	
	update() {		
		// Do nothing in this update function; don't even call this.parent().
		// The coin just sits there, isn't affected by gravity and doesn't move.

		// We still have to update the animation, though. This is normally done
		// in the .parent() update:
		this.currentAnim.update();
	}
	
	
	check( other ) {
		// The instanceof should always be true, since the player is
		// the only entity with TYPE.A - and we only check against A.
		if( other instanceof EntityPlayer ) {
			other.giveCoins(1);
			this.sfxCollect.play();
			this.kill();
		}
	}
};
