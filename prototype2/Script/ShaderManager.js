var _ShaderManager = function()
{
	this.vertShader = document.getElementById('my-vertex-shader').text;
	//console.log(this.vertShader);
	
	this.fragShader = document.getElementById('my-fragment-shader').text;
	//console.log(this.fragShader);
	
	this.pp_vertShader = document.getElementById('post-vertex-shader').text;
	//console.log(this.pp_vertShader);

	this.pp_fragShader = document.getElementById('post-fragment-shader').text;
	//console.log(this.pp_fragShader);
	
	this.DoF_vertShader = document.getElementById('DoF-vertex-shader').text;
	//console.log(this.DoF_vertShader);
	
	this.DoF_fragShader = document.getElementById('DoF-fragment-shader').text;
	//console.log(this.DoF_fragShader);
	
	this.noise_vertShader = document.getElementById('noise-vertex-shader').text;
	//console.log(this.DoF_vertShader);
	
	this.noise_fragShader = document.getElementById('noise-fragment-shader').text;
	//console.log(this.DoF_fragShader);
	
	this.blur_vertShader = document.getElementById('blur-vertex-shader').text;
	//console.log(this.blur_vertShader);
	
	this.blur_fragShader = document.getElementById('blur-fragment-shader').text;
	//console.log(this.blur_fragShader);
}

var ShaderManager = new _ShaderManager();