import { igEntity } from "../../lib/impact/entity";

export class igBox2DEntity extends igEntity{
	body= null;
	angle= 0;
	
	constructor( x, y , settings ) {
		super( x, y, settings );
		
		// Only create a box2d body when we are not in Weltmeister
		if( !ig.global.wm ) { 
			this.createBody();
		}
	}
	
	createBody() {
		var bodyDef = new Box2D.Dynamics.b2BodyDef();
		bodyDef.position = new Box2D.Common.Math.b2Vec2(
			(this.pos.x + this.size.x / 2) * Box2D.SCALE,
			(this.pos.y + this.size.y / 2) * Box2D.SCALE
		); 
		bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
		this.body = ig.world.CreateBody(bodyDef);

		var fixture = new Box2D.Dynamics.b2FixtureDef;
		fixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();
		fixture.shape.SetAsBox(
			this.size.x / 2 * Box2D.SCALE,
			this.size.y / 2 * Box2D.SCALE
		);
		
		fixture.density = 1.0;
		// fixture.friction = 0.5;
		// fixture.restitution = 0.3;

		this.body.CreateFixture(fixture);
	}
	
	update() {		
		var p = this.body.GetPosition();
		this.pos = {
			x: (p.x / Box2D.SCALE - this.size.x / 2),
			y: (p.y / Box2D.SCALE - this.size.y / 2 )
		};
		this.angle = this.body.GetAngle().round(2);
		
		if( this.currentAnim ) {
			this.currentAnim.update();
			this.currentAnim.angle = this.angle;
		}
	}
	
	kill() {
		ig.world.DestroyBody( this.body );
		super.kill();
	}
};
