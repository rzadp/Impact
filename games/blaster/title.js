export class MyTitle {
	camera= null;
	fadeScreen= null;

	width= 640;
	height= 480;

	font= new tpfFont( 'media/fredoka-one.font.png' );

	titleImage= new igImage( 'media/title.png' );
	title= null;
	background= null;
	timer= null;
	
	constructor() {
		// Create the tile for the title image
		this.title = new tpfHudTile( this.titleImage, 0, this.titleImage.width, this.titleImage.height);
		this.title.setPosition(0, 64);

		// Create an empty quad with a dark blue color as the background
		this.background = new tpfQuad(this.width, this.height);
		this.background.setPosition(this.width/2, this.height/2,0)
		this.background.setColor({r:0.16, g:0.3, b:0.5});


		this.camera = new tpfOrthoCamera(this.width, this.height);
		this.timer = new igTimer();
	}

	update() {
		if( ig.input.released('shoot') || ig.input.released('click') ) {
			ig.game.setGame();
		}
	}

	draw() {
		ig.system.renderer.setCamera(this.camera);
		ig.system.renderer.pushQuad(this.background);
		this.title.draw();

		var message = ig.ua.mobile
			? 'Tap to Start'
			: 'Click to Start';
		var alpha = (Math.sin(this.timer.delta()*4)+1)*0.5;
		this.font.draw(message, this.width/2, 350, ig.Font.ALIGN.CENTER, alpha);
	}
};
