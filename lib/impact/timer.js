window.globalTime = window.globalTime || {
  _last: 0,
  time: Number.MIN_VALUE,
  timeScale: 1,
  maxStep: 0.05
}

export class igTimer {
	target= 0;
	base= 0;
	last= 0;
  pausedAt= 0;

  static step () {
    var current = Date.now();
    var delta = (current - window.globalTime._last) / 1000;
    window.globalTime.time += Math.min(delta, window.globalTime.maxStep) * window.globalTime.timeScale;
    window.globalTime._last = current;
  };
	
	constructor( seconds ) {
		this.base = window.globalTime.time;
		this.last = window.globalTime.time;
		
		this.target = seconds || 0;
	}
	
	
	set( seconds ) {
		this.target = seconds || 0;
		this.base = window.globalTime.time;
		this.pausedAt = 0;
	}
	
	
	reset() {
		this.base = window.globalTime.time;
		this.pausedAt = 0;
	}
	
	
	tick() {
		var delta = window.globalTime.time - this.last;
		this.last = window.globalTime.time;
		return (this.pausedAt ? 0 : delta);
	}
	
	
	delta() {
		return (this.pausedAt || window.globalTime.time) - this.base - this.target;
	}


	pause() {
		if( !this.pausedAt ) {
			this.pausedAt = window.globalTime.time;
		}
	}


	unpause() {
		if( this.pausedAt ) {
			this.base += window.globalTime.time - this.pausedAt;
			this.pausedAt = 0;
		}
	}
}
