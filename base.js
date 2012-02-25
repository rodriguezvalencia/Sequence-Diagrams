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
	canvas.addEventListener('dblclick', moveDblClick,false);
	cleanup = function() {
		canvas.removeEventListener('mousedown', moveDown, false);
		canvas.removeEventListener('mousemove', moveMove, false);
		canvas.removeEventListener('mouseup', moveUp, false);
		canvas.removeEventListener('dblclick', moveDblClick,false);
		cleanSelected();
	};
}

moving = null;

function moveDown(event) {
	event = event || window.event;
   	var x = event.pageX - canvas.offsetLeft;
    var y = event.pageY - canvas.offsetLeft;

    selectOne(x,y);
	reDraw();
}

function selectOne(x,y) {
	for (var i=0; i<dragSquares.length; i++) {
    	var dragSq = dragSquares[i];
    	if (dragSq.handleClick(x,y)) {
    		moving = dragSq;
    	}	
    }
    if (moving == null) {
    	cleanDrag();
    }
	for (var i=0; i<arrows.length; i++){
		var arrow = arrows[i];
		if (arrow.handleClick(x,y) && moving==null) {
			moving = arrow;
		}
	}
	
	for (var i=0; i<lifeLines.length; i++){
		var ll = lifeLines[i];
		if (ll.handleClick(x,y) && moving==null) {
			moving = ll;
		}
	}	
	return moving;
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

function moveUp(event) {
	if (moving != null) {
		event = event || window.event;
    	x = event.pageX - canvas.offsetLeft;
    	y = event.pageY - canvas.offsetLeft;
		moving.handleUp(x, y);
	}	
	moving = null;
	reDraw();
}

function moveDblClick(event) {
	event = event || window.event;
   	x = event.pageX - canvas.offsetLeft;
    y = event.pageY - canvas.offsetLeft;
    var dblClicked = selectOne(x,y);
    if (dblClicked && dblClicked.hasOwnProperty('setLabel')) {
		$.prompt(txt,{
			loaded: function() {
					document.getElementById("alertName").focus();			
				},
			submit: function(v,m,f) {
					lbl = document.getElementById("alertName").value;
				    dblClicked.setLabel(lbl);
					reDraw();
				},
			buttons: { Ok:true },
			overlayspeed: 'fast'
		});				
    }
    moving = null;
}

