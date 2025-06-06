/*****************************
	Globals
 *****************************/
let gameRunning = false
const canvas = document.getElementById("canvas")
const GravityAcceleration = 0.0012
const ww = canvas.width
const hh = canvas.height
const NN = 2
const WW = NN * ww
const HH = NN * hh
const floorY =  HH-26 
const ctx = canvas.getContext("2d") 
const boxes_ = []
let lapStartTime = Date.now();
let dt = 0
let dtKey = undefined
let CurLevel = 0


/*****************************************
    Load Assets
 *****************************************/
loadSounds([
	 "seedCollect",
	 "butterflyHit",
	 "outch",
	 "collectKey",
	 "bvv",
	  
	 ])
	 
setMusic([
	"nem2",
	"music",
	"music2",
	])
	
loadImages([
	"filterDoor",
	"filterDoor1",
	"pass",
	"bk",
	"water",
	"box",
	"bvv",
	"oiseauUp",
	"oiseauLeft",
	"oiseauLeft1",
	"oiseauRight", 
	"oiseauRight1",
	"oiseauJumpingLeft",
	"oiseauJumpingRight",
	"oiseauJumpingLeft1",
	"oiseauJumpingRight1",
	"heart",
	"seed",
	"butterfly",
	"enemyRight",
	"enemyLeft",
	"door", 
	"doorkey",
	"bomb",
])
 	
/********************************
	Input Events Handlers
 ********************************/

const keys = {};
 
function keyHand(e) {
	
	keys[e.key] = true
	
	if(e.key=='Escape')
		toggle()
	
	if(gameRunning&&!musicPlaying){
		level_music.pause()
		level_die.pause()
		level_music.currentTime=0
		level_die.currentTime=0
		playMusic()
	}
	
	if(gameRunning&&e.key=='n'){
		seeds.length=0
	}
		
}

window.addEventListener("keydown", keyHand )

window.addEventListener("keyup", e => keys[e.key] = false)
 
function mouseBtn(e){
	e.preventDefault()
	if(e.type=="mousedown"||e.type=="touchstart")
		 keys[e.target.vstate]=true
	 else keys[e.target.vstate]=false

	if(keys.Escape)keyHand({key:"Escape"})
	if(gameRunning&&!musicPlaying){
		level_music.pause()
		level_die.pause()
		level_music.currentTime=0
		level_die.currentTime=0
		playMusic()
	}
} 
function onDrag(){return false}

function setMouseHand(o,cap){
	o.vstate=cap
	o.onmousedown = mouseBtn
	o.ontouchstart = mouseBtn
	o.onmouseup = mouseBtn
	o.ontouchend = mouseBtn
	o.ondrag = mouseBtn
	o.onmouseout = mouseBtn
}

// setMouseHand(vkeyleftup,["l","u"])
setMouseHand(vkeyleft,"ArrowLeft")
// setMouseHand(vkeyrightup,["r","u"])
setMouseHand(vkeyright,"ArrowRight")
setMouseHand(vkeyup,"ArrowUp")
setMouseHand(vkeyfire,"Control")
setMouseHand(vkeyEsc,"Escape")

/*****************************************
    Player
 *****************************************/
 class Player extends Sprite{
	
	constructor(){
		super("oiseauRight")
		this.ctr =0
		this.th =0
		this.jumpTimer=0
		this.speed = 0.33
		this.width=32
		this.height=32
		this.scoreChips = 0
		this.scoreButterflies = 0
		this.key = 0
		this.number = 5
		this.bombs = 0
		this.vctr = 0
		
		this.punch = new Sprite("bomb")
		this.punch.active = false
		this.punch.width = 16
		this.punch.height = 16
		this.dir = 1
	}
	
	 
	startPunch(){
		//if(this.bombs<=0)return
		this.bombs--
		this.punch.active = true
		this.punch.x= this.x
		this.punch.y= this.y
		this.punch.vx = -0.2
		this.punch.vy = -0.2
		this.punch.th=0
		  this.punch.width = 16
		this.punch.height = 16
		this.punch.state="bomb"
		if(this.state=="oiseauJumpingRight"||this.state=="oiseauJumpingRight1"||this.state=="oiseauRight1"||this.state=="oiseauRight"){
			this.punch.vx *= -1
		}
		this.punch.tm = 15
		
		playSound("punch")
	}
	
	updatePunch(dt){
		 this.punch.update(dt)
		 this.punch.vy += dt * 0.001
		 this.punch.tm -=  0.03 * dt
		this.punch.th += dt*0.01
		if( this.punch.tm <=0 ){
			if(this.punch.state=="bomb"){
				this.punch.state="bvv"
				playSound("bvv",1)
			}
			if(this.punch.tm <=-3*3.114159)
				this.punch.active = false
			  this.punch.th += dt*0.01
			 this.punch.width = 25*Math.sin(0.333*this.punch.tm)
		this.punch.height = this.punch.width
		}
	}
	
	feetOnGround(){
		if(this.y+this.height/2>=HH-1)return true
		this.y++
		for(let i in boxes)
			if(checkCollisionBox(this,boxes[i])){
				this.y--
				return true
			}
		this.y--
		return false
	}
	draw(ctx){
		let {th,x,y}=this.punch 
		let a = 1
		if(this.punch.tm<0)a=5
		if(this.punch.active){
			 for(let i=0;i<a;i++){
				 this.punch.x = x+rnd(-4,4)*i
				 this.punch.y = y+rnd(-4,4)*i
				 this.punch.th = th+rnd(-0.3,0.3)*i
				  
				this.punch.drawRot(ctx,this.punch.th)
			}
			Object.assign(this.punch,{th:th,x:x,y:y})
		}
		 this.drawRot(ctx,this.th) 
		 if(this.showNum){
			ctx.save()
			ctx.fillStyle="#fff"
			ctx.font="18px monospace"
			ctx.translate(-ViewX,-ViewY)
			ctx.fillText(""+this.number,this.x-this.width/2,this.y-this.height/2)
			ctx.restore()
		 }
			 
		 
	}
	update(dt){
		 
		if(this.th>0)
			this.th-=dt*0.02 
		else this.th=0
		
		if(this.tm>0)this.tm-=dt*0.09
		
		if(this.vctr>0)
			this.vctr -=   dt //7.5
		else  {
			this.x =16*Math.round(this.x/16)
			//this.x+= 0.31*(xx-this.x)
			this.vx=0
			this.vctr=0
		}

    	
		if(this.vctr<=0){
		if (keys['ArrowLeft']) {
			
			this.dir = -1
			this.vctr = 18 
			if(this.vx<=0)
				this.vx = -this.speed 
			else this.vx=0
			
		}
		if (keys['ArrowRight']) {
			this.dir = 1
			this.vctr = 18 

			if(this.vx>=0)
				this.vx = this.speed 
			else this.vx=0			
		}
		}
		if (keys['ArrowUp']) {
			if(this.feetOnGround()&&this.jumpTimer<=0){
				this.jumpTimer =  5;
				this.vy = -2.1*this.speed;
			}
		}else {
			if(this.vy<0)
				this.vy =0
			this.jumpTimer=0
			
		}

		 
		if (  this.jumpTimer>0 ) {
			this.jumpTimer-=dt*0.1;
		 }else if(!this.feetOnGround())this.vy += GravityAcceleration * dt 

		
		
		player.showNum=updatePos(this,boxes_) 
				 
		 
		
		if(!this.punch.active&&keys["Control"])
			this.startPunch()
		
		if(this.punch.active)
			this.updatePunch(dt) 
  
		

		this.updateState()
		   
		adjustView(this)
		
	}
	
	updateState(){
		const flying = !this.feetOnGround()
		if(this.vx==0)this.ctr=0
		else
		this.ctr+=0.142*dt*(true==(flying||keys["ArrowLeft"]||keys["ArrowRight"])) 
		this.ctr%=12
		 
		
		if(flying){
			if(this.dir>0){
				if(this.ctr>6)
					this.state =  "oiseauJumpingRight"
				else this.state =  "oiseauJumpingRight1"
		    }else //if( keys["ArrowLeft"]||(this.state.indexOf("L")>=0)){
				if(this.ctr>6)
					this.state =  "oiseauJumpingLeft1"
				else this.state = "oiseauJumpingLeft"
				 
		}
		 else {
          	if( this.dir>0){
				if(this.ctr>6)
					this.state="oiseauRight1"
				else this.state="oiseauRight"
			}
		    else
			{
				if(this.ctr>6)
					this.state="oiseauLeft1"
				else this.state="oiseauLeft"
			}
			
		 }
	}
	
 }
 
 function hurtPlayer(){
	player.scoreChips--
	playSound("outch")
	player.th=2*Math.PI
	if(player.scoreChips<=0){
		loadLevel(CurLevel)
		adjustView(player)
		level_die.play()
		toggle()
	}
 }	 
  
/*****************************************
     Seeds
 *****************************************/ 
 class Seed extends Sprite{
	
	constructor(){
		super("seed")
		this.recreate()
	}
	
	recreate(){
			this.x = rnd(0,WW)
			this.y=rnd(-500,-100)
			this.vx = 0
			this.vy = 0 
			this.th = 0
			this.dth = rnd(0.1,0.9)
			this.taken = false
		}
	
	update(dt){
		if(this.taken)return
		super.update(dt)
		//this.vy += dt * 0.00004
		const s = Math.sin(this.th)
		const ss = (1+0.2*s)
		this.th+=dt*0.04*this.dth
		this.width = 32 * ss
		this.height = 32 / ss
		 
		if(checkCollisionBox(this,player)){
			playSound("seedCollect")
			hearts.push(new Heart(this))
			//this.recreate()
			this.taken = true
			removeSp(seeds,this)
			player.scoreChips++
		}
		
	}
	
	draw(ctx){
		if(this.taken)return
		this.y += 16-this.height/2
		super.draw(ctx)
		this.y -= 16-this.height/2
	}
	
	
 }
 
/*****************************
	 Doors
 *****************************/  
 class Door extends Sprite{
 
	constructor(){
		super("door")
		this.x = 32*rndInt(WW/32)+16
		this.y = 64*rndInt(HH/64)+32
		this.width  = 32
		this.height = 64
		this.active = true
		 
	}
	
	update(dt){
		
		if(player.key>0&&checkCollision(player,this,16*2.23)){
			player.key--
			removeSp(doors,this)
		}
	}
	
 
 }
/*****************************************
    Hearts
*****************************************/ 
class Heart extends Sprite{
	
	constructor(sp){
		super("heart")
		this.x = sp.x
		this.y = sp.y
		this.vy = -0.3
		this.vx=0
		this.th=0
		this.dth=rnd(0.3,1)
	}
	
	update(dt){
		if(this.y<-90)return
		this.th+=this.dth
		this.width = 48*Math.sin(this.th) 
		super.update(dt)
	}
	
}



/*****************************************
    Butterflies
 *****************************************/
class Butterfly extends  Sprite{
	
	constructor(){
		super("butterfly")			 
		this.recreate()
	}
	
	recreate(){
		this.vx=rnd(0.06)
		this.vy=rnd(0.06)
		this.x = rnd(0,WW)
		this.y = -rnd(120,300)
		this.width = 26
		this.height = 26	
		this.alive = true
		this.ctr = 0
		this.dctr = rnd(0.02,0.062)
	}
	
	update(dt){
		if(!this.alive)this.vy += GravityAcceleration * dt
		else if(this.y<0)this.vy =0.1
		if(this.y>HH+300||this.x>2000||this.x<-1000)this.recreate()
		
	    super.update(dt)
		
			
		if(this.alive&&(rnd()<0.02)){
			this.vx=rnd(0.12)
			this.vy=rnd(0.12)
		}
		this.ctr += this.dctr*dt
		
		if(this.ctr>10)this.ctr=0
		this.width=26*(1+0.6*Math.sin(this.ctr*Math.PI*0.2))
		
		if(this.alive&&checkCollision(this,player)){
			this.alive = false
			playSound("butterflyHit")
			this.vx =rnd(0.6)
			this.vy = -0.9
			player.scoreButterflies++
		}
	}
	
	draw(ctx){
		const th = this.alive?Math.atan2(this.vx,-this.vy):this.ctr*Math.PI*0.2
		this.drawRot(ctx,th)
	}
	
}

const flies = []
for(let i=0;i<4;i++){
	flies[i] = new Butterfly()
}

function isBox(sp){
	const blksz = 32 
	 const s=Object.assign({},sp)
	 s.width=32
	 s.height=32
	if(sp.x>=WW-16||sp.x<=16)return true
	for(let j in boxes_){
	for(let i in boxes_[j])
		if(checkCollisionBox (s,boxes_[j][i],32))return true
	}
	return false
}
/*****************************************
    Enemies
 *****************************************/
 class Enemy extends Sprite{
	
	constructor(){
		super("enemyRight")
		this.width = 32
		this.height = 32
		this.vx = 0.1*(1 - rndInt(0,2)*2 )
		this.vy = 0
		this.ctr = 0
		this.th = 0
		this.dth = 0.3
		this.alive=true
		do{
			this.x = rndInt(0,WW/32)*32+16
			this.y = rndInt(0,HH/32)*32+16
		}while(isBox(this))
	}
	
	update(dt){
		
		if(!this.alive){
			this.vy += 1.6*GravityAcceleration*dt
			super.update(dt)
			if(this.y>HH+90)removeSp(enemies,this)
			return
		}
		let oldx = this.x
		// if(this.width<32)this.width += 0.13*dt
		// else this.width=32
		
		if(isBox(this)){
			this.x =  Math.round(oldx/16)*16 
			this.vx = -this.vx
			// this.width  =  16
		}
		super.update(dt)
		//--- collision with player
		this.height=32//temporary
		if(this.ctr==0&&checkCollisionBox(player,this)){
				 
				this.ctr = 20
				hurtPlayer() 
					
				
		}
		
		if(player.punch.active&&checkCollisionBox(player.punch,this)){
			player.punch.tm=0
			this.vy = -0.8
			this.alive=false
		}
		if(this.ctr>0)this.ctr--
		
		//---update state
		this.th+=dt*this.dth*dt
		this.height=32*(1+0.2*Math.sin(this.th))
		if(this.vx>0)this.state = "enemyRight"
		else this.state = "enemyLeft"
	}
	
 }
 

/*****************************************
    Collision Boxex
 *****************************************/
class Box extends Sprite{
	
	constructor(){
		super("box")
		const bsz = 5
		this.x = rndInt(5,WW/bsz)*bsz
		this.y = rndInt(5,HH/bsz)*bsz
		const e = 6*( 1-2*rndInt(0,2) )
		//if(e!=3&&e!=-3)alert("e="+e)
		this.width  = bsz*(13 + e )
		this.height = bsz*(13 - e )
	}
	
}

/*****************************
	Keys
 *****************************/
 class NumberKey extends Sprite{
	
	constructor( ){
		super()
		 
		this.state = "doorkey"
		 
		this.ctr = rnd(3.14159)
	}
	
	update(dt){
		this.ctr+= dt*0.005
		const ss = Math.sin(this.ctr) 
		this.width = 35 
		 
		if(checkCollisionBox(this,player)){
			player.key++
			removeSp(doorkeys,this)
			playSound("collectKey")
		}
		this.width = 35*ss
		
	}
 }


/*****************************
	NumberPass
 *****************************/
 class NumberPass extends Sprite{
	
	constructor( ){
		super("pass")
		 
		this.state = "pass"
		this.number = rndInt(2,100) 
		this.ctr = rnd(3.14159)
	}
	
	update(dt){
		this.ctr+= dt*0.005
		const ss = 1+0.13*Math.sin(this.ctr) 
		this.width = 38 
		this.height = 38 
		 
		if(checkCollisionBox(this,player)){
			player.number+=this.number
			removeSp(numbers,this)
			playSound("collectKey")
		}
		this.width = 38*ss
		this.height = 38/ss
		
	}
	
	draw(ctx){
		super.drawRot(ctx,this.ctr*1.332154)
		ctx.save()
		ctx.translate(-ViewX,-ViewY)
		ctx.fillStyle="#04f"
		ctx.font="18px monospace"
		ctx.textAlign="center"
		ctx.textBaseline="middle"
		ctx.fillText(""+this.number,this.x,this.y)
		ctx.restore()
	}
 }

/*****************************************
    Bomb
 *****************************************/
 class Bomb extends Sprite{
	 
	 constructor(){
		super("bomb")
		this.ctr = 0
	 }
	 
	 update(dt){
		const yy = this.y+this.height/2
		this.ctr+= dt*0.006
		const ss = Math.sin(this.ctr) *0.2+1
		this.width = 25*ss
		this.height = 25/ss
		this.y = yy-this.height/2
		if(checkCollisionBox(this,player)){
			player.bombs++
			removeSp(bombs,this)
			playSound("collectKey")
		}
	 }
	 
 }
 /*****************************
	Water
 *****************************/
 class Water extends Sprite{
 
	constructor(){
		super("water")
		this.ctr = 0
		this.dctr = 0.03 
		this.width =32
		this.height =32
	}
	
	update(dt){
		this.ctr+= dt*this.dctr* (1+0.3*Math.sin(this.x*0.9/32))
		this.ctr  = this.ctr%32
		
		if(checkCollisionBox(this,player)){
			hurtPlayer()
		}
	}
 
 
	draw(ctx){
		const x = this.x-this.width/2
		const y = this.y-this.height/2
		let yy = this.ctr  
		ctx.save()
		ctx.translate(-ViewX,-ViewY)
		 ctx.drawImage(Images["water"], 
		                  0, yy,   32, 32-yy,
		                  x, y,    32, 32-yy     )
		 ctx.drawImage(Images["water"],
		                  0, 0,   32,yy,
						  x, y+32-yy, 32,yy   )
		ctx.restore()
	}
	
 }
 /*****************************
	FilterDoor
 *****************************/
 class FilterDoor extends Sprite{
 
	constructor(){
		super("filterDoor")
		this.ctr = 0
		this.dctr = 0.05 
		this.width = 64
		this.height = 64
		this.number = rndInt(12,34)
		this.th = 0
	}
	
	update(dt){
		this.ctr+= dt*this.dctr 
		if(this.ctr>=32){
			this.ctr-=32
			this.th = rndInt(0,4)*Math.PI*0.5
		}
		
		 if(this.ctr<16)
			 this.state="filterDoor"
		 else this.state="filterDoor1"
	}
 
 
	draw(ctx){
		super.drawRot(ctx,this.th)
		ctx.save()
		ctx.translate(-ViewX,-ViewY)
		ctx.fillStyle="#fff"
		ctx.font="32px monospace"
		ctx.textAlign ="center"
		ctx.textBaseline ="middle"
		const t = this.ctr*Math.PI/16
		const e = 5
		const c = e*Math.cos(t)
		const s = e*Math.sin(t)
		ctx.fillText(this.number,this.x+c ,1+this.y+s )
		ctx.strokeStyle="#000"
		ctx.strokeText(this.number,this.x+c ,1+this.y+s )
		ctx.restore()
	}
	
 }
 
/*****************************
	Loading Levels
 *****************************/

const boxes = []
const doors = []
const filters = []
const bombs = []
const doorkeys = []

var player = {}
const seeds = []
let hearts=[]
const enemies = []
const waters= []
const numbers= []

function loadLevel(level){
	
	if(level>=LEVELS.length)return
	 
	
	let {NUMBERS,FILTERS,WATERS,BOMBS,DOORKEYS,DOORS,BOXES,ENEMIES,PLAYER,SEEDS} = LEVELS[level]
	
	boxes_.length=0
	boxes.length=0
	enemies.length=0
	bombs.length=0
	seeds.length = 0
	doors.length = 0
	filters.length = 0
	doorkeys.length = 0
	numbers.length = 0
	hearts.length = 0
	waters.length=0
	
	for(let i in BOXES){
	 const b = new Box()
	 const B = BOXES[i]
	 b.x = B.x
	 b.y = B.y
	 b.width = 32
	 b.height = 32
	 boxes[i] = b
	}
	
	boxes_.push(boxes)
 
	const oldP = Object.assign({},player)
	player = new Player()
	Object.assign(player,PLAYER)
	if(oldP.scoreButterflies){
		player.scoreChips = oldP.scoreChips
		player.scoreButterflies = oldP.scoreButterflies
	}
	for(let i in ENEMIES)
	{
		let m = new Enemy()
		Object.assign(m,ENEMIES[i])
		enemies.push(m)
	}
	
	for(let i in SEEDS){
		let s = new Seed()
		Object.assign(s,SEEDS[i])
		seeds.push(s)
	}
	
	for(let i in DOORS){
		let d = new Door()
		Object.assign(d,DOORS[i])
		doors.push(d)
	}
	
	boxes_.push(doors)
	
	for(let i in DOORKEYS){
		let o = new NumberKey(0)
		Object.assign(o,DOORKEYS[i])
		doorkeys.push(o)
	}
	
	for(let i in BOMBS){
		let o = new Bomb(0)
		Object.assign(o,BOMBS[i])
		bombs.push(o)
	}
	
	for(let i in WATERS){
		let o = new Water()
		Object.assign(o,WATERS[i])
		waters.push(o)
	}
	
	for(let i in FILTERS){
		let o = new FilterDoor()
		Object.assign(o,FILTERS[i])
		filters.push(o)
	}
	boxes_.push(filters)
	
	for(let i in NUMBERS){
		let o = new NumberPass()
		Object.assign(o,NUMBERS[i])
		numbers.push(o)
	}
	
}

