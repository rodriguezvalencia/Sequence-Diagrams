var canvas;
var ctx;

var MARGIN_TOP = 50;

var DEFAULT_LIFE_LINE_HEIGHT = 300;
var lifeLineHeights = DEFAULT_LIFE_LINE_HEIGHT;

var TEXTBOX_HEIGHT = 50;
var TEXTBOX_WIDTH = 100

var lifeLines = [];
var arrows = [];
var dragSquares = [];

function startGame() {
	console.log("Starting...");
	canvas = document.getElementById('diagram');
	buttons=document.getElementsByTagName('buttons').clientHeight;
	console.log(buttons);
	//set canvas size to the whole window 
	canvas.width=window.innerWidth;
	canvas.height=window.innerHeight-100;
	console.log("Got a " + canvas.width + "x" + canvas.height + " canvas");
	ctx = canvas.getContext('2d');
	ctx.font = "10pt sans-serif";
}

function reDraw() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	for (var i=0; i<lifeLines.length; i++){
		lifeLines[i].draw();
	}
	for (var i=0; i<arrows.length; i++){
		arrows[i].draw();
	}
	drawActivationBoxes();
	for (var i=0; i<dragSquares.length; i++){
		dragSquares[i].draw();
	}
}

var cleanup = function() {
}

var tryDelete = function(event) {
	event = event || window.event;
    x = event.pageX - canvas.offsetLeft;
    y = event.pageY - canvas.offsetLeft;

    var success = false;

    for(var i=0; i<arrows.length; i++){
    	var a = arrows[i];
    	if (a.handleClick(x,y)) {
    		success = true;
    		if (confirm("Do you really want to delete this arrow?")){
    			arrows.splice(i,1);
    		}
    	}
    }

    if (!success) {
    	for (var j=0; j<lifeLines.length; j++) {
	    	var ll = lifeLines[j];
	    	if (ll.handleClick(x,y)) {
	    		success = true;
	    		if (confirm("Do you really want to delete this lifeline?")){
	    			for (var k=0; k<arrows.length; k++) {
	    				if (arrows[k].e() == ll || arrows[k].s() == ll) {
	    					arrows.splice(k,1);
	    					k--;
	    				}
	    			}
	    			lifeLines.splice(j,1);
	    		}
	    	}
    	}
    }
    reDraw();
}

function namePromptsActive() {;
	return document.getElementById("check").checked;
}

function cleanSelected() {
	for (var i = 0; i<lifeLines.length; i++) {
		lifeLines[i].handleClick(-100,-100);
	};
	for (var i = 0; i<arrows.length; i++) {
		arrows[i].handleClick(-100,-100);
	}; 
	cleanDrag();
	reDraw();
}


function saveDiagram() {
	Canvas2Image.saveAsPNG(canvas);
}


