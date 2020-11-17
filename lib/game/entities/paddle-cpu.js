import { EntityPaddle } from './paddle';
import { EntityPuck } from './puck';

export class EntityPaddleCpu extends EntityPaddle{
	
	update() {
		
		var puck = ig.game.getEntitiesByType( EntityPuck )[0];
		
		if( puck.pos.y + puck.size.y/2 > this.pos.y + this.size.y/2 ) {
			this.vel.y = 100;
		}
		else {
			this.vel.y = -100;
		}
		
		super.update();
	}
};
