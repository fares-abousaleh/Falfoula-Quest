

class Game{

	constructor(w,h,w1){
		//--- construc main canvas
		this.can = document.createElement("canvas")
		this.can.width = w
		this.can.height = h
		document.body.appendChild(this.can)
		this.ctx = this.can.getContext("2d")
		this.ctx.font="26px monospace"
		this.ctx.textBaseline="middle"
		this.ctx.textAlign="center"
		 
		
		//--- construct side canvas
		this.sidecan = document.createElement("canvas")
		this.sidecan.width = w1
		this.sidecan.height = h
		document.body.appendChild(this.sidecan)
		this.sidectx = this.sidecan.getContext("2d")
		this.sidectx.font="18px monospace"
		this.sidecan.h = this.sidecan.height/10
		this.sidectx.textBaseline="middle"
		this.sidectx.textAlign="center"
		this.drawSide()
		
		this.ctr = 0
		this.acc = 0
		this.th = 0
		this.running = true
		this.time = Date.now()
		
		
		window.addEventListener("keydown", (e) => this.keyHand(e) )
		
		this.sidecan.addEventListener("mousedown", (e) => this.mousedownHand(e) )
		
	}
	
	drawSide(){
		this.sidectx.fillStyle="#334"
		this.sidectx.fillRect(0,0,this.sidecan.width,this.sidecan.height)
		this.sidectx.strokeStyle="#99f"
		const labels=["reset (spacebar)","toggle (r)","full screen (f)"]
		for(let i=0;i<10;i++){
			this.sidectx.strokeText(labels[i],this.sidecan.width/2,(i+0.5)*this.sidecan.h)
			this.sidectx.strokeRect(0,i*this.sidecan.h,this.sidecan.width,this.sidecan.h)
		}
	}
	
	mousedownHand(e){
			const r = this.sidecan.getBoundingClientRect()
			const x = e.x - r.x 
			const y = Math.floor((e.y - r.y)/this.sidecan.h)
			switch(y){
				case 0: this.keyHand({key:' '})
				break
				case 1: this.keyHand({key:'r'})
				break
				case 2: this.keyHand({key:'f'})
				break
			}
			
		}
	
	toggleFullscreen(){
		if(document.fullscreen)
			document.exitFullscreen()
		else
			document.body.requestFullscreen()
	}
	
	keyHand(e){
			switch(e.key){
				case "r":this.toggle()
				break
				case "f":this.toggleFullscreen()
				break
				case " ":this.ctr=0 
				this.draw()
				break
			}
		}
		
	
	toggle(){
		this.time=Date.now()
		this.running=!this.running
	}
	
	update(dt){
		this.ctr+=0.1*dt
		this.th+=0.1*dt
	}
	
	draw(dt){
		this.ctx.fillStyle="#224"
		this.ctx.fillRect(0,0,this.can.width,this.can.height)
		
		this.ctx.strokeStyle="#000"
		this.ctx.lineWidth=1
		this.ctx.beginPath()
		this.ctx.moveTo(0,this.can.height/2)
		this.ctx.lineTo(this.can.width,this.can.height/2)
		this.ctx.moveTo(this.can.width/2,0)
		this.ctx.lineTo(this.can.width/2,this.can.height)
		this.ctx.stroke()
		
		
		this.ctx.save()
		this.ctx.strokeStyle="#ff0"
		this.ctx.translate(this.can.width/2,this.can.height/2)
		
		this.ctx.scale(2,2)
		this.ctx.strokeText(""+Math.round(this.ctr),0,0)
		this.ctx.restore()
		
		this.ctx.fillStyle="#aaf"
		const s = 0.5*this.can.width*(1+0.7*Math.sin(this.th*0.01))
		const c = 0.5*this.can.height*(1+0.7*Math.cos(this.th*0.01))
		this.ctx.fillText(""+Math.round(this.ctr),s,c)
		
		this.ctx.fillStyle="#f00"
		if(dt>0)
			this.acc = 0.9*this.acc+0.1*1000/dt
		this.ctx.fillText(""+Math.round(this.acc),30,30)
		
	}

	loop(){
		const Loop = ()=>{
		if(this.running){
			const dt = Date.now()-this.time
			this.time= Date.now()
			this.update(dt)
			this.draw(dt)
		}
		requestAnimationFrame(Loop)
		}
		requestAnimationFrame(Loop)
	}
}

window.onload = function(){
	 
	const game = new Game(700,480,200)
	game.loop()
	
}