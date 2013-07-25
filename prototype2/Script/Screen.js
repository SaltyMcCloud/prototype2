var Screen = function(_title)
{
	this.title = _title;
}

Screen.prototype.init = function(renderer)
{
	var that = this;
	
	this.uTime = 0;
	
	this.beat = new Beat(.25);
	
	this.widgets = [];
	this.timelines = [];
	
	this.renderer = renderer;
	
	this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	this.camera.position.x = 0;
	this.camera.position.y = 3000;
	this.camera.position.z = -1000;
	
	this.focalLength = 1000;
	
	this.scene = new THREE.Scene();
	
	this.scene.add(this.camera);
	
	this.numCubes = 10;
	
	this.meshes = [];
	
	this.myMat = new THREE.MeshLambertMaterial({color: 0xff0000});
	
	this.bokeh_uniforms = 
					{ 
						'tDiffuse': { type: 't', value: null },
					};
	
	this.bokeh_attributes =
					{
						'uTime': {type: 'f', value: 0.0},
					};
					
	this.noise_uniforms =
					{
						random_seed:
							{
								type: 'f',
								value: 10.003,
							},
						tDiffuse:
							{
								type: 't',
								value: 0,
								texture: THREE.ImageUtils.loadTexture('Images/explosion.png'),
							},
						time:
							{
								type: 'f',
								value: 0.0,
							},
						uTime:
							{
								type: 'f',
								value: 0.0,
							},
					};
					
	this.noise_uniforms_plane =
					{
						random_seed:
							{
								type: 'f',
								value: 200.003,
							},
						tDiffuse:
							{
								type: 't',
								value: 0,
								texture: THREE.ImageUtils.loadTexture('Images/explosion.png'),
							},
						time:
							{
								type: 'f',
								value: 0.0,
							},
						uTime:
							{
								type: 'f',
								value: 0.0,
							},
					};
	
	this.noise_uniforms_plane2 =
					{
						random_seed:
							{
								type: 'f',
								value: 4.5557,
							},
						tDiffuse:
							{
								type: 't',
								value: 0,
								texture: THREE.ImageUtils.loadTexture('Images/water.jpg'),
							},
						time:
							{
								type: 'f',
								value: 0.0,
							},
						uTime:
							{
								type: 'f',
								value: 0.0,
							},
					};
	
	this.noise_shaderMat =
		new THREE.ShaderMaterial(
			{
				uniforms: this.noise_uniforms,
				//attributes: this.bokeh_attributes,
				vertexShader: ShaderManager.noise_vertShader,
				fragmentShader: ShaderManager.noise_fragShader
			}
		);
		
	this.noise_shaderMat_plane =
		new THREE.ShaderMaterial(
			{
				uniforms: this.noise_uniforms_plane,
				//attributes: this.bokeh_attributes,
				vertexShader: ShaderManager.noise_vertShader,
				fragmentShader: ShaderManager.noise_fragShader
			}
		);
		
	this.noise_shaderMat_plane2 =
		new THREE.ShaderMaterial(
			{
				uniforms: this.noise_uniforms_plane2,
				//attributes: this.bokeh_attributes,
				vertexShader: ShaderManager.noise_vertShader,
				fragmentShader: ShaderManager.noise_fragShader
			}
		);
	
	// this.sphereGeom = new THREE.SphereGeometry(5000, 200, 200);
	// this.sphere = new THREE.Mesh(this.sphereGeom, this.noise_shaderMat_plane2);
	 // this.sphere.doubleSided = true;
	 // this.sphere.flipNormals = true;
	 // this.scene.add(this.sphere);
	
	this.planegeom = new THREE.PlaneGeometry(4000, 4000, 1, 1);
	this.plane = new THREE.Mesh(this.planegeom, this.noise_shaderMat_plane);
	 this.plane.doubleSided = true;
	 //this.plane.flipNormals = true;
	 this.plane.rotation.set(0, PI,0);
	this.plane.position.z += 400;
	
	this.scene.add(this.plane);
	
	for(var i = 0; i < this.numCubes; ++i)
	{
		var mat = this.myMat;
		mat = this.noise_shaderMat;
		
		if(i < this.numCubes / 2)
		{
			mat = this.noise_shaderMat_plane;
		}
		
		var geom = new THREE.SphereGeometry(200, 64, 64);
		
		this.meshes[i] = new THREE.Mesh(geom, mat);
		
		this.meshes[i].receiveShadow = true;
		this.meshes[i].castShadow = true;
		
		this.meshes[i].position.set(800 * Math.cos(i * 360 / this.numCubes), 800 * Math.sin(i * 360 / this.numCubes), Math.random() * 401 - 200);
	
		this.scene.add(this.meshes[i]);
	}
	
	this.light = new THREE.PointLight(0xffffff, 1, 10000);
	this.light.position.set(0, 0, -1000);
	
	this.light.receiveShadow = true;
	this.light.castShadow = true;
	
	this.scene.add(this.light);
	
	
	this.composer = new THREE.EffectComposer(this.renderer);
	this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
	
	this.MyEffectShader =
	{
		uniforms:
			{ 
				'distance': { type: 'f', value: 5.0 },
				'tDiffuse': { type: 't', value: null },
			},
		vertexShader: ShaderManager.blur_vertShader,
		fragmentShader: ShaderManager.blur_fragShader
	};
	
	this.effect = new THREE.ShaderPass(this.MyEffectShader);
	this.effect.renderToScreen = true;
	this.effect.update = true;
	this.composer.addPass(this.effect);
	
	
	//MAKE THE RHINO
	// this.rhino = null;
	// var jsonLoader = new THREE.JSONLoader();
	// jsonLoader.load('Script/rhino.js', 
								// function(geometry)
								// {
									// that.rhino = new THREE.Mesh(geometry, that.myMat);
									// that.rhino.scale.set(80,80,80);
									// that.scene.add(that.rhino);
								// }
							// );
	
	// Setup keyboard events
	this.keys = {};
	document.onkeydown = 
		function(e)
		{
			//console.log('keydown ' + e.which);
			if (e.which)
			{
				if (that.keys[e.which] !== 'triggered')
				{
					that.keys[e.which] = true;
				}
			}
			//console.log(that.keys);
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
}

Screen.prototype.onInit = function()
{
	
}

Screen.prototype.onEnd = function()
{
	
}

Screen.prototype.handleInput = function()
{
	if(this.keys[32] === true)
	{
		this.keys[32] = 'triggered';
		//console.log('Space bar hit');
		console.log(this.MyEffectShader.uniforms['distance'].value);
	}
};

Screen.prototype.add = function(widget)
{
	this.widgets.push(widget);
	this.scene.add(widget.mesh);
}

var count = 0;

Screen.prototype.update = function()
{	
	var that = this;
	
	for(var i = 0; i < this.numCubes; ++i)
	{
		//this.meshes[i].rotation.x += Math.random() * .05 - .025;
		//this.meshes[i].rotation.y += Math.random() * .05 - .025;
		//this.meshes[i].rotation.z += Math.random() * .05 - .025;
	}
	count++;
	//have the camera look at the position of the scene
	this.camera.lookAt(this.scene.position);
	
	this.noise_uniforms['uTime'].value = this.uTime;
		this.MyEffectShader.uniforms['distance'].value += 1.0;
	
	this.uTime += .025;
	if(this.uTime > 360)
		this.uTime = 0;
}

var angle = 0;

Screen.prototype.render = function(renderer, t)
{
	angle += .01;
	if(angle > 360)
		angle = 0;
	
	this.noise_shaderMat.uniforms['random_seed'] = 100.34;
	this.noise_shaderMat.uniforms['time'].value = .00075 * t;
	this.noise_shaderMat_plane.uniforms['time'].value = .00045 * t;
	this.noise_shaderMat.uniforms['uTime'].value = this.beat.toBeatTime(t);
	this.noise_shaderMat_plane.uniforms['uTime'].value = this.beat.toBeatTime(t);
	
	this.noise_shaderMat_plane.uniforms['random_seed'] = 50.34;
	this.noise_shaderMat_plane2.uniforms['time'].value = .00055 * t;
	this.noise_shaderMat_plane2.uniforms['uTime'].value = .00005 * t;
	
	//if(1 - this.beat.toBeat(t) < .1)
	//console.log('yeaa');
	if(this.beat.toBeat(t) > .9)
	console.log('inflating');
	else if (this.beat.toBeat(t) < 0)
	console.log('deflating');
	
	this.camera.position.x = 2000 * Math.cos(angle);
	this.camera.position.y = 2000 * Math.sin(angle);
	
	this.camera.up.set(0,0,1);
	this.camera.lookAt(this.scene.position);
	//renderer.render(this.scene, this.camera);
	this.composer.render();
}

Screen.prototype.setTimelineActive = function(name, b_parent, b_children)
{
	_.each(this.widgets,
					function(widget, index)
					{
						//console.log('herro');
						widget.setTimelineActive(name, b_parent, b_children);
					}
				);
}