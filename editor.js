 

const blsz = 32
const Nx = WW / blsz
const Ny = HH / blsz

var arr 

function draw(){
	
	ctx.drawImage(Images["bk"],-ViewX,-ViewY,WW,HH)
	boxes.length=0
	for(let y = 0 ;y<Ny;y++)
	for(let x = 0 ;x<Nx;x++)
		if(arr[y][x]){
			const b= new Box()
			b.x = x*blsz + blsz/2
			b.y = y*blsz + blsz/2
			b.width = blsz
			b.height = blsz
			boxes.push(b)
		}
	boxes.forEach(b=>b.draw(ctx))
	belts.forEach(b=>b.draw(ctx))
	doors.forEach(b=>b.draw(ctx))
	doorkeys.forEach(b=>b.draw(ctx))
	numbers.forEach(b=>b.draw(ctx))
	filters.forEach(b=>b.draw(ctx))
	bombs.forEach(b=>b.draw(ctx))
	waters.forEach(b=>b.draw(ctx))
	seeds.forEach(b=>b.draw(ctx))
	enemies.forEach(b=>{
			if(b.vx<0)b.state = "enemyLeft"
			b.draw(ctx)
			})
	player.draw(ctx)
}

window.onmousedown = mouseHandler
window.onmousemove = mouseHandler
const Mouse = {x:0,y:0}

function mouseHandler(e){
	
	if(e.shiftKey){
		let x = e.x - canvas.getBoundingClientRect().x
		let y = e.y - canvas.getBoundingClientRect().y
		
		if(x>ww*0.66)ViewX+=ww*0.02
		else
		if(x<ww*0.33)ViewX-=ww*0.02
		
		if(y>hh*0.66)ViewY+=hh*0.02
		else
		if(y<hh*0.33)ViewY-=hh*0.02
		
		ViewX = sat(ViewX,0,WW-ww)
		ViewY = sat(ViewY,0,HH-hh)
			draw()
	
		return
	}
	
	let x = ViewX + e.x - canvas.getBoundingClientRect().x
	let y = ViewY + e.y - canvas.getBoundingClientRect().y
	x = Math.floor(x/blsz)
	y = Math.floor(y/blsz)
	
	if(x<0||x>=Nx||y<0||y>=Ny)return
	
	Mouse.x=x
	Mouse.y=y
	
	if(e.buttons>0){
		arr[y][x]=!e.ctrlKey
		draw()
	}
	
	
	// console.log(x)
	// console.log(y)
	
}
function getAtPos(B,xx,yy){
			for(let i in B){
				const b = B[i]
				const o = {x:xx,y:yy,width:32,height:32}
				if(checkCollisionBox(b,o)){
					return b
				}
			}
			return undefined
}

function removeAtPos(B,xx,yy){
			for(let i in B){
				const b = B[i]
				const o = {x:xx,y:yy,width:32,height:32}
				if(checkCollisionBox(b,o)){
					B.splice(i,1)
					//return 
				}
			}
}

window.onkeydown = function(e){
	let xx = Mouse.x * blsz + blsz/2
	let yy = Mouse.y * blsz + blsz/2
	switch(e.key){
		
		case 's':
			let s = "LEVELS[0] = \n{\n"
			
				s+="BOXES:["
				for(let b of boxes)
					s+="{x:"+b.x+",y:"+b.y+"},"
				s+="],\n"
			
			
				s+="ENEMIES:["
				for(let b of enemies)
					s+="{x:"+b.x+",y:"+b.y+",vx:"+b.vx+"},"
				s+="],\n"
			
				s+="SEEDS:["
				for(let b of seeds)
					s+="{x:"+b.x+",y:"+b.y+"},"
				s+="],\n"
				
				s+="DOORS:["
				for(let b of doors)
					s+="{x:"+b.x+",y:"+b.y+"},"
				s+="],\n"
			
			
				s+="DOORKEYS:["
				for(let b of doorkeys)
					s+="{x:"+b.x+",y:"+b.y+"},"
				s+="],\n"
			
			
				s+="BOMBS:["
				for(let b of bombs)
					s+="{x:"+b.x+",y:"+b.y+"},"
				s+="],\n"
			
				s+="WATERS:["
				for(let b of waters)
					s+="{x:"+b.x+",y:"+b.y+"},"
				s+="],\n"
			
				s+="FILTERS:["
				for(let b of filters)
					s+="{x:"+b.x+",y:"+b.y+",number:"+b.number+"},"
				s+="],\n"
			
				s+="NUMBERS:["
				for(let b of numbers)
					s+="{x:"+b.x+",y:"+b.y+",number:"+b.number+"},"
				s+="],\n"
			
				s+="BELTS:["
				for(let b of belts)
					s+="{x:"+b.x+",y:"+b.y+",dir:"+b.dir+"},"
				s+="],\n"
				
				
				s+="PLAYER : {x:"+player.x+",y:"+player.y+"},\n"
			
			s +="}\n"
			
			saveStr(s,"level.js")
			return 
			
		case 'p':
			player.x = Mouse.x * blsz + blsz/2
			player.y = Mouse.y * blsz + blsz/2
			break
			
		case 'f':{
				  removeAtPos(seeds,xx,yy)
				  let d = new Seed()
				  d.x = xx			
				  d.y = yy
				  seeds.push(d)
			}
			break		
			
		case 'm':
		case 'n':
			{
				removeAtPos(enemies,xx,yy)
				let m = new Enemy()
				if(e.key=='m')m.vx=Math.abs(m.vx)
					else 
						m.vx=-Math.abs(m.vx)
						
					 
				m.x = xx
				m.y = yy
				enemies.push(m)
			}
			break
			
		case 'd':
				{
					removeAtPos(doors,xx,yy)
					let d= new Door()
					d.x = xx
					d.y = yy + 16
					doors.push(d)
				}
			break
		
		
		
		case 'b':
				{
					removeAtPos(bombs,xx,yy)
					let d= new Bomb()
					d.x = xx
					d.y = yy 
					bombs.push(d)
				}
			break
			
		case 'k':
				{
					removeAtPos(doorkeys,xx,yy)
					let d= new NumberKey()
					d.x = xx
					d.y = yy 
					doorkeys.push(d)
				}
			break
		
		case 'w':
				{
					removeAtPos(waters,xx,yy)
					let d = new Water()
					d.x = xx
					d.y = yy 
					waters.push(d)
				}
			break
		case 'g':
				{
					removeAtPos(filters,xx,yy)
					let d = new FilterDoor()
					d.x = ( +Math.floor((xx ) / 32))*32
					d.y = ( +Math.floor((yy ) / 32))*32
					filters.push(d)
				}
			break	
		case 't':
		case 'y':
				{
					removeAtPos(belts,xx,yy)
					let d = new Belt()
					d.dir=-1
					if(e.key=='y')d.dir=1
					d.x = ( +Math.floor((xx ) / 32))*32
					d.y = ( +Math.floor((yy ) / 32))*32
					belts.push(d)
				}
			break		
		case 'r':
				{
					removeAtPos(numbers,xx,yy)
					let d = new NumberPass()
					d.x = xx
					d.y = yy
					numbers.push(d)
				}
			break	
			
		case ' ':
		    removeAtPos(belts,xx,yy)
		    removeAtPos(numbers,xx,yy)
			removeAtPos(filters,xx,yy)
			removeAtPos(waters,xx,yy)
			removeAtPos(enemies,xx,yy)
			removeAtPos(seeds,xx,yy)
			removeAtPos(doors,xx,yy)
			removeAtPos(bombs,xx,yy)
			removeAtPos(doorkeys,xx,yy)
		break
		
		case 'F4':
			const all = [boxes,belts,numbers,filters,waters,enemies,seeds,doors,bombs,doorkeys]
			all.forEach(a=>a.length=0)
			clearArr()
		break
		
		default:
		{
			const k = e.key.charCodeAt(0) - '0'.charCodeAt(0)
			console.log(k)
			if(k>9||k<0)break
			const f = getAtPos(filters,xx,yy)
			const n = getAtPos(numbers,xx,yy)
			 
			if(f instanceof  FilterDoor ){
					f.number = (f.number *10 + k)%1000
			}else{
				n.number = (n.number *10 + k)%100
			}
			
			
		}
		break
		
	}
	
	draw()
}
function makeArr(){
	for(let i in boxes)
		{
			const b =  boxes[i]
			const x = Math.floor(b.x / blsz)
			const y = Math.floor(b.y / blsz)
			arr[y][x]=1
		}
}

function clearArr(){
	for(let y=0;y<Ny;y++){
		for(let x=0;x<Nx;x++) 
			arr[y][x]=0
	} 
}

window.onload = function(){

	arr = new Array(Ny)
	for(let y=0;y<Ny;y++){
		arr[y] = new Array(Nx)
		for(let x=0;x<Nx;x++) 
			arr[y][x]=0
	} 
	
	
	loadLevel(0)
	
	makeArr()
	
	
	
	draw()
}