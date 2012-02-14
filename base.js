function deleteElement() {
	cleanup();
	document.addEventListener('click', tryDelete, false);
	cleanup = function() {
		document.removeEventListener('click', tryDelete, false);
	};
}

function move() {
	cleanup();
	document.addEventListener('mousedown', moveDown, false);
	document.addEventListener('mousemove', moveMove, false);
	document.addEventListener('mouseup', moveUp, false);
	cleanup = function() {
		document.removeEventListener('mousedown', moveDown, false);
		document.removeEventListener('mousemove', moveMove, false);
		document.removeEventListener('mouseup', moveUp, false);
	};
}

var moving = null;

function moveDown(event) {
	event = event || window.event;
   	var x = event.pageX - canvas.offsetLeft;
    var y = event.pageY - canvas.offsetLeft;
    // deselect previous
    if (moving != null) {
    	moving.selected = false;
	}

	for (var i=0; i<arrows.length; i++){
		var arrow = arrows[i];
		if (arrow.handleClick(x,y)) {
			moving = arrow;
		}
	}
	if (moving == null) {
		for (var i=0; i<lifeLines.length; i++){
			var ll = lifeLines[i];
			if (ll.handleClick(x,y)) {
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