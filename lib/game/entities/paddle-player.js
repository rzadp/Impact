import { igAnimationSheet } from '../../impact/animation';
import { EntityPaddle } from './paddle';

export class EntityPaddlePlayer extends EntityPaddle{
	
	animSheet= new igAnimationSheet( 'media/paddle-blue.png', 64, 128 );
	
	update() {
		
		if( ig.input.state('up') ) {
			this.vel.y = -100;
		}
		else if( ig.input.state('down') ) {
			this.vel.y = 100;
		}
		else {
			this.vel.y = 0
		}
		
		this.parent();
	}
};
