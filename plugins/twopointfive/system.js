import { igTimer } from '../../lib/impact/timer';

ig.System.inject({
	renderer: null,
	scene: null,
	camera: null,
	
	isFullscreen: false,
	hasMouseLock: false,

	initialWidth: 640,
	initialHeight: 480,
	fov: 75,

	stereoMode: false,
	
	constructor( canvasId, fps, width, height, scale ) {
		this.initialWidth = width;
		this.initialHeight = height;
		
		this.clock = new igTimer();
		this.canvas = ig.$(canvasId);
		this.canvas.width = width * ig.ua.pixelRatio;
		this.canvas.height = height * ig.ua.pixelRatio;
		this.canvas.style.width = width + 'px';
		this.canvas.style.height = height + 'px';
		
		this.realWidth = this.width = width;
		this.realHeight = this.height = height;
		
		this.renderer = new tpf.Renderer(canvas);	
		this.resize( width, height, scale );
	},

	horizontalFov() {
		// The renderer may override the system's fov for stereo rendering
		if( this.renderer.viewportFov ) {
			return this.renderer.viewportFov.toDeg();
		}

		return this.fov * this.camera.aspect;
	},
	
	resize( width, height, scale ) {
		var r = ig.System.useRetina ? ig.ua.pixelRatio : 1;
		
		this.width = width;
		this.height = height;
		
		this.realWidth = this.width = width;
		this.realHeight = this.height = height;
		this.canvas.width = width * r;
		this.canvas.height = height * r;
		
		this.renderer.setSize( width * r, height * r );
		this.canvas.style.width = width + 'px';
		this.canvas.style.height = height + 'px';
		
		this.camera = new tpf.PerspectiveCamera( this.fov, width / height, 1, 10000 );
	},

	setStereoMode( on ) {
		if( on && !tpf.StereoRenderer.hasWebVR() ) {
			alert('No WebVR Support found :/');
			return;
		}

		var fog = this.renderer && this.renderer.fog;

		this.stereoMode = on;
		if( on ) {
			this.renderer = new tpf.StereoRenderer(canvas);
		}
		else {
			this.renderer = new tpf.Renderer(canvas);
		}

		if( fog ) {
			this.renderer.setFog( fog.color, fog.near, fog.far );
		}
	},

	setupFullscreenMouselockOnce() {
		if( this.fullscreenSetupComplete ) { return; }
		
		
		// Fuck yeah, Vendor Prefixes \o/
		
		// Request fullscreen
		this.canvas.requestFullscreen = 
			ig.getVendorAttribute( this.canvas, 'requestFullscreen') ||
			ig.getVendorAttribute( this.canvas, 'requestFullScreen'); // uppercase S (moz)

		var fullscreenCallback = this.fullscreenCallback.bind(this);
		document.addEventListener('fullscreenchange', fullscreenCallback, false);
		document.addEventListener('mozfullscreenchange', fullscreenCallback, false);
		document.addEventListener('webkitfullscreenchange', fullscreenCallback, false);
		
		// Request pointer lock
		ig.normalizeVendorAttribute( this.canvas, 'requestPointerLock' );

		var mouseLockCallback = this.mouseLockCallback.bind(this);
		document.addEventListener('pointerlockchange', mouseLockCallback, false);
		document.addEventListener('mozpointerlockchange', mouseLockCallback, false);
		document.addEventListener('webkitpointerlockchange', mouseLockCallback, false);

		this.fullscreenSetupComplete = true;
	},
	
	requestFullscreen() {
		this.setupFullscreenMouselockOnce();
		this.canvas.requestFullscreen(this.renderer.fullscreenFlags);
	},

	requestMouseLock() {
		this.setupFullscreenMouselockOnce();
		this.canvas.requestPointerLock();
	},
	
	fullscreenCallback( ev ) {
		if(
			document.webkitFullscreenElement === this.canvas ||
			document.mozFullscreenElement === this.canvas ||
			document.mozFullScreenElement === this.canvas
		) {
			this.isFullscreen = true;
			this.resize( screen.width, screen.height, 1 );
			this.canvas.requestPointerLock();
		}
		else {
			this.isFullscreen = false;
			this.resize( this.initialWidth, this.initialHeight, 1 );
		}
		return true;
	},
	
	mouseLockCallback( ev ) {
		this.hasMouseLock = (
			document.pointerLockElement === this.canvas ||
			document.mozPointerLockElement === this.canvas ||
			document.webkitPointerLockElement === this.canvas
		);
	},
	
	clear() {},
});

ig.System.useRetina = true;

ig.System._hasWebGL = null;
ig.System.hasWebGL = function() {
	if( ig.System._hasWebGL === null ) {	
		var canvas = document.createElement('canvas');
		var gl = null;

		try { gl = canvas.getContext("webgl"); }
		catch (x) { gl = null; }

		if (gl === null) {
			try { gl = canvas.getContext("experimental-webgl"); }
			catch (x) { gl = null; }
		}
		ig.System._hasWebGL = (gl !== null);
	}
	return ig.System._hasWebGL;
};
