//class containing info about a given tile
var TileTypes = 
{
	Empty: 'empty',
	HoldsPlayer: 'player',
	HoldsBarrier: 'barrier',
	HoldsGrapPole: 'pole',
};

var TileInfo = function(_pos)
{
	this.type = TileTypes.Empty;
	this.tilePosition = _pos;
}

TileInfo.prototype.set = function(_type)
{
	this.type = _type;
}