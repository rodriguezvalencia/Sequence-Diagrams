var SELF_ARROW_WIDTH = 50;
var SELF_ARROW_HEIGHT = 30;

function Arrow(start,end, y, lbl){
	var s = start;
	var e = end;
	var h = (y<MARGIN_TOP+TEXTBOX_HEIGHT)?MARGIN_TOP+TEXTBOX_HEIGHT+10:y;
	var selected = false;
	var lbl = lbl;

	this.draw = function() {
		ctx.beginPath();
		var p = (e.x()<s.x());
		ctx.moveTo(s.x()+s.w()/2, h);
   		if (start != end) {
			ctx.lineTo(e.x()+e.w()/2, h);
			ctx.stroke();		
			drawTriangle(e.x()+e.w()/2,h,p);
		} else {
			ctx.lineTo(s.x()+s.w()/2+SELF_ARROW_WIDTH, h);	
			ctx.lineTo(s.x()+s.w()/2+SELF_ARROW_WIDTH, h+SELF_ARROW_HEIGHT);	
			ctx.lineTo(s.x()+s.w()/2, h+SELF_ARROW_HEIGHT);	
			ctx.stroke();
			drawTriangle(e.x()+e.w()/2,h+SELF_ARROW_HEIGHT,true);
		}
		if (lbl != undefined) {
			ctx.fillText(lbl, this.getCenter() - ctx.measureText(lbl).width/2, h-3);
		}
	}

	this.getCenter = function() {
		min = Math.min(s.center(), e.center());
		max = Math.max(s.center(), e.center());
		return min + (max - min)/2;
	}

	var offset = 0;
	this.handleClick = function(xClick,yClick){
		// w is the rightmost x coord value of the arrow, not the width
		selected = (xClick>=this.x() && xClick<=this.w()) && (yClick>=this.y() && yClick<=this.y()+this.h());
		offset = this.realY() - yClick;
		if (selected) {
			this.createDragSquares();
		}
		return selected;
	}

	this.createDragSquares = function() {
		dragSquares = [];
		dragSquares[0] = new DragSquare(s.center(), h, -1, this, s, function (start) {s = start;});
		dragSquares[1] = new DragSquare(e.center(), h, -1, this, e, function (end) {e = end;});
	}

	this.handleMove = function(xMove, yMove) {
		if (selected) {
			h = (yMove<MARGIN_TOP+TEXTBOX_HEIGHT)?MARGIN_TOP+TEXTBOX_HEIGHT+10:yMove;
			h = h - offset;
			handleLifeLineHeights((s!=e)?h:h+SELF_ARROW_HEIGHT);
		}
		this.createDragSquares();
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

	this.realY = function() {
		return h;
	}

	this.h = function() {
		if (s == e) {
			return SELF_ARROW_HEIGHT;
		} else {
			return 16;
		}
	}

	this.s = function() {return s}
	this.e = function() {return e}
	this.lbl = function() {return lbl}
	this.setLabel = function(label) { lbl = label; }

	this.hasRightDir = function() {return s.x()<e.x()}
	this.hasLeftDir = function() {return s.x()>e.x()}

	this.deselect = function () {selected = false;}

	this.handleUp = function(xClick, yClick) {
	}

	function prompt(theArrow) {
		$.prompt(txt,{
			loaded: function() {
				document.getElementById("alertName").focus();			
			},
			submit: function(v,m,f) {
				lbl = document.getElementById("alertName").value;
				theArrow.setLabel(lbl);
				reDraw();
				drawActivationBoxes();
			},
				buttons: { Ok:true },
				overlayspeed: 'fast'	
		});
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
	    	arrow = new Arrow(arrowStart, clickedLifeLine, y);
	    	arrows.push(arrow);
	    	reDraw();
			drawActivationBoxes();
			arrowStart = null;
			if (namePromptsActive()) {
				prompt(this);
			} else {
				reDraw();
				drawActivationBoxes();
			}	
	    }
	}
}

function drawTriangle(x, y, left, optional){
	var p = (left)?-10:10;
	ctx.clearRect(x-p,y-6,p,12);
	ctx.beginPath();
	ctx.lineTo(x-p, y-6);
	ctx.lineTo(x-p, y+6);
	ctx.lineTo(x, y);
	ctx.fill();
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
				handleLifeLineHeights((arrowStart!=ll)?y:y+SELF_ARROW_HEIGHT);
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
	canvas.addEventListener('mousedown', drawArrowDown, false);
	canvas.addEventListener('mousemove', drawArrowMove, false);
	cleanup = function() {
		canvas.removeEventListener('mousedown', drawArrowDown, false);
		canvas.removeEventListener('mousemove', drawArrowMove, false);
	};
}

function handleLifeLineHeights(h){
	if (h>lifeLineHeights) {
		lifeLineHeights = h;
	}
}