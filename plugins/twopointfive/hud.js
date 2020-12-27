import { igTimer } from '../../lib/impact/timer';
import { tpfOrthoCamera } from './renderer/ortho-camera';
import { tpfQuad } from './renderer/quad';
import { tpfHudTile } from './world/tile';

export class tpfHud {
	width= 320;
	height= 240;

	font= null;

	damageIndicatorImage= null;
	damageIndicator= null;
	damageTimer= null;

	fadeScreen= null;

	message= null;
	messageTimer= null;

	fadeToWhite= 0;

	debug= true;

	constructor( width, height ) {
		this.width = width;
		this.height = height;

		this.font.letterSpacing = -2;

		this.camera = new tpfOrthoCamera( width, height );

		this.fadeScreen = new tpfQuad(width, height);
		this.fadeScreen.setPosition(width/2,height/2,0)
		this.fadeScreen.setColor({r:255, g:255, b:255});

		if( this.damageIndicatorImage ) {
			this.damageIndicator = new tpfHudTile( this.damageIndicatorImage, 0, 160, 120);
			this.damageIndicator.setPosition( 0, 0 );
		}
	}

	showMessage( text, time ) {
		if( text ) {
			if( time !== -1 ) {
				this.messageTimer = new igTimer( tpfHud.TIME.DEFAULT || time );
			}
			this.message = text;
		}
		else {
			this.messageTimer = null;
			this.message = null;
		}
	}

	showDamageIndicator( x, y, initialAlpha ) {
		if( this.damageIndicator ) {
			this.damageIndicator.setPosition( x, y );
			this.damageTimer = new igTimer( initialAlpha );
		}
	}

	prepare() {
		ig.system.renderer.setCamera(this.camera);
	}

	drawDefault() {
		if( this.messageTimer && this.messageTimer.delta() > 0 ) {
			this.showMessage( null );
		}

		if( this.message && this.font ) {
			this.font.draw(this.message, this.width/2, this.height/3, ig.Font.ALIGN.CENTER);
		}

		if( this.damageTimer ) {
			var delta = this.damageTimer.delta();
			if( delta < 0 ) {
				this.damageIndicator.setAlpha( -delta );
				this.damageIndicator.draw();
			}
			else {
				this.damageTimer = null;
			}
		}
		
		if( this.fadeToWhite > 0 ) {
			this.fadeScreen.setAlpha( this.fadeToWhite );
			ig.system.renderer.pushQuad(this.fadeScreen);
		}
	}

	draw() {
		this.prepare();
		this.drawDefault();
  }
  
  static TIME = {
    DEFAULT: 2,
    PERMANENT: -1
  };
};
