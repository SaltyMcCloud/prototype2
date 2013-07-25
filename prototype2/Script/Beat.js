var Beat = function(bpm)
{
	this.bpm = bpm;
};

Beat.prototype.toBeatTime = function(t)
{
	return t * this.bpm / 60.0;
};

Beat.prototype.toBeat = function(t)
{
	return 1.0 - Math.abs(Math.sin(this.toBeatTime(t) * PI));
};