function DragSquare(x, y, f, a, original, arrowEnd) {
	var x = x;
	var y = y;
	var drag = f;
	var arrow = a;
	var arrowEndSetter = arrowEnd;
	var o = original;

	this.x = function() {return x}
	this.y = function() {return y}

	this.draw = function() {
		ctx.fillRect(x-5, y-5, 10, 10);
	}

	this.handleClick = function(xClick,yClick) {
		selected = x <= xClick && x+10 >= xClick && y <= yClick && y+10 >= yClick;
		if (selected) {
			arrow.deselect();
		}
		return selected;
	}

	this.handleMove = function(xClick,yClick) {
		x = xClick;
		for (var i=0; i<lifeLines.length; i++){
			var ll = lifeLines[i];
			if (ll.pointInside(xClick, yClick)) {
				arrowEndSetter(ll);
			}
		}
		arrowEndSetter(new LifeLine(xClick-TEXTBOX_WIDTH/2, y));
		reDraw();
	}

	this.handleUp = function(xClick, yClick) {
		var ll = o;
		for (var i=0; i<lifeLines.length; i++){
			if (lifeLines[i].pointInside(xClick, yClick)) {
				ll = lifeLines[i];
			}
		}
		x = ll.center();
		arrowEndSetter(ll);
		reDraw();
	}
}

function cleanDrag() {
	dragSquares.length = 0;
}