//if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var canvas = document.getElementById("canvas");

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight - 100;
var C_OF_REV = new THREE.Vector3(0, 0, 0);
var MASS_OF_CENTER = 5;
var G_CONST = .667300;
var	MAX_DIST = 500,
	MIN_DIST = 50;
var mouse = {};

/*****************************/
//RENDERER//
/*****************************/
var renderer = new THREE.WebGLRenderer();
renderer.setSize(WIDTH, HEIGHT);

document.body.appendChild(renderer.domElement);

/*****************************/
//CAMERA//
/*****************************/
var VIEW_ANGLE = 45,
	ASPECT = WIDTH / HEIGHT,
	NEAR = 0.1,
	FAR = 10000;

//MAIN SCENE
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(VIEW_ANGLE,
	ASPECT, NEAR, FAR);
camera.position.z = 1000;
camera.position.y = 500;
scene.add(camera);

//*/
/*****************************/
// EVENTS
/*****************************/

var CAM_ZOOM = 20;
function scroll_event(e)
{
	var delta = 0;
	if(!e)
		e = window.event;
	if(e.wheelDelta)
		delta = e.wheelDelta / 120;
	else if(e.detail)
		delta = -e.detail / 3;
		
	var prevPos = (camera.position).clone();
	if(delta < 0)
	{
		camera.position.z += CAM_ZOOM;
		//alert("zoomming out");
	}else if(delta > 0)
	{
		//alert("zooming in");
		camera.position.z += -CAM_ZOOM;
		var distToFocus = (camera.position).distanceTo(FOCUS);
		
		if(distToFocus < 50)
		{
			alert(distToFocus);
			camera.position = prevPos;
		}
	}
}

window.addEventListener('DOMMouseScroll', scroll_event, false);
document.onmousewheel = scroll_event;



/***************************/
//PLANETS
/***************************/

var planets = [];
var NUMBER_OF_PLANETS = 9;

function planet()
{
	this.distFromCOR = Math.random() * MAX_DIST + MIN_DIST;
	this.velocity = Math.sqrt(G_CONST * MASS_OF_CENTER / (this.distFromCOR * this.distFromCOR));
	this.angle = Math.random() * 360;
	this.radius = Math.random() * 3 + 2;
	this.segments = 32;
	this.rings = 32;
	this.color = new THREE.Color("0xCC0000");
	this.color.setRGB(Math.random(), Math.random(), Math.random());
	this.rotation = new THREE.Vector3(
		Math.random() * 2,
		Math.random() * 2,
		Math.random() * 2);
	this.material = 
		new THREE.MeshLambertMaterial(
		{
			//color: 'rgb(' + 255 + ', ' + 255 + ', ' + 255 + ')'
			color: 0xCC0000
			//this.color
		});
	this.body = new THREE.Mesh(
		new THREE.SphereGeometry(
			this.radius,
			this.segments,
			this.rings),
		this.material);
		
	this.body.position.x = C_OF_REV.x + this.distFromCOR;
	this.body.position.y = C_OF_REV.y;
	this.body.position.z = C_OF_REV.z + this.distFromCOR;
}

for(var i = 0; i < NUMBER_OF_PLANETS; i++)
{
	planets[i] = new planet();
	scene.add(planets[i].body);
}
for(var i = 0; i < 100; i++)
{
	var p = new planet();
	p.body.position = new THREE.Vector3(-500 + 10 * i, 0, -1000);
	scene.add(p.body);
}
var sun = new planet();
sun.body.position = C_OF_REV;
sun.body.radius = 200;
scene.add(sun.body);

/*****************************/
//LIGHTS//
/*****************************/
var pointLight = new THREE.PointLight(0xFFFFFF);

pointLight.position.x = C_OF_REV.x;
pointLight.position.y = C_OF_REV.y + 20;
pointLight.position.z = C_OF_REV.z;

scene.add(pointLight);

var ambient_Light = new THREE.AmbientLight(0x111111);
scene.add(ambient_Light);
/*****************************/
//RENDER//
/*****************************/
var angle = 0;
var FOCUS = new THREE.Vector3();
FOCUS = C_OF_REV;
function render()
{
	
	requestAnimationFrame(render);
	//gl.clearColor(0.0,0.0,0.0,1.0);
	//alert("asdf");
	for(var i = 0; i < planets.length; i++)
	{
		var p = planets[i];
		var b = p.body;
		b.position.x = p.distFromCOR * Math.cos(p.angle);
		b.position.z = p.distFromCOR * Math.sin(p.angle);
		b.rotation.x += p.rotation.x;
		b.rotation.y += p.rotation.y;
		b.rotation.z += p.rotation.z;
		p.angle += p.velocity;
		if(p.angle > 360) p.angle = 0;
	}
	//camera.lookAt(planets[2].body.position);
	// Update light position uniforms
    var pos = THREE.Extras.Utils.projectOnScreen(vlight, camera);
    grPass.uniforms.fX.value = pos.x;
    grPass.uniforms.fY.value = pos.y;
	
	camera.lookAt(FOCUS);
	
	renderer.render( scene, camera );
}

render();
/*****************************/




















