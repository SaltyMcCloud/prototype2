var iNUM_BOXES = 8;

var vGRID_DIM = new THREE.Vector3(iNUM_BOXES * 100, iNUM_BOXES * 100);


var Board = function()
{
	//class representing the state of the board
}

Board.prototype.init = function()
{
	this.grid = [];
	
	for(var i = 0; i < iNUM_BOXES; ++i)
	{
		this.grid[i] = [];
		
		for(var j = 0; j < iNUM_BOXES; ++j)
		{
			var pos = {x: i, y: j};
			this.grid[i][j] = new TileInfo(pos);
		}
	}
}

Board.prototype.printBoard = function()
{
	console.log('PRINTING BOARD');
	for(var i = 0; i < iNUM_BOXES; ++i)
	{
		for(var j = 0; j < iNUM_BOXES; ++j)
		{
			console.log(this.grid[i][j]);
		}
	}
}
var c = 0;
Board.prototype.update = function(player, barriers)
{
	for(var i = 0; i < this.grid.length; ++i)
	{
		for(var j = 0; j < this.grid[i].length; ++j)
		{
			this.grid[i][j].set(TileTypes.Empty);
		}
	}
	
	for(var i = 0; i < barriers.length; ++i)
	{
		for(var j = 0; j < barriers[i].length; ++j)
		{
			if(barriers[i][j])
			{
				var x = barriers[i][j].targetPosition.x;
				var y = barriers[i][j].targetPosition.y;
				
				if(x >= 0 && x < iNUM_BOXES
					&& y >= 0 && y < iNUM_BOXES)
				{
						this.grid[x][y].set(TileTypes.HoldsBarrier);
				}
			}
		}
	}
	
	var x = player.targetPosition.x;
	var y = player.targetPosition.y;
	
	this.grid[x][y].set(TileTypes.HoldsPlayer);
	
	// if(c == 0)
	// {
		// console.log(barriers);
		// this.printBoard();
	// }
	
	// c = 1;
}

Board.prototype.isTileEmpty = function(tilePosition)
{
	console.log('x = ' + tilePosition.x + ', ' + 'y = ' + tilePosition.y);
	
	//validate the tile position
	if(tilePosition.x > -1 && tilePosition.x < iNUM_BOXES
		&& tilePosition.y > -1 && tilePosition.y < iNUM_BOXES)
	{
		console.log(this.grid[tilePosition.x][tilePosition.y].type);
		//validate whether the tile is empty
		if(this.grid[tilePosition.x][tilePosition.y].type == TileTypes.Empty)
		{
			console.log('tile is empty');
			return true;
		}
	}
	
	return false;
}