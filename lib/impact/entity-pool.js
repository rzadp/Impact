export class igEntityPool {
	pools= {};
		
	mixin= { 
		staticInstantiate: function( x, y, settings ) {
			return ig.EntityPool.getFromPool( this.classId, x, y, settings );
		},
		
		erase: function() {
			ig.EntityPool.putInPool( this );
		}
	}
	
	enableFor( Class ) {
		Class.inject(this.mixin);
	}
	
	getFromPool( classId, x, y, settings ) {
		var pool = this.pools[classId];
		if( !pool || !pool.length ) { return null; }
		
		var instance = pool.pop();
		instance.reset(x, y, settings);
		return instance;
	}
	
	putInPool( instance ) {
		if( !this.pools[instance.classId] ) {
			this.pools[instance.classId] = [instance];
		}
		else {
			this.pools[instance.classId].push(instance);
		}
	}
	
	drainPool( classId ) {
		delete this.pools[classId];
	}
	
	drainAllPools() {
		this.pools = {};
	}
}

ig.Game.inject({
	loadLevel: function( data ) {
		ig.EntityPool.drainAllPools();
		this.parent(data);
	}
})
