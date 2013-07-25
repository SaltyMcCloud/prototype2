var Robot = function(position)
{
	//// A Robot is a game object
	// Default position if unspecified is at square 0, 0
	this.geomList = [];
	this.dim = 45;
	this.boardPosition = position || {x: 0, y: 0};
	this.targetPosition = this.boardPosition;
	this.speedFactor = 5;
	this.moving = false;
	this.type = 'robot';
	this.geometry = new THREE.CubeGeometry(this.dim, this.dim, this.dim);
	// Geometry should always be around origin
	// Make it blue
	this.material = new THREE.MeshPhongMaterial({color: 0xdddddd});
	this.object = new THREE.Mesh(this.geometry, this.material);
	// A mesh is an Object3D, change its position to move
	this.object.position = board_to_world(this.boardPosition);
	
	this.geomList.push(this.object);
	
	this.headGeometry =
		new THREE.CubeGeometry(this.dim * 2 / 3, this.dim * 2 / 3, this.dim * 2 / 3);
	this.headMaterial = new THREE.MeshPhongMaterial({color: 0xaaaaaa});
	this.headObject = new THREE.Mesh(this.headGeometry, this.headMaterial);
	this.headObject.position = this.object.position;
	this.headObject.position.z += this.dim;
	this.geomList.push(this.headObject);
};

Robot.prototype.updateBoardPosition = function()
{
	var d_x = (this.targetPosition.x - this.boardPosition.x) / this.speedFactor;
	var d_y = (this.targetPosition.y - this.boardPosition.y) / this.speedFactor;
	
	//console.log(d_x);
	
	if(Math.abs(d_x) < .001 && Math.abs(d_y) < .001)
	{
		this.boardPosition = this.targetPosition;
		this.moving = false;
	}
	else
	{	
		this.boardPosition.x += d_x;
		this.boardPosition.y += d_y;
	}
	this.headObject.position = this.object.position;
	this.headObject.position.z += this.dim;
	this.object.position = board_to_world(this.boardPosition);
};

Robot.prototype.moveTo = function(position)
{
	if(!this.moving)
	{
		this.targetPosition = position;
		this.moving = true;
	}
};

Robot.prototype.update = function()
{
	this.updateBoardPosition();
};