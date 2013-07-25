

var board_to_world = function(position)
{
	// Convert board position into world position
	return {x: 100 * position.x - vGRID_DIM.x / 2, y: 100 * position.y  - vGRID_DIM.y / 2, z: 0};
};

var Level = function()
{
	// A Game object is the highest level object representing entire game
};

Level.prototype.init = function()
{
	var that = this;
	
	this.goToMainMenu = false;
	
	this.startingBoardPosition = {x: 0, y: 0};
	
	this.goalTile = {x: iNUM_BOXES - 1, y: iNUM_BOXES - 1};
	
	this.inShiftMode = false;
	
	this.board = new Board();
	this.board.init();
	
	this.gameIsPaused = false;
	
	this.barriers = [];
	
	for(var i = 0; i < iNUM_BOXES; ++i)
	{
		this.barriers[i] = [];
		for(var j = 0; j < iNUM_BOXES; ++j)
		{
			if(Math.random() * 10 > 5
			   && !(i == this.startingBoardPosition.x
			   && j == this.startingBoardPosition.y))
				this.barriers[i][j] = new Barrier({x: i, y: j});
		}
	}
	
	//this.barriers.push(new Barrier({x: 1, y: 1}));
	//this.barriers.push(new Barrier({x: 2, y: 2}));
	this.robot = new Robot(this.startingBoardPosition);
	
	this.numberOfMoves = 10;
	
	this.selectedTile = {x: 0, y: 0};
	this.prevSelectedTile = this.selectedTile;
	
	this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	this.camera.position.z = 700;
	this.camera.position.y = -400;

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.Fog( Color.Green, 500, 3000 );
	
	this.scene.add(this.camera);
	
	// Add all barriers to scene
	for(var i = 0; i < iNUM_BOXES; ++i)
	{
		_.each(this.barriers[i],
					function(element, index)
					{
						that.scene.add(element.object);
					}
				);
	}
	
	_.each(this.robot.geomList,
				function(element, index)
				{
					that.scene.add(element);
				}
			);

	
	//Make the tiles
	this.tiles = [];
	
	for(var _x = 0; _x < iNUM_BOXES; ++_x)
	{
		this.tiles[_x] = [];
		
		for(var _y = 0; _y < iNUM_BOXES; ++_y)
		{
			var _pos = {x: _x, y: _y};
			//console.log(_pos);
			this.tiles[_x][_y] = new Tile(_pos);
		}
	}
	
	for(var i = 0; i < iNUM_BOXES; ++i)
	{
		_.each(this.tiles[i],
					function(element, index)
					{
						that.scene.add(element.object);
					}
				);
	}
	
	// Spotlight
	var spotlight = new THREE.PointLight(0xffffff, 1, 1000);
	spotlight.position.set(0, -100, 300);
	this.scene.add(spotlight);
	
	// Ambient light
	var ambient_light = new THREE.AmbientLight(0x040404);
	this.scene.add(ambient_light);
	
	
	// Setup keyboard events
	this.keys = {};
	document.onkeydown = 
		function(e)
		{
			console.log('keydown ' + e.which);
			if (e.which)
			{
				if (that.keys[e.which] !== 'triggered')
				{
					that.keys[e.which] = true;
				}
			}
			console.log(that.keys);
		};
	
	document.onkeyup =
		function(e)
		{
			//console.log('keyup ' + e.which);
			if (e.which)
			{
				that.keys[e.which] = false;
			}
			//console.log(that.keys);
		};
		
	this.board.update(this.robot, this.barriers);
	
	//make the 3d text
	var text = "Remaining Shifts";
	//this.scoreString = new Text_3D(text, this.scene);
	
	//make skybox
	//SKYBOX
	this.skyboxArray = [];
	//right
	this.skyboxArray.push( new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'Images/city_right.jpg' ) }));
	//left
	this.skyboxArray.push( new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'Images/city_left.jpg' ) }));
	//front
	this.skyboxArray.push( new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'Images/city_back.jpg' ) }));
	//back
	this.skyboxArray.push( new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'Images/city_front.jpg' ) }));
	//top
	this.skyboxArray.push( new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'Images/city_top.jpg' ) }));
	//bottom
	this.skyboxArray.push( new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'Images/city_top.jpg' ) }));
	
	this.skyboxGeom = new THREE.CubeGeometry( 3000, 3000, 3000, 0, 0, 0, this.skyboxArray );
	//this.skyboxGeom = new THREE.CubeGeometry( 1000, 1000, 1000, 0, 0, 0, this.skyboxArray );
	this.skybox = new THREE.Mesh( this.skyboxGeom, new THREE.MeshFaceMaterial() );
	this.skybox.position.z -= 500;
	this.skybox.position.y += 500;
	this.skybox.flipSided = true;
	this.scene.add(this.skybox);
	
};

Level.prototype.render = function(renderer, t)
{
	// Bob the camera a bit
	//this.camera.position.x = Math.sin(t / 1000.0) * 60;
	this.camera.position.z = 700;
	this.camera.position.y = -800;// + Math.sin(t / 700.0) * 40;
	var x = this.scene.position.x + Math.sin(t / 1500);
	var y = this.scene.position.y + Math.sin(t / 1500) * -1;
	var lookAtPos = this.scene.position;
	lookAtPos.x = x;
	lookAtPos.y = y;
	this.camera.lookAt(lookAtPos);
	
	renderer.render(this.scene, this.camera);
};

Level.prototype.legalRobotMove = function(position)
{
	if(!this.board.isTileEmpty(position))
		return false;
	if (position.x < 0 || position.x > iNUM_BOXES - 1)
	{
		return false;
	}
	if (position.y < 0 || position.y > iNUM_BOXES - 1)
	{
		return false;
	}
	return true;
};

Level.prototype.handleInput = function()
{
	//Escape
	if (this.keys[27] === true)
	{
		this.keys[27] = 'triggered';
		this.goToMainMenu = true;
	}
	//Enter
	if (this.keys[13] === true)
	{
		this.keys[13] = 'triggered';
		this.inShiftMode = !this.inShiftMode;
	}
	//Space
	if (this.keys[32] === true)
	{
		this.keys[32] = 'triggered';
		this.letsPlay = true;
	}
	// Left
	if (this.keys[65] === true)
	{
		this.keys[65] = 'triggered';
		
		var newPosition =
		{
			x: this.robot.targetPosition.x - 1,
			y: this.robot.targetPosition.y
		};
			
		if (this.legalRobotMove(newPosition))
		{
			this.robot.moveTo(newPosition);
		}
	}
	// Right
	if (this.keys[68] === true)
	{
		this.keys[68] = 'triggered';
		var newPosition =
		{
			x: this.robot.targetPosition.x + 1,
			y: this.robot.targetPosition.y
		};
		
		if (this.legalRobotMove(newPosition))
		{
			this.robot.moveTo(newPosition);
		}
	}
	// Up
	if (this.keys[87] === true)
	{
		this.keys[87] = 'triggered';
		var newPosition =
		{
			x: this.robot.targetPosition.x,
			y: this.robot.targetPosition.y + 1
		};
		
		if (this.legalRobotMove(newPosition))
		{
			this.robot.moveTo(newPosition);
		}
	}
	// Down
	if (this.keys[83] === true)
	{
		this.keys[83] = 'triggered';
		var newPosition =
		{
			x: this.robot.targetPosition.x,
			y: this.robot.targetPosition.y - 1
		};
		
		if (this.legalRobotMove(newPosition))
		{
			this.robot.moveTo(newPosition);
		}
	}
	//Left arrow
	if (this.keys[37] === true)
	{
		this.keys[37] = 'triggered';
		this.selectedTile =
		{
			x: this.selectedTile.x - 1,
			y: this.selectedTile.y
		};
		
		if(this.inShiftMode)
		{
			this.shiftBarriers(-1, 0);
		}
	}
	//Up arrow
	if (this.keys[38] === true)
	{
		this.keys[38] = 'triggered';
		this.selectedTile =
		{
			x: this.selectedTile.x,
			y: this.selectedTile.y + 1
		};
		
		if(this.inShiftMode)
		{
			this.shiftBarriers(0, 1);
		}
	}
	//Right arrow
	if (this.keys[39] === true)
	{
		this.keys[39] = 'triggered';
		this.selectedTile =
		{
			x: this.selectedTile.x + 1,
			y: this.selectedTile.y
		};
		
		if(this.inShiftMode)
		{
			this.shiftBarriers(1, 0);
		}
	}
	//Down arrow
	if (this.keys[40] === true)
	{
		this.keys[40] = 'triggered';
		this.selectedTile =
		{
			x: this.selectedTile.x,
			y: this.selectedTile.y - 1
		};
		
		if(this.inShiftMode)
		{
			this.shiftBarriers(0, -1);
		}
	}
		
	if(this.selectedTile.x < 0)
		this.selectedTile.x = iNUM_BOXES - 1;
	if(this.selectedTile.x > iNUM_BOXES - 1)
		this.selectedTile.x = 0;
	
	if(this.selectedTile.y < 0)
		this.selectedTile.y = iNUM_BOXES - 1;
	if(this.selectedTile.y > iNUM_BOXES - 1)
		this.selectedTile.y = 0;
};

Level.prototype.updateTiles = function()
{
	var that = this;
	
	that.tiles[that.prevSelectedTile.x][that.prevSelectedTile.y].isSelected = false;
	that.tiles[that.selectedTile.x][that.selectedTile.y].isSelected = true;
	
	//reset colors
	for(var x = 0; x < iNUM_BOXES; ++x)
	{
		for(var y = 0; y < iNUM_BOXES; ++y)
		{
			var tile = that.tiles[x][y];
			tile.object.material.color = {r: 1, g: 1, b: 1};
			tile.update();
		}
	}
	
	//color the column yellow
	for(var i = 0; i < iNUM_BOXES; ++i)
	{
		//var tile = that.tiles[that.selectedTile.x][i];
		//tile.material.color = that.object.material.color = Color.Yellow;
		var tile = that.tiles[that.selectedTile.x][i].object.material;
		tile.color = {r: 1, g: 1, b:0};
	}
	
	//color the row yellow
	for(var i = 0; i < iNUM_BOXES; ++i)
	{
		var tile = that.tiles[i][that.selectedTile.y].object.material;
		tile.color = {r: 1, g: 1, b:0};
	}
	
	
	
	var tile = that.tiles[that.selectedTile.x][that.selectedTile.y].object.material;
	tile.color = {r:1, g:.5, b:0};
	
	tile = that.tiles[that.goalTile.x][that.goalTile.y].object.material;
	tile.color = {r:0, g: 1, b:0};
	
	that.prevSelectedTile = that.selectedTile;
}

Level.prototype.updateBarriers = function()
{
	var that = this;
	if(this.inShiftMode)
	{
		for(var i = 0; i < this.barriers.length; ++i)
		{
			_.each(this.barriers[i],
						function(element, index)
						{
							element.update();
						}
					);
		}
	}
}

Level.prototype.shiftBarriers = function(x, y)
{
	if(this.numberOfMoves < 1)
		return;
	var that = this;
	
	console.log('tile = ' + that.selectedTile.x + ', ' + that.selectedTile.y);
	
	//vertical shift
	if(x == 0 && this.selectedTile.x != this.robot.targetPosition.x)
	{
		this.numberOfMoves -= 1;
		for(var i = 0; i < this.barriers.length; ++i)
		{
			_.each(this.barriers[i],
						function(element, index)
						{
							if(element.targetPosition.x == that.selectedTile.x)
							{
								var dir = y > 0 ? 1 : -1;
								var newPos =
								{
									x: element.targetPosition.x,
									y: element.targetPosition.y + dir
								};
								
								element.moveTo(newPos);
								element.checkIfOutOfBounds();
							}
						}
					);
		}
	}
	//horizontal shift
	else if(y == 0 && this.selectedTile.y != this.robot.targetPosition.y)
	{
		this.numberOfMoves -= 1;
		for(var i = 0; i < this.barriers.length; ++i)
		{
			_.each(this.barriers[i],
						function(element, index)
						{
							if(element.targetPosition.y == that.selectedTile.y)
							{
								var dir = x > 0 ? 1 : -1;
								var newPos =
								{
									x: element.targetPosition.x + dir,
									y: element.targetPosition.y
								};
								
								element.moveTo(newPos);
							}
						}
					);
		}
	}
}

Level.prototype.update = function()
{
	var that = this;
	
	if(that.robot.boardPosition.x == that.goalTile.x && that.robot.boardPosition.y == that.goalTile.y)
		that.goToMainMenu = true;
	
	that.updateTiles();
	that.robot.update();
	that.updateBarriers();
	that.board.update(this.robot, this.barriers);
}

//// 