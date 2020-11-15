import { igAnimationSheet } from '../../impact/animation';
import { igEntity } from '../../impact/entity';

export class EntityPuck extends igEntity{
	
	size= {x:48, y:48};
	collides= igEntity.COLLIDES.ACTIVE;
	
	animSheet= new igAnimationSheet( 'media/puck.png', 48, 48 );
	
	bounciness= 1;
	
	init( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'idle', 0.1, [0,1,2,3,4,4,4,4,3,2,1] );
		
		this.vel.x = -200;
		this.vel.y = 100;
	}
};
