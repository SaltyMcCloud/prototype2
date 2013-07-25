var Text_3D = function(_string, scene)
{
	// add 3D text
	this.string = _string;
	
	this.materialFront = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
	this.materialSide = new THREE.MeshBasicMaterial( { color: 0x000088 } );
	this.materialArray = [ this.materialFront, this.materialSide ];
	var normal = "normal";
	this.options =
	{
		// size: 70,
		// height: 20,
		// curveSegments: 4,
		// font: "helvetiker",
		// weight: normal,
		// style: normal,
		// bevelThickness: 2,
		// bevelSize: 2,
		// bevelEnabled: true,
		// material: 0,
		// extrudeMaterial: 1
	};
	
	this.textGeom = new THREE.TextGeometry( this.string, this.options);
	
	this.textMaterial = new THREE.MeshFaceMaterial(this.materialArray);
	this.textMesh = new THREE.Mesh(this.textGeom, this.textMaterial );
	
	this.textGeom.computeBoundingBox();
	this.textWidth = this.textGeom.boundingBox.max.x - this.textGeom.boundingBox.min.x;
	
	this.textMesh.position.set( -0.5 * this.textWidth, 50, 100 );
	this.textMesh.rotation.x = -Math.PI / 4;
	scene.add(this.textMesh);
}