var Barrier = function(position)
{
	this.fallingHeight = 500;
	this.fallingDepth = -1500;
	this.targetZ = 0;
	this.doneFalling = false;
	this.swapping = false;
	this.speedFactor = 5;
	//// A Barrier is a game object
	// Default position if unspecified is at square 0, 0
	this.boardPosition = position || {x: 0, y: 0};
	this.targetPosition = this.boardPosition;
	this.type = 'barrier';
	this.geometry = new THREE.CubeGeometry(90, 90, 90);
	// Geometry should always be around origin
	//this.material = new THREE.MeshLambertMaterial({color: 0xff0000});
	this.material = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'Images/woodbox.jpg' ) });
	this.material.color = {r: Math.random() * .25 + .25, g: Math.random() * .25 + .25, b: Math.random() * .25 + .25};
	this.object = new THREE.Mesh(this.geometry, this.material);
	// A mesh is an Object3D, change its position to move
	this.object.position = board_to_world(this.boardPosition);
	this.isMoving = false;
};

Barrier.prototype.update = function()
{
	this.updateBoardPosition();
}

Barrier.prototype.moveTo = function(position)
{
	if(!this.isMoving)
	{
		this.targetPosition = position;
		isMoving = true;
	}
}

Barrier.prototype.checkIfOutOfBounds = function()
{
	var newZ = 0;
	if(!this.swapping)
	{
		if(this.boardPosition.x < 0 || this.boardPosition.x > iNUM_BOXES - 1
			|| this.boardPosition.y < 0 || this.boardPosition.y > iNUM_BOXES - 1)
		{
			//start the swapping sides logic
			this.swapping = true;
			this.targetZ = this.fallingDepth;
			console.log(this);
		}
	}
	else if(this.swapping)
	{
		if(!this.doneFalling)
		{
			//lerp to desired z position
			this.object.position.z += (this.targetZ - this.object.position.z) / this.speedFactor;
			
			var diff = Math.abs(this.object.position.z - this.targetZ);
			
			if(diff < 1)
			{
				this.doneFalling = true;
				this.object.position.z = this.fallingHeight;
				this.targetZ = 0;
				
				if(this.boardPosition.x < 0)
				{
					this.boardPosition.x = iNUM_BOXES - 1;
					this.targetPosition.x = iNUM_BOXES - 1;
				}
				else if(this.boardPosition.x > iNUM_BOXES - 1)
				{
					this.boardPosition.x = 0;
					this.targetPosition.x = 0;
				}
					
				if(this.boardPosition.y < 0)
				{
					this.boardPosition.y = iNUM_BOXES - 1;
					this.targetPosition.y = iNUM_BOXES - 1;
				}
				else if(this.boardPosition.y > iNUM_BOXES - 1)
				{
					this.boardPosition.y = 0;
					this.targetPosition.y = 0;
				}
			}
		}
		else if(this.doneFalling)
		{
			this.object.position.z += (this.targetZ - this.object.position.z) / this.speedFactor;
			
			var diff = Math.abs(this.object.position.z - this.targetZ);
			
			if(diff < .001)
			{
				this.doneFalling = false;
				this.swapping = false;
				this.object.position.z = 0;
			}
		}
	}
	
	return this.object.position.z;
}

Barrier.prototype.updateBoardPosition = function()
{
	var d_x = (this.targetPosition.x - this.boardPosition.x) / this.speedFactor;
	var d_y = (this.targetPosition.y - this.boardPosition.y) / this.speedFactor;
	
	if(Math.abs(d_x) < .001 && Math.abs(d_y) < .001)
	{
		this.boardPosition = this.targetPosition;
		this.isMoving = false;
	}
	else
	{	
		this.boardPosition.x += d_x;
		this.boardPosition.y += d_y;
	}
	
	var newZ = this.checkIfOutOfBounds();
	
	this.object.position = board_to_world(this.boardPosition);
	this.object.position.z = newZ;
}