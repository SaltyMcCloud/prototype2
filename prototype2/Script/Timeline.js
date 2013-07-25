var Timeline = function(name, startb, startTimef, durationf, startType, endType)
{
	this.effects = [];
	this.active = startb;
	this.name = name;
	this.startb = startb;
	this.startTimef = startTimef;
	this.durationf = durationf * 100;
	this.startType = startType;
	this.endType = endType;
	this.time = 0;
}

Timeline.prototype.addTimelineEffect = function(e)
{
	var that = this;
	e.active = that.active;
	this.effects.push(e);
}

Timeline.prototype.update = function(widget)
{
	if(!this.active)
		return;
	
	var that = this;
	this.time += gameTime / 1000;
	
	_.each(this.effects,
					function(element, index)
					{
						element.update(that, widget);
					}
				);
}

Timeline.prototype.setActive = function(b_timeline)
{
	this.active = b_timeline;
	_.each(this.effects,
					function(element, index)
					{
						element.setActive(b_timeline);
					}
				);
}

//TimelineEffect

var TimelineEffect = function()
{

}

//TimelineEffect_PositionX 

TimelineEffect.prototype.PositionX = function(startXf, endXf, lerpType)
{
	this.startXf = startXf;
	this.endXf = endXf;
	this.distance = this.endXf - this.startXf;
	this.currentXf = 0;
	this.lerpType = lerpType;
	this.active;
}

var count = 0;

TimelineEffect.prototype.PositionX.prototype.update = function(parent, widget)
{
	var that = this;
	
	if(!this.active)
		return;
	
	if(this.lerpType == E_LerpType.Smooth || this.lerpType == E_LerpType.Smoother)
	{
		var d_x = (this.distance - this.currentXf) / (parent.durationf);
		
		this.currentXf += d_x;
		
		if(Math.abs(d_x) < .001)
		{
			d_x = this.distance - this.currentXf;
			this.active = false;
		}
		
		widget.addPositionX(d_x);
	}
}

//TimelineEffect_PositionY
TimelineEffect.prototype.PositionY = function(startYf, endYf, lerpType)
{
	this.startYf = startYf;
	this.endYf = endYf;
	this.distance = this.endYf - this.startYf;
	this.currentYf = 0;
	this.lerpType = lerpType;
	this.active;
}

TimelineEffect.prototype.PositionY.prototype.update = function(parent, widget)
{
	var that = this;
	
	if(!this.active)
		return;
	
	if(this.lerpType == E_LerpType.Smooth || this.lerpType == E_LerpType.Smoother)
	{
		var d_y = (this.distance - this.currentYf) / (parent.durationf);
		
		this.currentYf += d_y;
		
		if(d_y < .001)
		{
			d_y = this.distance - this.currentYf;
			this.active = false;
		}
		
		widget.addPositionY(d_y);
	}
}

//TimelineEffect_PositionZ
TimelineEffect.prototype.PositionZ = function(startZf, endZf, lerpType)
{
	this.startZf = startZf;
	this.endZf = endZf;
	this.distance = this.endZf - this.startZf;
	this.currentZf = 0;
	this.lerpType = lerpType;
	this.active;
}

TimelineEffect.prototype.PositionZ.prototype.update = function(parent, widget)
{
	var that = this;
	
	if(!this.active)
		return;
	
	if(this.lerpType == E_LerpType.Smooth || this.lerpType == E_LerpType.Smoother)
	{
		var d_z = (this.distance - this.currentZf) / (parent.durationf);
		
		this.currentZf += d_z;
		
		if(d_z < .001)
		{
			d_z = this.distance - this.currentZf;
			this.active = false;
		}
		
		widget.addPositionZ(d_z);
	}
}

//------------------------------
// TIMELINE ENUMS
//------------------------------

var E_StartType =
{
	Stop: 0,
	Start: 1,
	Count: 2,
};

var E_EndType =
{
	Bounce: 0,
	Loop: 1,
	Stop: 3,
	Count: 4,
	Sin: 5,
};

var E_LerpType =
{
	Smooth: 0,
	Smoother: 1,
	Linear: 2,
};