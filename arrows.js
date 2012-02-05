function Arrow(start,end, y){
	var s = start;
	var e = end;
	var h = (y<MARGIN_TOP+TEXTBOX_HEIGHT)?MARGIN_TOP+TEXTBOX_HEIGHT+10:y;

	this.draw = function() {
		ctx.beginPath();
		var p = (e.x()>s.x())?10:-10;
		ctx.moveTo(s.x()+s.w()/2, h);
		ctx.lineTo(e.x()+e.w()/2, h);
		ctx.lineTo(e.x()+e.w()/2-p, h-6);
		ctx.lineTo(e.x()+e.w()/2-p, h+6);
		ctx.lineTo(e.x()+e.w()/2, h);
		ctx.fill();	
		ctx.stroke();
	}
}

var arrowStart = null;

function drawArrowDown(event) {
	event = event || window.event;
    x = event.pageX - canvas.offsetLeft;
    y = event.pageY - canvas.offsetLeft;
	
	var clickedLifeLine = null;
	for (var i=0; i<lifeLines.length; i++){
		var ll = lifeLines[i];
		if (ll.pointInside(x, y)) {
			clickedLifeLine = ll;
		}
	}
	if (clickedLifeLine != null) {
	    if (arrowStart == null) {
	    	arrowStart = clickedLifeLine;
	    } else {	
	    	var arrow = new Arrow(arrowStart, clickedLifeLine, y);
	    	arrows.push(arrow);
	    	arrowStart = null;
	    }
	}
	
    reDraw();
}

function drawArrowMove(event){
	event = event || window.event;
    x = event.pageX - canvas.offsetLeft;
    y = event.pageY - canvas.offsetLeft;
	if (arrowStart != null){
		reDraw();
		var tempArrow = new Arrow(arrowStart, 
			new LifeLine(x - TEXTBOX_WIDTH/2), y);
		tempArrow.draw();
	}
}

function drawArrow() {
	cleanup();
	document.addEventListener('mousedown', drawArrowDown, false);
	document.addEventListener('mousemove', drawArrowMove, false);
	cleanup = function() {
		document.removeEventListener('mousedown', drawArrowDown, false);
		document.removeEventListener('mousemove', drawArrowMove, false);
	};
}