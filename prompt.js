var txt = 'Please introduce label:<br /> '+
	'<input type="text" id="alertName" '+
	'name="myname" value="" />';

function mysubmitfunc(v,m,f){
	an = document.getElementById("alertName").value;
	console.log("Submit function called " + an);
	if(f.alertName == ""){
		an.css("border","solid #ff0000 1px");
		return false;
	}
	return an;
}

