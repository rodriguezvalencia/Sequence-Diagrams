function LifeLine(x, lbl){
	var x = x;
	var y = MARGIN_TOP;
	var w = TEXTBOX_WIDTH;
	var h = TEXTBOX_HEIGHT;
	var selected;
	var lbl = lbl;
	
	this.draw = function() {
		ctx.strokeRect(x, y, w, h);
		ctx.beginPath();
		ctx.moveTo(x+w/2, y+h);
		ctx.lineTo(x+w/2, lifeLineHeights);
		ctx.stroke();
		if (selected) {
			this.paintSelect();
		}
		if (lbl != undefined) {
			ctx.fillText(lbl, this.center() - ctx.measureText(lbl).width/2, y + TEXTBOX_HEIGHT/2);
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
		console.log(selected);
		moveOffset = xClick - x;
		return selected;
	}

	var moveOffset = 0;

	this.handleMove = function(xMove, yMove) {
		console.log("Moving this" + selected);
		if (selected) {
			console.log("hello");
			x = xMove - moveOffset;
		}
	}

	this.pointInside = function (px, py){
		return (px>=x) && (px<=x+w) && 
			(py>=y) && (py<=y+h+lifeLineHeights);
	}

	this.x = function() { return x; }
	this.w = function() { return w; }

	this.center = function() {
		return x + w/2;
	}

	this.deselect = function () {selected = false;}
	this.setLabel = function(label) { 
		lbl = label; 
		w = Math.max(w, ctx.measureText(lbl).width+6);
	}
}

var creating = false;

function lifeLineMouseDown(event) {
	if (!creating) {
		event = event || window.event;
	    x = event.pageX - canvas.offsetLeft;
	    y = event.pageY - canvas.offsetLeft;
		newLifeLine(x);
		reDraw();
	}
}

function newLifeLine(x) {
	creating = true;
	var lifeLine = new LifeLine(Math.max(0, x-TEXTBOX_WIDTH/2));
	lifeLines.push(lifeLine);
	$.prompt(txt,{
		loaded: function() {
				document.getElementById("alertName").focus();			
			},
		submit: function(v,m,f) {
				lbl = document.getElementById("alertName").value;
			    lifeLine.setLabel(lbl);
				reDraw();
				creating = false;
			},
		buttons: { Ok:true },
		overlayspeed: 'fast'
	});	
	lifeLine.draw();
}

function drawLifeLine() {
	cleanup();
	canvas.addEventListener('mousedown', lifeLineMouseDown, false);
	cleanup = function() {
		canvas.removeEventListener('mousedown', lifeLineMouseDown, false);
	}
}