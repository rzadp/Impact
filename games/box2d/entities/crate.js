import { igEntity } from '../../../lib/impact/entity';
import { igAnimationSheet } from '../../../lib/impact/animation';

export class EntityCrate extends igBox2DEntity{
	size= {x: 8, y: 8};
	
	type= igEntity.TYPE.B;
	checkAgainst= igEntity.TYPE.NONE;
	collides= igEntity.COLLIDES.NEVER;
	
	animSheet= new igAnimationSheet( 'box2d/crate.png', 8, 8 );
	
	constructor( x, y, settings ) {
		super( x, y, settings );
		this.addAnim( 'idle', 1, [0] );
	}
};
