import { igInput } from "../lib/impact/input";

export class MouseDeltaInput extends igInput {
  mouseDelta= {x: 0, y: 0};
	
	mousemove( event ) {
		var oldX = this.mouse.x;
		var oldY = this.mouse.y;
		
		super.mousemove( event );
	
		// Needed because mousemove() is also called for click events	
		if( event.type == 'mousemove' ) {
			this.mouseDelta.x += 
				event.movementX ||
				event.mozMovementX ||
				event.webkitMovementX ||
				this.mouse.x - oldX;
				
			this.mouseDelta.y += 
				event.movementY ||
				event.mozMovementY ||
				event.webkitMovementY ||
				this.mouse.y - oldY;
		}
	}
	
	clearPressed() {
		super.clearPressed();
		
		this.mouseDelta.x = 0;
		this.mouseDelta.y = 0;
	}
}
