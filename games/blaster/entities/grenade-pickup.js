
EntityGrenadePickup = tpf.Entity.extend({
	checkAgainst: ig.Entity.TYPE.A,
	
	size: {x: 16, y: 16},
	vpos: 0.5,
	scale: 0.5,
	amount: 8,

	dynamicLight: true,
	_wmBoxColor: '#55ff00',
	
	animSheet: new ig.AnimationSheet( 'media/grenade-pickup.png', 32, 32 ),
	pickupSound: new ig.Sound( 'media/sounds/health-pickup.*' ),
	bounceTimer: null,
	
	constructor( x, y, settings ) {
		this.parent( x, y, settings );
		this.addAnim( 'idle', 10, [0] );
	},

	update() {
		this.parent();
	},
	
	check( other ) {
		other.giveAmmo(WeaponGrenadeLauncher, this.amount);
		this.pickupSound.play();
		this.kill();
	}
});
