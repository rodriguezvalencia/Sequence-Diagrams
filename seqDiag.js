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

function move() {
	createLifeLineFlag = !createLifeLineFlag;
	drawLifeLine();
}

var cleanup = function() {}




