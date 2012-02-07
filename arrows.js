var SELF_ARROW_WIDTH = 50;
var SELF_ARROW_HEIGHT = 30;

function Arrow(start,end, y){
	var s = start;
	var e = end;
	var h = (y<MARGIN_TOP+TEXTBOX_HEIGHT)?MARGIN_TOP+TEXTBOX_HEIGHT+10:y;
	var selected = false;

	this.draw = function() {
		ctx.beginPath();
		var p = (e.x()>s.x())?10:-10;
		if (selected){
			ctx.lineWidth = 2;
   			ctx.strokeStyle = "#ff0000";
   			ctx.fillStyle = "#ff0000";
   		}
		ctx.moveTo(s.x()+s.w()/2, h);
   		if (start != end) {
			ctx.lineTo(e.x()+e.w()/2, h);
			ctx.lineTo(e.x()+e.w()/2-p, h-6);
			ctx.lineTo(e.x()+e.w()/2-p, h+6);
			ctx.lineTo(e.x()+e.w()/2, h);
			ctx.stroke();
		} else {
			ctx.lineTo(s.x()+s.w()/2+SELF_ARROW_WIDTH, h);	
			ctx.lineTo(s.x()+s.w()/2+SELF_ARROW_WIDTH, h+SELF_ARROW_HEIGHT);	
			ctx.lineTo(s.x()+s.w()/2, h+SELF_ARROW_HEIGHT);	
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(s.x()+s.w()/2-p, h-6+SELF_ARROW_HEIGHT);
			ctx.lineTo(s.x()+s.w()/2-p, h+6+SELF_ARROW_HEIGHT);
			ctx.lineTo(s.x()+s.w()/2, h+SELF_ARROW_HEIGHT);		
		}
		ctx.fill();	
		ctx.lineWidth = 1;
   		ctx.strokeStyle = "#000000";
   		ctx.fillStyle = "#000000";
	}

	var offset = 0;
	this.handleClick = function(xClick,yClick){
		// w is the rightmost x coord value of the arrow, not the width
		selected = (xClick>=this.x() && xClick<=this.w()) && (yClick>=this.y() && yClick<=this.y()+this.h());
		console.log("xClick " + xClick);
		console.log("yClick " + yClick);
		console.log("x " + this.x());
		console.log("w " + this.w());
		console.log("y " + this.y());
		console.log("h " + this.h());
		console.log("*****************");
		offset = y - yClick;
		return selected;
	}

	this.handleMove = function(xMove, yMove) {
		if (selected) {
			h = (yMove<MARGIN_TOP+TEXTBOX_HEIGHT)?MARGIN_TOP+TEXTBOX_HEIGHT+10:yMove;
			h = h+offset;
		}
	}

	this.x = function() {
		return (s.x()<=e.x())?s.x()+s.w()/2:e.x()+e.w()/2;
	}

	this.w = function() {
		if (s == e) {
			return s.x()+s.w()/2 + SELF_ARROW_WIDTH;
		} else {
			return (s.x()>=e.x())?s.x()+s.w()/2:e.x()+e.w()/2;		
		}
	}

	this.y = function() {
		if (s == e) {
			return h;
		} else {
			return h-8;
		}
	}

	this.h = function() {
		if (s == e) {
			return SELF_ARROW_HEIGHT;
		} else {
			return 16;
		}
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

var dragging = false;

function drawArrowMove(event){
	event = event || window.event;
    x = event.pageX - canvas.offsetLeft;
    y = event.pageY - canvas.offsetLeft;
	if (arrowStart != null){
		reDraw();
		var tempArrow = null;
		for (var i=0; i<lifeLines.length; i++){
			var ll = lifeLines[i];
			if (ll.pointInside(x, y)) {
				tempArrow = new Arrow(arrowStart, ll, y);
			}
		}
		if (tempArrow == null) {
			tempArrow = new Arrow(arrowStart, 
			new LifeLine(x - TEXTBOX_WIDTH/2), y);
		}
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