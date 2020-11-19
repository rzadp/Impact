

export class igCamera{
	
	trap= {
		pos: { x: 0, y: 0},
		size: { x: 16, y: 16 }
	};
	max= { x: 0, y: 0 };
	offset= {x: 0, y:0};
	pos= {x: 0, y: 0};
	damping= 5;
	lookAhead= { x: 0, y: 0};
	currentLookAhead= { x: 0, y: 0};
	
	debug= false;
	
	
	constructor( offsetX, offsetY, damping ) {
		this.offset.x = offsetX;
		this.offset.y = offsetY;
		this.damping = damping;
	}
	
	
    set( entity ) {
		this.trap.pos.x = entity.pos.x - this.trap.size.x / 2;
		this.trap.pos.y = entity.pos.y + entity.size.y - this.trap.size.y;

        this.pos.x = this.trap.pos.x - this.offset.x;
        this.pos.y = this.trap.pos.y - this.offset.y;
		this.currentLookAhead.x = 0;
		this.currentLookAhead.y = 0;
    }
	
	
	follow( entity ) {
		this.pos.x = this.move( 'x', entity.pos.x, entity.size.x );
		this.pos.y = this.move( 'y', entity.pos.y, entity.size.y );
		
		ig.game.screen.x = this.pos.x;
		ig.game.screen.y = this.pos.y;
	}
	
	
	move( axis, pos, size ) {
		var lookAhead = 0;
		if( pos < this.trap.pos[axis] ) {
			this.trap.pos[axis] = pos;
			this.currentLookAhead[axis] = this.lookAhead[axis];
		}
		else if( pos + size > this.trap.pos[axis] + this.trap.size[axis] ) {
			this.trap.pos[axis] = pos + size - this.trap.size[axis];
			this.currentLookAhead[axis] = -this.lookAhead[axis];
		}
		
		return (
			this.pos[axis] - (
				this.pos[axis] - this.trap.pos[axis] + this.offset[axis]
				+ this.currentLookAhead[axis]
			) * ig.system.tick * this.damping
		).limit( 0, this.max[axis] );
	}
	
	
	draw() {
		if( this.debug ) {
			ig.system.context.fillStyle = 'rgba(255,0,255,0.3)';
			ig.system.context.fillRect(
				(this.trap.pos.x - this.pos.x) * ig.system.scale,
				(this.trap.pos.y - this.pos.y) * ig.system.scale,
				this.trap.size.x * ig.system.scale,
				this.trap.size.y * ig.system.scale
			);
		}
	}
};
