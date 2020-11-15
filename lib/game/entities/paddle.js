import { igAnimationSheet } from '../../impact/animation';
import { igEntity } from '../../impact/entity';

export class EntityPaddle extends igEntity{
	
	size= {x:64, y:128};
	collides= igEntity.COLLIDES.FIXED;
	
	animSheet= new igAnimationSheet( 'media/paddle-red.png', 64, 128 );
	
	init( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'idle', 1, [0] );
	}
};
