import { tpfHudTile } from "plugins/twopointfive/world/tile";

export class MyHud extends tpfHud{

	font= new tpfFont( 'media/fredoka-one.font.png' );

	healthIconImage= new igImage( 'media/health-icon.png' );
	damageIndicatorImage= new igImage( 'media/hud-blood-low.png' );
	healthIcon= null;

	keys= [];

	showControlsTimer= null;

	constructor( width, height, showControls ) {
		super(width, height);

		this.healthIcon = new tpfHudTile( this.healthIconImage, 0, 32, 32 );
		this.healthIcon.setPosition( 96, this.height-this.healthIcon.tileHeight-4 );
	}

	draw( player, weapon ) {
		this.prepare();

		if( weapon ) {
			weapon.draw();

			if( weapon.ammoIcon ) {
				weapon.ammoIcon.draw();
				this.font.draw( weapon.ammo, 210, this.height - this.font.height + 1, ig.Font.ALIGN.RIGHT );
			}
		}

		this.healthIcon.draw();
		this.font.draw( player.health, 90, this.height - this.font.height + 1, ig.Font.ALIGN.RIGHT );

		this.font.draw( 'Kills: ' +ig.game.blobKillCount, 32, 8 );

		// Draw the current message (showMessage(text)) and the damage indicator
		this.drawDefault();
	}
};
