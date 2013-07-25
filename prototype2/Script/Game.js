var Game = function()
{
	//game object
}

Game.prototype.init = function()
{
	var that = this;
	this.renderer = new THREE.WebGLRenderer({antialias: true});
	this.renderer.setSize(WIDTH, HEIGHT);
	this.renderer.autoClear = false;
	
	document.body.appendChild(this.renderer.domElement);
	
	this.currentScreen = new Screen('Menu');
	
	this.currentScreen.init(this.renderer);
	
	function onWindowResize() {

				that.currentScreen.camera.aspect = window.innerWidth / window.innerHeight;
				that.currentScreen.camera.updateProjectionMatrix();

				that.renderer.setSize( window.innerWidth, window.innerHeight );

			};
			
		window.addEventListener( 'resize', onWindowResize, false );
}

Game.prototype.start = function()
{
	var that = this;
	var count = 0;
	var that = this;
	var time0 = new Date().getTime(); // milliseconds since 1970
	
	var loop = function()
	{
		var time = new Date().getTime();
		
		that.gameTime = time - time0;
		gameTime = that.gameTime;
		
		that.update();
		
		// Respond to user input
		that.currentScreen.handleInput();
		//update the robot
		that.currentScreen.update(time - time0);
		// Render visual frame
		that.currentScreen.render(that.renderer, time - time0);
		
		// Loop
		requestAnimationFrame(loop, that.renderer.domElement);
	};
	
	loop();
}

Game.prototype.handleInput = function()
{
	
};

Game.prototype.update = function()
{
	this.handleInput();
}