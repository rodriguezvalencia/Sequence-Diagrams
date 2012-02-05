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

function newLifeLine(x) {
	var lifeLine = new LifeLine(x);
	lifeLines.push(lifeLine);
	lifeLine.draw();
}

function lifeLineMouseUp(event){
	for (var i=0; i<lifeLines.length; i++){
		var ll = lifeLines[i];
	}
	dragging = false;
	reDraw();
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