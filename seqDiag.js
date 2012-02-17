var canvas;
var ctx;

var MARGIN_TOP = 50;

var DEFAULT_LIFE_LINE_HEIGHT = 300;
var lifeLineHeights = DEFAULT_LIFE_LINE_HEIGHT;

var TEXTBOX_HEIGHT = 50;
var TEXTBOX_WIDTH = 100

var lifeLines = [];
var arrows = [];

function startGame() {
	console.log("Starting...");
	canvas = document.getElementById('diagram');
	ctx = canvas.getContext('2d');
	document.addEventListener('mousedown', cleanup, false);
	cleanup();
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
	drawActivationBoxes();
}

var cleanup = function() {
/*	for (var i = lifeLines.length - 1; i >= 0; i--) {
		lifeLines[i].deselect();
	};

	for (var i = arrows.length - 1; i >= 0; i--) {
		arrows[i].deselect();
	}; */
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




