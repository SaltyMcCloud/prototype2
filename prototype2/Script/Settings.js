var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var vCENTER = new THREE.Vector3(0, 0, 0);
var GRIDWH = 100;
	
/*****************************/
//CAMERA//
/*****************************/
var VIEW_ANGLE = 70,
	ASPECT = WIDTH / HEIGHT,
	NEAR = 0.1,
	FAR = 50001;

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var Color =
{
	White: 0xffffff,
	Black: 0x000000,
	Grey: 0x999999,
	LightGrey: 0x111111,
	Red: 0xff0000,
	Blue: 0x00ff00,
	Green: 0x00ff00,
	COLOR1: 0x77bbff,
	COLOR2: 0x8ec5e5,
	COLOR3: 0x97a8ba,
	Sun: 0xCCC100,
};

var gameTime;