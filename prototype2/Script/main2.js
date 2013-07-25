var SCREEN_WIDTH = window.innerWidth;
			var SCREEN_HEIGHT = window.innerHeight;

			var COLOR1 = 0x77bbff;
			var COLOR2 = 0x8ec5e5;
			var COLOR3 = 0x97a8ba;

			var container,stats;

			var camera, target, scene, oclscene;
			var renderer, renderTarget, renderTargetOcl;

			var mesh, zmesh, geometry, pointLight, pmesh, vlight;

			var finalcomposer, oclcomposer, hblur, vblur;

			var mouseX = 0, mouseY = 0;

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;

			var render_canvas = 1, render_gl = 1;
			var has_gl = 0;

			var grPass;


			document.addEventListener( 'mousemove', onDocumentMouseMove, false );


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
			
			function init() {
				container = document.createElement( 'div' );
				document.body.appendChild( container );

				// MAIN SCENE
				
				camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 100000 );
				camera.position.z = 220;
				
				target = new THREE.Vector3(0, 40, 0);

				scene = new THREE.Scene();
				scene.add( new THREE.AmbientLight( 0xffffff ) );
				pointLight = new THREE.PointLight( COLOR3 );
				pointLight.position.set( 0, 100, 0 );
				scene.add( pointLight );
				cameraLight = new THREE.PointLight( 0x666666 );
				camera.add(cameraLight);


				// OCL SCENE

				oclscene = new THREE.Scene();
				oclscene.add( new THREE.AmbientLight( 0xffffff ) );
				oclcamera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 100000 );
				oclcamera.position = camera.position;

				// Vol light
				vlight = new THREE.Mesh( 
					new THREE.IcosahedronGeometry(50, 3),
					new THREE.MeshBasicMaterial({
						color: COLOR1
					})
				);
				vlight.position.y = 0;
				oclscene.add( vlight );

				// RENDERER
					
				renderer = new THREE.WebGLRenderer({
					//antialias: true
				});

				renderer.autoClear = false;
				renderer.sortObjects = true;
				renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
				renderer.domElement.style.position = "relative";

				container.appendChild( renderer.domElement );

				has_gl = 1;

				// STATS

				stats = new Stats();
				stats.domElement.style.position = 'absolute';
				stats.domElement.style.top = '0px';
				stats.domElement.style.zIndex = 100;
				container.appendChild( stats.domElement );

				// SCENE
/*
				var loader = new THREE.JSONLoader(),
					callbackObj = function( geometry ) { createScene( geometry, 0, 0, 0, 0 ) };
				loader.load( "tron/trondisk.js", callbackObj );
*/				var geom = new THREE.SphereGeometry(50, 16, 16);
				zmesh = new THREE.Mesh(geom, new THREE.MeshLambertMaterial({ color: 0xff0000 }));
				zmesh.position.set( 0, 0, 0);
				//zmesh.scale.set( 3, 3, 3 );
				scene.add( zmesh );
				
				var gmat = new THREE.MeshBasicMaterial( { color: 0x000000, map: null } );
				var geometryClone = new THREE.SphereGeometry(50, 16, 16);
				var gmesh = new THREE.Mesh(geometryClone, gmat);
				gmesh.position = zmesh.position;
				gmesh.rotation = zmesh.rotation;
				gmesh.scale = zmesh.scale;
				oclscene.add(gmesh);
				/*
				var m = new THREE.Mesh(geom, new THREE.MeshFaceMaterial());
				m.position.set(0, 100, 0);
				m.scale = zmesh.scale;
				m.rotation = zmesh.rotation;
				scene.add(m);

				m = new THREE.Mesh(geom, new THREE.MeshFaceMaterial());
				m.position.set(0, -100, 0);
				m.scale = zmesh.scale;
				m.rotation = zmesh.rotation;
				scene.add(m);

				m = new THREE.Mesh(geometryClone, gmat);
				m.position.set(0, 100, 0);
				m.scale = zmesh.scale;
				m.rotation = zmesh.rotation;
				oclscene.add(m);

				m = new THREE.Mesh(geometryClone, gmat);
				m.position.set(0, -100, 0);
				m.scale = zmesh.scale;
				m.rotation = zmesh.rotation;
				oclscene.add(m);
				*/
				// COMPOSERS

				var renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBufer: false };
				renderTargetOcl = new THREE.WebGLRenderTarget( SCREEN_WIDTH/2, SCREEN_HEIGHT/2, renderTargetParameters );
				
				var effectFXAA = new THREE.ShaderPass( THREE.ShaderExtras[ "fxaa" ] );
				effectFXAA.uniforms[ 'resolution' ].value.set( 1 / SCREEN_WIDTH, 1 / SCREEN_HEIGHT );

				hblur = new THREE.ShaderPass( THREE.ShaderExtras[ "horizontalBlur" ] );
				vblur = new THREE.ShaderPass( THREE.ShaderExtras[ "verticalBlur" ] );

				var bluriness = 2;

				hblur.uniforms[ 'h' ].value = bluriness / SCREEN_WIDTH*2;
				vblur.uniforms[ 'v' ].value = bluriness / SCREEN_HEIGHT*2;

				var renderModel = new THREE.RenderPass( scene, camera );
				var renderModelOcl = new THREE.RenderPass( oclscene, oclcamera );

				grPass = new THREE.ShaderPass( THREE.Extras.Shaders.Godrays );
				grPass.needsSwap = true;
				grPass.renderToScreen = false;

				var finalPass = new THREE.ShaderPass( THREE.Extras.Shaders.Additive );
				finalPass.needsSwap = true;
				finalPass.renderToScreen = true;

				oclcomposer = new THREE.EffectComposer( renderer, renderTargetOcl );

				oclcomposer.addPass( renderModelOcl );
				oclcomposer.addPass( hblur );
				oclcomposer.addPass( vblur );
				oclcomposer.addPass( hblur );
				oclcomposer.addPass( vblur );
				oclcomposer.addPass( grPass );

				finalPass.uniforms[ 'tAdd' ].texture = oclcomposer.renderTarget1;

				renderTarget = new THREE.WebGLRenderTarget( SCREEN_WIDTH, SCREEN_HEIGHT, renderTargetParameters );

				finalcomposer = new THREE.EffectComposer( renderer, renderTarget );

				finalcomposer.addPass( renderModel );
				finalcomposer.addPass( effectFXAA );
				finalcomposer.addPass( finalPass );
			}

			function createScene( geometry, x, y, z, b ) {

				zmesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() );
				zmesh.position.set( x, y, z );
				zmesh.scale.set( 3, 3, 3 );
				scene.add( zmesh );

				var gmat = new THREE.MeshBasicMaterial( { color: 0x000000, map: null } );
				var geometryClone = THREE.GeometryUtils.clone( geometry );
				var gmesh = new THREE.Mesh(geometryClone, gmat);
				gmesh.position = zmesh.position;
				gmesh.rotation = zmesh.rotation;
				gmesh.scale = zmesh.scale;
				oclscene.add(gmesh);
				
				// extra fancy
				var m = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial());
				m.position.set(0, 100, 0);
				m.scale = zmesh.scale;
				m.rotation = zmesh.rotation;
				scene.add(m);

				m = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial());
				m.position.set(0, -100, 0);
				m.scale = zmesh.scale;
				m.rotation = zmesh.rotation;
				scene.add(m);

				m = new THREE.Mesh(geometryClone, gmat);
				m.position.set(0, 100, 0);
				m.scale = zmesh.scale;
				m.rotation = zmesh.rotation;
				oclscene.add(m);

				m = new THREE.Mesh(geometryClone, gmat);
				m.position.set(0, -100, 0);
				m.scale = zmesh.scale;
				m.rotation = zmesh.rotation;
				oclscene.add(m);
			}

			function onDocumentMouseMove(event) {

				mouseX = ( event.clientX - windowHalfX );
				mouseY = ( event.clientY - windowHalfY );

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();
				stats.update();
			}

			var t = 0.0;

			function render() {
				t += .01;


				//camera.position.x += ( mouseX/2 - camera.position.x ) * .05;
				//camera.position.y += ( - mouseY/2 - camera.position.y ) * .05;
				oclcamera.position = camera.position;

				oclcamera.lookAt( scene.position );
				camera.lookAt( scene.position );


				pointLight.position.set( 0, 0, 0 );
				vlight.position = pointLight.position;
				vlight.updateMatrixWorld();
				
				var lPos = THREE.Extras.Utils.projectOnScreen(vlight, camera);
				grPass.uniforms["fX"].value = lPos.x;
				grPass.uniforms["fY"].value = lPos.y;

				oclcomposer.render( 0.1 );
				finalcomposer.render( 0.1 );
			}
/*
			var gui;
			function initGUI()
			{
				gui = new DAT.GUI({
				    height : 5 * 32 - 1
				});
				gui.add(grPass.uniforms.fExposure, 'value').min(0.0).max(1.0).step(0.01).name("Exposure");
				gui.add(grPass.uniforms.fDecay, 'value').min(0.6).max(1.0).step(0.01).name("Decay");
				gui.add(grPass.uniforms.fDensity, 'value').min(0.0).max(1.0).step(0.01).name("Density");
				gui.add(grPass.uniforms.fWeight, 'value').min(0.0).max(1.0).step(0.01).name("Weight");
				gui.add(grPass.uniforms.fClamp, 'value').min(0.0).max(1.0).step(0.01).name("Clamp");
			}
*/
			init();
			//initGUI();
			animate();