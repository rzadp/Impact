import { igImage } from "../../lib/impact/image";
import { igTimer } from "../../lib/impact/timer";
import { tpfFont } from "../../plugins/twopointfive/font";
import { tpfOrthoCamera } from "../../plugins/twopointfive/renderer/ortho-camera";
import { tpfQuad } from "../../plugins/twopointfive/renderer/quad";
import { tpfHudTile } from "../../plugins/twopointfive/world/tile";
import { igFont } from "../../lib/impact/font";
import { tpfImage } from "../../plugins/twopointfive/image";

export class MyTitle {
	camera= null;
	fadeScreen= null;

	width= 640;
	height= 480;

	font= new tpfFont( 'blaster/fredoka-one.font.png' );

	titleImage= new tpfImage( 'blaster/title.png' );
	title= null;
	background= null;
  timer= null;
  
  _initialized = false
	
	constructor() {

  }
  
  _init() {
    if (!this.titleImage.width || !this.titleImage.height) {
      return // image not loaded yet
    }

		this.title = new tpfHudTile( this.titleImage, 0, this.titleImage.width, this.titleImage.height);
		this.title.setPosition(0, 64);

		// Create an empty quad with a dark blue color as the background
		this.background = new tpfQuad(this.width, this.height);
		this.background.setPosition(this.width/2, this.height/2,0)
		this.background.setColor({r:0.16, g:0.3, b:0.5});


		this.camera = new tpfOrthoCamera(this.width, this.height);
    this.timer = new igTimer();
    this._initialized = true;
  }

	update() {
    if (!this._initialized) {
      this._init();
      return;
    }

		if( ig.input.released('shoot') || ig.input.released('click') ) {
			ig.game.setGame();
		}
	}

	draw() {
    if (!this._initialized) return;

		ig.system.renderer.setCamera(this.camera);
    ig.system.renderer.pushQuad(this.background);
		this.title.draw();

		var message = ig.ua.mobile
			? 'Tap to Start'
			: 'Click to Start';
		var alpha = (Math.sin(this.timer.delta()*4)+1)*0.5;
		this.font.draw(message, this.width/2, 350, igFont.ALIGN.CENTER, alpha);
	}
};
