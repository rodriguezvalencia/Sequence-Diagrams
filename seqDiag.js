var canvas;
var ctx;

var MARGIN_TOP = 50;

var DEFAULT_LIFE_LINE_HEIGHT = 300;
var lifeLineHeights = DEFAULT_LIFE_LINE_HEIGHT;

var TEXTBOX_HEIGHT = 50;
var TEXTBOX_WIDTH = 100

var lifeLines = [];
var arrows = [];

var createLifeLineFlag = true;

function startGame() {
	canvas = document.getElementById('diagram');
	ctx = canvas.getContext('2d');

	cleanup();
}

var dragging = false;

function lifeLineMouseMove(event) {
	if (dragging) {
		event = event || window.event;
	    x = event.pageX - canvas.offsetLeft;
	    y = event.pageY - canvas.offsetLeft;
	    for (var i=0; i<lifeLines.length; i++){
			var ll = lifeLines[i];
			ll.handleMove(x,y);
		}
	}
	reDraw();
} 

function reDraw() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	for (var i=0; i<lifeLines.length; i++){
		var ll = lifeLines[i];
		ll.draw();
	}
	for (var i=0; i<arrows.length; i++){
		var a = arrows[i];
		a.draw();
	}
}

function lifeLineMouseDown(event) {
	dragging = true;
	event = event || window.event;
    x = event.pageX - canvas.offsetLeft;
    y = event.pageY - canvas.offsetLeft;
	if (createLifeLineFlag){
		newLifeLine(x);
	} else {
		for (var i=0; i<lifeLines.length; i++){
			var ll = lifeLines[i];
			ll.handleClick(x,y);
		}
	}
	reDraw();
}

function move() {
	createLifeLineFlag = !createLifeLineFlag;
	drawLifeLine();
}

function newLifeLine(x) {
	var lifeLine = new LifeLine(x);
	lifeLines.push(lifeLine);
	lifeLine.draw();
}

function LifeLine(x){
	var x = x;
	var y = MARGIN_TOP;
	var w = TEXTBOX_WIDTH;
	var h = TEXTBOX_HEIGHT;
	var selected = false;
	
	this.draw = function() {
		ctx.strokeRect(x, y, w, h);
		ctx.beginPath();
		ctx.moveTo(x+w/2, y+h);
		ctx.lineTo(x+w/2, lifeLineHeights);
		ctx.stroke();
		if (selected) {
			this.paintSelect();
		}
	}

	this.paintSelect = function() {
		ctx.fillRect(x-12, y-12, 10, 10);
		ctx.fillRect(x-12, lifeLineHeights+1, 10, 10);
		ctx.fillRect(x+1+w, y-12, 10, 10);
		ctx.fillRect(x+1+w, lifeLineHeights+1, 10, 10);
	}

	this.handleClick = function(xClick, yClick){
		selected = (xClick>=x && xClick<=x+w) && (yClick>=y && yClick<=y+h);
		moveOffset = xClick - x;
	}

	var moveOffset = 0;

	this.handleMove = function(xMove, yMove) {
		if (selected) {
			x = xMove - moveOffset;
		}
	}

	this.pointInside = function (px, py){
		return (px>=x) && (px<=x+w) && 
			(py>=y) && (py<=y+h+lifeLineHeights);
	}

	this.x = function() { return x; }
	this.w = function() { return w; }
}

function lifeLineMouseUp(event){
	for (var i=0; i<lifeLines.length; i++){
		var ll = lifeLines[i];
	}
	dragging = false;
	reDraw();
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

function drawLifeLine() {
	cleanup();
	document.addEventListener('mousedown', lifeLineMouseDown, false);
	document.addEventListener('mouseup', lifeLineMouseUp, false);
	document.addEventListener('mousemove', lifeLineMouseMove, false);	
	cleanup = function() {
		document.removeEventListener('mousedown', lifeLineMouseDown, false);
		document.removeEventListener('mouseup', lifeLineMouseUp, false);
		document.removeEventListener('mousemove', lifeLineMouseMove, false);
	}
}

var cleanup = function() {}


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