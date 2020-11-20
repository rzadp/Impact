/*
This entity calls the triggeredBy( entity, trigger ) method of each of its
targets. #entity# is the entity that triggered this trigger and #trigger# 
is the trigger entity itself.


Keys for Weltmeister:

checks
	Specifies which type of entity can trigger this trigger. A, B or BOTH 
	Default: A

wait
	Time in seconds before this trigger can be triggered again. Set to -1
	to specify "never" - e.g. the trigger can only be triggered once.
	Default: -1
	
target.1, target.2 ... target.n
	Names of the entities whose triggeredBy() method will be called.
*/

import { igTimer } from '../../../lib/impact/timer';
import { igEntity } from '../../../lib/impact/entity';

export class EntityTrigger extends igEntity{
	size= {x: 32, y: 32};
	
	_wmScalable= true;
	_wmDrawBox= true;
	_wmBoxColor= 'rgba(196, 255, 0, 0.7)';
	
	target= null;
	wait= -1;
	waitTimer= null;
	canFire= true;
	
	type= igEntity.TYPE.NONE;
	checkAgainst= igEntity.TYPE.A;
	collides= igEntity.COLLIDES.NEVER;
	
	
	constructor( x, y, settings ) {
    super( x, y, settings );
    this.size = settings.size || this.size
    this.target = settings.target || null
    this.wait = settings.wait || 0
		if( settings.checks ) {
			this.checkAgainst = igEntity.TYPE[settings.checks.toUpperCase()] || igEntity.TYPE.A;
			delete settings.check;
		}
		
		this.waitTimer = new igTimer();
	}
	
	
	check( other ) {
		if( this.canFire && this.waitTimer.delta() >= 0 ) {
			if( typeof(this.target) == 'object' ) {
				for( var t in this.target ) {
					var ent = ig.game.getEntityByName( this.target[t] );
					if( ent && typeof(ent.triggeredBy) == 'function' ) {
						ent.triggeredBy( other, this );
					}
				}
			}
			
			if( this.wait == -1 ) {
				this.canFire = false;
			}
			else {
				this.waitTimer.set( this.wait );
			}
		}
	}
	
	
	update(){}
}
