import { igAnimationSheet } from '../../../lib/impact/animation';
import { igEntity } from '../../../lib/impact/entity';

export class EntityPuck extends igEntity{
	
	size= {x:48, y:48};
	collides= igEntity.COLLIDES.ACTIVE;
	
	animSheet= new igAnimationSheet( 'pong/puck.png', 48, 48 );
	
	bounciness= 1;
	
	constructor( x, y, settings ) {
		super( x, y, settings );
		
		this.addAnim( 'idle', 0.1, [0,1,2,3,4,4,4,4,3,2,1] );
		
		this.vel.x = -200;
		this.vel.y = 100;
	}
};
