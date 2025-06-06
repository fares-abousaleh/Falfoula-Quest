/*****************************************
    Images
 *****************************************/

const Images = {}

 
function drawImage(ctx,imgname,x,y,w,h){
	ctx.drawImage(Images[imgname],x-w/2,y-h/2,w,h)
}

function loadImages(arr){
	const n = arr.length
	let nLoaded = 0
	for(let i in arr){
		const name = arr[i]
		Images[name] = new Image()
		Images[name].onload = () => {
			nLoaded++ 
			console.log("image " + name + " loaded.")
			if( nLoaded == n ){
				Object.freeze(Images)
				console.log("---Images Object is now Freezed!!---")
			}
		}
		Images[name].src = "./assets/"+name+".png"
	}
	
}

/*****************************************
    Sounds
 *****************************************/

const Sounds = {}
const SOUNDCOUNT = 8

function loadSounds(arr){
	const n = arr.length
	let nLoaded = 0
	for(let i in arr){
		const name = arr[i]
		Sounds[name] = []
		for(let i=0;i<SOUNDCOUNT;i++)
		{
			Sounds[name][i] = new Audio()
			Sounds[name][i].onloadeddata  = ()=> {
				nLoaded++
				Sounds[name][i].preservesPitch=false
				Sounds[name][i].playbackRate = 1 + rnd(0.08)
				console.log("sound "+name+" loaded.")
				if(nLoaded==n*SOUNDCOUNT){
					Object.freeze(Sounds)
					console.log("---Sounds Object is now Freezed!!---")
				}
			}
		
		Sounds[name][i].src = "./assets/"+name+".wav"
		}
		Sounds[name][SOUNDCOUNT]=0
	}

}

function playSound(name,vol=1){
	let res = false
	if(Sounds[name]){
		let ctr = Sounds[name][SOUNDCOUNT]
		Sounds[name][ctr].volume = vol
		Sounds[name][ctr].play()
		ctr++
		Sounds[name][SOUNDCOUNT]=(ctr++)%SOUNDCOUNT
	}
}

function stopSound(name){
	if(Sounds[name])
		Sounds[name].pause()
}


const Music = []
let musicPlaying = false
let musicNum = 0

function setMusic(arr){
	const n = arr.length
	let nLoaded = 0
	for(let i in arr){
		const m = new Audio()
		m.onloadeddata = ()=> {
			nLoaded++
			if(nLoaded==n){
				Object.freeze(Music)
			}
		}
		Music[i] = m
		m.src = "./assets/"+arr[i]+".wav"
		m.volume= 0.3
		m.onplay = ()=> {console.log("playMusic:"+musicNum);musicPlaying=true}
		m.onended = ()=> {
			musicNum++
			musicNum %= Music.length
			setTimeout(()=> {if(musicPlaying)Music[musicNum].play()},500)
		}
	}
}

function playMusic(){
	if(Music[musicNum])
		Music[musicNum].play()
	
}

function stopMusic(){
	musicPlaying = false
	for(let i in Music)
		Music[i].pause()
}




/*****************************************
    Sprites
 *****************************************/
 
let ViewX = 0
let ViewY = 0

class Sprite{
	
	constructor(defaultImage){
		this.x = 0
		this.y = 0
		this.vx = 0
		this.vy = 0
		this.width = 32
		this.height = 32
		this.state = defaultImage || ""
	}
	
	draw(ctx){
		ctx.save()
		ctx.translate(-ViewX,-ViewY)
		drawImage(ctx,this.state,this.x,this.y,this.width,this.height)
		ctx.restore()
	}
	
	drawRot(ctx,th){
		ctx.save()
		ctx.translate(this.x-ViewX,this.y-ViewY )
		ctx.rotate(th)
		ctx.drawImage(Images[this.state],-this.width/2,-this.height/2,this.width,this.height)
		ctx.restore()
	}
	
	update(dt){
		this.x += this.vx * dt
		this.y += this.vy * dt
	}
	
	
}

function dist(a,b){
	const dx = a.x-b.x
	const dy = a.y-b.y
	return Math.pow(dx*dx+dy*dy,0.5)
}

function checkCollision(a, b, d) {
	if(d==undefined)d=(a.width+b.width)/2
  return ( dist(a,b) < d )
}

function checkCollisionBox(a,b){
	const aw = a.width/2
	const ah = a.height/2
	const bw = b.width/2
	const bh = b.height/2
	return !( 
	               (a.x-aw >= b.x+bw)   //  b|a
	            || (a.x+aw <= b.x-bw)   //  a|b
	            || (a.y+ah <= b.y-bh)   //  a/b
	            || (a.y-ah >= b.y+bh)   //  a\b
				)
}

function adjustView(sp){
		if(sp.x>ViewX + ww-100)ViewX = sp.x + 100 - ww
		if(sp.x<ViewX+100)ViewX = sp.x - 100
		ViewX = sat(ViewX,0,WW-ww)
		
		if(sp.y>ViewY + hh -100)ViewY = sp.y + 100 -hh
		if(sp.y<ViewY+100)ViewY = sp.y - 100
		ViewY = sat(ViewY,0,HH-hh)
	}


function updatePos(sp,boxes_){
		
		let newx = sp.x+dt*sp.vx
		let newy = sp.y+dt*sp.vy
		const rh ={x:newx,y:sp.y,width:sp.width,height:sp.height}
		const rv ={x:sp.x,y:newy,width:sp.width,height:sp.height}
		
		const  sx = Math.sign(sp.vx)
		const  sy = Math.sign(sp.vy)
		const  eps = 0
		let result = false
		
		//-- collisions with blocks
		for(let i in boxes_)
		for(let j in boxes_[i])
		{
			
			let c = boxes_[i][j]
			
			if((c.number!=undefined)&&(sp.number!=undefined)){
			 result |= (dist(c,sp)<= 95)
			if(c.number%sp.number==0)continue
			 
			}
			
		    if((sx!=0)&&checkCollisionBox(rh,c)){ 
					rh.x = c.x-sx*(eps+(c.width+sp.width)/2)
					 
			}else
			if((sy!=0)&&checkCollisionBox(rv,c)){
				rv.y = c.y-sy*(eps+(c.height+sp.height)/2)
				 
			}
		}
		 
					
		sp.x= rh.x
		sp.y= rv.y
		const w = sp.width/2
		const h = sp.height/2
		if(sp.y<h)sp.vy=0
		sp.x = sat(sp.x,w, WW-w)
		sp.y = sat(sp.y,h, HH-h)
		 
		return result
	}
	
	
function removeSp(arr,sp){
	for(let i in arr)
				if(arr[i]===sp){
					arr.splice(i,1)
					console.log("remove:",i)
					return
				}
}