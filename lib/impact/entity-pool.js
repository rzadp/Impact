export class igEntityPool {
	pools= {};
		
	mixin= { 
		staticInstantiate: function( x, y, settings ) {
			return igEntityPool.getFromPool( this.classId, x, y, settings );
		},
		
		erase: function() {
			igEntityPool.putInPool( this );
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

console.log('injecting..???')
// ig.Game.inject({
// 	loadLevel: function( data ) {
//     igEntityPool.drainAllPools();
//     // parent ???
// 		this.parent(data);
// 	}
// })
