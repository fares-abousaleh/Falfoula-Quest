
function rnd(a,b){
	if(a==undefined)return rnd(0,1)
	if(b==undefined)return rnd(-a,a)
	return a+ (b-a) * Math.random()
}

function rndInt(a,b){
	return Math.floor(rnd(a,b))
}

function sat(v,a,b){
	return (v<=a)?a:(v>=b)?b:v
}

function saveStr(str,filename) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    var file = new Blob([str], {type: "text/plain"});
    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();
}