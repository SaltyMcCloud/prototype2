var Widget = function(_textureName)
{
	this.textureName = _textureName || 'null';
	
	//console.log(this.textureName);
	
	this.size = {x: 100.0, y: 100.0, z: 0};
	this.position = {x: 0, y: 0, z: 0};
	this.children = [];
	this.parent;
	
	this.scale = {x:1, y:1, z:1};
	
	//load the texture
	this.texture = new THREE.ImageUtils.loadTexture( 'Images/' + this.textureName + '.png' );
	
	
	//create the plane mesh and map the texture to the plane
	this.material = new THREE.MeshBasicMaterial( {map: this.texture, side: THREE.DoubleSided, transparent: true, opacity: 1.0} );
	this.geom = new THREE.PlaneGeometry(this.size.x, this.size.y, 1, 1);
	this.mesh = new THREE.Mesh(this.geom, this.material);
	this.mesh.position.set(this.position.x, this.position.y, this.position.z + this.size.y / 2);
	this.mesh.rotation.x = 90;
	
	this.active = true;
	
	this.timelinesDictionary = [];
	this.timelines = [];
}

Widget.prototype.init = function()
{

}

Widget.prototype.addTimeline = function(t)
{
	//add to the dictionary. used for setting timelines active/false
	if(!this.timelinesDictionary[t.name])
		this.timelinesDictionary[t.name] = [];
	this.timelinesDictionary[t.name].push(t);
	
	//add to the list. used for updates
	this.timelines.push(t);
}

Widget.prototype.addToScene = function(scene)	
{
	var that = this;
	scene.add(that.mesh);
}

Widget.prototype.update = function()
{
	var that = this;
	
	if(this.timelines.length > 0)
	{
		_.each(this.timelines,
						function(element, index)
						{
							element.update(that);
						}
					);
	}
	
	this.position.x = this.mesh.position.x;
	this.position.y = this.mesh.position.y;
	this.position.z = this.mesh.position.z;
}

Widget.prototype.setTimelineActive = function (name, b_parent, b_children)
{
	_.each(this.timelinesDictionary,
					function(timeline, index)
					{
						if(timeline.name == name)
						{
							//console.log('herro');
						}
					}
				);
}

Widget.prototype.setScale = function(x, y, z)
{
	this.scale.x = x;
	this.scale.y = y;
	this.scale.z = z;
	
	this.mesh.scale.x = this.scale.x;
	this.mesh.scale.y = this.scale.y;
	this.mesh.scale.z = this.scale.z;
}

Widget.prototype.addPositionZ = function(z)
{
	this.position.z += z;
	this.mesh.position.z += z;
}

Widget.prototype.addPositionX = function(x)
{
	this.position.x += x;
	this.mesh.position.x += x;
}

Widget.prototype.addPositionY = function(y)
{
	this.position.y += y;
	this.mesh.position.y += y;
}

Widget.prototype.setPositionZ = function(z)
{
	this.position.z = z;
	this.mesh.position.z = z;
}

Widget.prototype.setPositionX = function(x)
{
	this.position.x = x;
	this.mesh.position.x = x;
}

Widget.prototype.setPositionY = function(y)
{
	this.position.y = y;
	this.mesh.position.y = y;
}