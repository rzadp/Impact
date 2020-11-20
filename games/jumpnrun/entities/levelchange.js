/*
This entity calls ig.game.loadLevel() when its triggeredBy() method is called -
usually through an EntityTrigger entity.


Keys for Weltmeister:

level
	Name of the level to load. E.g. "LevelTest1" or just "test1" will load the 
	'LevelTest1' level.
*/

import { igEntity } from '../../../lib/impact/entity';
import { LevelGrasslands } from '../levels/grasslands';
import { LevelSnowhills } from '../levels/snowhills';
	
export class EntityLevelchange extends igEntity{
	_wmDrawBox= true;
	_wmBoxColor= 'rgba(0, 0, 255, 0.7)';
	
	size= {x: 32, y: 32};
  level= null;
  
  constructor(x, y, settings) {
    super(x, y, settings);
    this.name = settings.name;
    this.level = settings.level;
  }
	
	triggeredBy( entity, trigger ) {
		if( this.level ) {
			var levelName = this.level.replace(/^(Level)?(\w)(\w*)/, function( m, l, a, b ) {
				return a.toUpperCase() + b;
      });
      
      switch (this.level) {
        case 'snowhills':
          ig.game.loadLevelDeferred( LevelSnowhills );
          break;
        case 'grasslands':
          ig.game.loadLevelDeferred( LevelGrasslands);
          break;
        default:
          throw new Error('Unsupported level: ', this.level)
      }
			
			
		}
	}
	
	update(){}
}
