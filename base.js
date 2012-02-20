function deleteElement() {
	cleanup();
	canvas.addEventListener('click', tryDelete, false);
	cleanup = function() {
		canvas.removeEventListener('click', tryDelete, false);
	};
}

function move() {
	cleanup();
	canvas.addEventListener('mousedown', moveDown, false);
	canvas.addEventListener('mousemove', moveMove, false);
	canvas.addEventListener('mouseup', moveUp, false);
	cleanup = function() {
		canvas.removeEventListener('mousedown', moveDown, false);
		canvas.removeEventListener('mousemove', moveMove, false);
		canvas.removeEventListener('mouseup', moveUp, false);
	};
}

var moving = null;

function moveDown(event) {
	event = event || window.event;
   	var x = event.pageX - canvas.offsetLeft;
    var y = event.pageY - canvas.offsetLeft;
    // deselect previous

	for (var i=0; i<arrows.length; i++){
		console.log(1);
		var arrow = arrows[i];
		if (arrow.handleClick(x,y)) {
			console.log(2);
			moving = arrow;
		}
	}
	if (moving == null) {
		console.log(3);
		for (var i=0; i<lifeLines.length; i++){
			var ll = lifeLines[i];
			if (ll.handleClick(x,y)) {
				console.log(4);
				moving = ll;
			}
		}
	}	
	reDraw();
}

function moveMove(event) {	
	if (moving != null) {
		event = event || window.event;
    	x = event.pageX - canvas.offsetLeft;
    	y = event.pageY - canvas.offsetLeft;
		moving.handleMove(x, y);
	}
	reDraw();
}

function moveUp() {
	moving = null;
}

function DragSquare(x, y, f) {
	var x = x;
	var y = y;
	var drag = f;

	this.x = function() {return x}
	this.y = function() {return y}

	this.draw = function() {
		ctx.fillRect(x-5, y-5, 10, 10);
	}
}