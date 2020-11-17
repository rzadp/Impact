import { igEntity } from '../../lib/impact/entity';
import { igAnimationSheet } from '../../lib/impact/animation';
import { igSound } from '../../lib/impact/sound';

// The Collectable Coin Entity
export class EntityCoin extends igEntity{
	size= {x:6, y:6};
	offset= {x:-1, y:-1};
	animSheet= new igAnimationSheet( 'drop/coin.png', 4, 4 );
	type= igEntity.TYPE.B;
	
	sound= new igSound('drop/coin.ogg');
	
	constructor( x, y, settings ) {
    super(x, y, settings);
		this.addAnim( 'idle', 0.1, [0,1] );		
	}
	
	update() {
		super.update();
		if( this.pos.y - ig.game.screen.y < -32 ) {
			this.kill();
		}
	}
	
	pickup() {
		ig.game.score += 500;
		this.sound.play();
		this.kill();
	}
}
