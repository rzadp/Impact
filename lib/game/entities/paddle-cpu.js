import { EntityPaddle } from './paddle';

export class EntityPaddleCpu extends EntityPaddle{
	
	update() {
		
		var puck = ig.game.getEntitiesByType( EntityPuck )[0];
		
		if( puck.pos.y + puck.size.y/2 > this.pos.y + this.size.y/2 ) {
			this.vel.y = 100;
		}
		else {
			this.vel.y = -100;
		}
		
		this.parent();
	}
};
