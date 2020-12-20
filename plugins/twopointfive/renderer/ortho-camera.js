
export class tpfOrthoCamera {
	_projection= null;
	_view= null;
	aspect= 1;
	depthTest= false;

	constructor( width, height ) {
		this._projection = mat4.create();
		this._view = mat4.create();
		mat4.ortho(this._projection, 0, width, height, 0, -1000, 1000);
		
		this.aspect = width/height;
		this.width = width;
		this.height = height;
	}

	projection() {
		return this._projection;
	}

	view() {
		return this._view;
	}
};
