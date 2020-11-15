import { igAnimationSheet } from '../../impact/animation';
import { igEntity } from '../../impact/entity';

export class EntityPaddle extends igEntity{
	
	size= {x:64, y:128};
	collides= igEntity.COLLIDES.FIXED;
	
	animSheet= new igAnimationSheet( 'media/paddle-red.png', 64, 128 );
	
	constructor( x, y, settings ) {
		super( x, y, settings );
		
		this.addAnim( 'idle', 1, [0] );
	}
};
