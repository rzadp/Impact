
EntityParticle = tpf.Entity.extend({
	size: {x: 1, y: 1},
	offset: {x: 0, y: 0},
	minBounceVelocity: 0,
	
	lifetime: 5,
	fadetime: 1,
	bounciness: 0.6,
	friction: {x:20, y: 0},

	initialVel: {x:1, y: 1, z: 1},
	
	constructor( x, y, settings ) {
		this.parent( x, y, settings );
		this.currentAnim.gotoRandomFrame();
		this.setPosition();
	},
	
	reset( x, y, settings ) {
		this.parent(x, y, settings);
		this.setPosition();
	},
	
	setPosition() {
		this.vel.x = (Math.random() * 2 - 1) * this.initialVel.x;
		this.vel.y = (Math.random() * 2 - 1) * this.initialVel.y;
		this.vel.z = (Math.random() * 2 - 1) * this.initialVel.z;
		
		this.idleTimer = new ig.Timer();
	},
	
	update() {
		var delta = this.idleTimer.delta();
		if( delta > this.lifetime ) {
			this.kill();
			return;
		}
		
		this.tile.quad.setAlpha(
			delta.map(this.lifetime - this.fadetime, this.lifetime,1, 0).limit(0,1)
		);
		
		this.parent();
	}
});

ig.EntityPool.enableFor(EntityParticle);
