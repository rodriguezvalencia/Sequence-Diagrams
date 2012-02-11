var sortedArrows = [];
var activationBoxes = [];

function drawActivationBoxes(){
	activationBoxes = [];
	var sortedLifeLines = lifeLines.sort(function(x, y){return x.x()-y.x()})
	sortedArrows = arrows.sort(function(x,y) { return x.realY()-y.realY() });
	for (var i=0; i<sortedLifeLines.length; i++){
		var ll = sortedLifeLines[i];
		//var actBox;
		for (var j=0; j<sortedArrows.length; j++) {
			var a = sortedArrows[j];
			if (arrowIn(ll, a)){
				// create a new actBox
				//actBox = (new ActivationBox(ll, a.realY(), 10));
				activationBoxes.push(new ActivationBox(ll, a.realY(), 10));
			} else if (arrowOut(ll, a)){
				// set actBox h and push
				//actBox.setH(a.realY()-actBox.y());
				//activationBoxes.push(actBox);
				if (activationBoxes.length>0) {
					activationBoxes[activationBoxes.length-1].setH(a.realY()-activationBoxes[activationBoxes.length-1].y());
				}
			}
		}
	}

	for (var j=0; j<activationBoxes.length; j++){
		ctx.strokeRect( activationBoxes[j].ll().center()-3, 
						activationBoxes[j].y()-10, 
						6, 
						Math.max(20,activationBoxes[j].h()+20));
	}
}

function ActivationBox(lifeLine, yCoord, height) {
	var ll = lifeLine;
	var y = yCoord;
	var h = height;

	this.ll = function() {return ll}
	this.y = function() {return y}
	this.h = function() {return h}

	this.setH = function(newH) {h = newH}
}

function arrowIn(ll,a) {
	return ((a.e() == ll) && a.hasRightDir());
}

function arrowOut(ll,a) {
	return ((a.s() == ll) && a.hasLeftDir());
}