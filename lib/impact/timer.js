export class igTimer {
	target= 0;
	base= 0;
	last= 0;
  pausedAt= 0;
  
  static _last = 0;
  static time = Number.MIN_VALUE;
  static timeScale = 1;
  static maxStep = 0.05;

  static step () {
    var current = Date.now();
    var delta = (current - ig.Timer._last) / 1000;
    ig.Timer.time += Math.min(delta, ig.Timer.maxStep) * ig.Timer.timeScale;
    ig.Timer._last = current;
  };
	
	init( seconds ) {
		this.base = ig.Timer.time;
		this.last = ig.Timer.time;
		
		this.target = seconds || 0;
	}
	
	
	set( seconds ) {
		this.target = seconds || 0;
		this.base = ig.Timer.time;
		this.pausedAt = 0;
	}
	
	
	reset() {
		this.base = ig.Timer.time;
		this.pausedAt = 0;
	}
	
	
	tick() {
		var delta = ig.Timer.time - this.last;
		this.last = ig.Timer.time;
		return (this.pausedAt ? 0 : delta);
	}
	
	
	delta() {
		return (this.pausedAt || ig.Timer.time) - this.base - this.target;
	}


	pause() {
		if( !this.pausedAt ) {
			this.pausedAt = ig.Timer.time;
		}
	}


	unpause() {
		if( this.pausedAt ) {
			this.base += ig.Timer.time - this.pausedAt;
			this.pausedAt = 0;
		}
	}
}
