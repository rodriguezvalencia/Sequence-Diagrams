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
		return selected;
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
	event = event || window.event;
    x = event.pageX - canvas.offsetLeft;
    y = event.pageY - canvas.offsetLeft;
	newLifeLine(x);
	reDraw();
}

function newLifeLine(x) {
	var lifeLine = new LifeLine(Math.max(0, x-TEXTBOX_WIDTH/2));
	lifeLines.push(lifeLine);
	lifeLine.draw();
}

function drawLifeLine() {
	cleanup();
	document.addEventListener('mousedown', lifeLineMouseDown, false);
	cleanup = function() {
		document.removeEventListener('mousedown', lifeLineMouseDown, false);
	}
}