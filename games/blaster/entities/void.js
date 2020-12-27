/*
This entity does nothing but just sits there. It can be used as a target
for other entities, such as movers.
*/

import { igEntity } from "../../lib/impact/entity"

export class EntityVoid extends igEntity{
	_wmDrawBox= true;
	_wmBoxColor= 'rgba(128, 28, 230, 0.7)';
	
	size= {x: 32, y: 32};
	
	update(){}
};
