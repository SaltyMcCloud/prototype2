var Tile = function(_position)
{
	this.speedFactor = 5;
	this.position = _position || {x: 0, y:0};
	this.type = 'tile';
	this.geometry =
		new THREE.CubeGeometry
		(
			vGRID_DIM.x / iNUM_BOXES - 1.5,
			vGRID_DIM.y / iNUM_BOXES - 1.5,
			vGRID_DIM.x / 50
		);
	//this.material = new THREE.MeshLambertMaterial({color: Color.Grey});
	this.material = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'Images/metal.jpg' ) });
	this.object = new THREE.Mesh(this.geometry, this.material);
	this.object.castShadow = true;
	this.object.receiveShadow = true;
	this.object.position = board_to_world(this.position);
	this.deselectedHeight = -50;
	this.object.position.z = this.deselectedHeight;
	this.isOccupied = false;
	this.isSelected = false;
	this.selectedHeight = this.object.position.z + 40;
}

Tile.prototype.toggleSelected = function()
{
	this.isSelected = !this.isSelected;
}

Tile.prototype.update = function()
{
	if(this.isSelected)
	{
		var d_y = (this.selectedHeight - this.object.position.z) / this.speedFactor;
		
		if(Math.abs(d_y) > .001)
			this.object.position.z += d_y;
		else
			this.object.position.z = this.selectedHeight;
	}
	else
	{
		var d_y = (this.deselectedHeight - this.object.position.z) / this.speedFactor;
		
		if(Math.abs(d_y) > .001)
			this.object.position.z += d_y;
		else
			this.object.position.z = this.deselectedHeight;
	}
}