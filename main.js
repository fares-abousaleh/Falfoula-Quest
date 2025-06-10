window.ondblclick =function (){

    document.body.requestFullscreen()
	
}
function update() {
	const DT_MAX = 1000/40
	dt = Date.now() - lapStartTime;
	if(dt>DT_MAX)dt=DT_MAX
    lapStartTime = Date.now();
	
	player.collision = false;
    
	seeds.forEach(sp => sp.update(dt) )
	flies.forEach(sp => sp.update(dt) )
	hearts.forEach(sp => sp.update(dt) )
	doorkeys.forEach(sp => sp.update(dt) )
	numbers.forEach(sp => sp.update(dt) )
	enemies.forEach(sp => sp.update(dt) )
	boxes.forEach(sp => sp.update(dt) )
	waters.forEach(sp => sp.update(dt) )
	filters.forEach(sp => sp.update(dt) )
	doors.forEach(sp => sp.update(dt) )
	bombs.forEach(sp => sp.update(dt) )
	belts.forEach(sp => sp.update(dt) )
	
	for(let i in hearts)
	  if(hearts[i].y<-40){
		hearts.splice(i,1)
		break
	  }
	 
	player.update(dt)
    if(seeds.length==0){
		CurLevel++
		CurLevel=CurLevel%LEVELS.length
		
		toggle()		
		loadLevel(CurLevel)
		level_music.play()
		adjustView(player)
		draw()	
	}
}
let stat_ctr = 0
function draw() {
  ctx.drawImage(Images["bk"],-ViewX,-ViewY,WW,HH)
  boxes.forEach(sp => sp.draw(ctx) )
  belts.forEach(sp => sp.draw(ctx) )
  doors.forEach(sp => sp.draw(ctx) )
  seeds.forEach(sp => sp.draw(ctx) )
  doorkeys.forEach(sp => sp.draw(ctx) )
  numbers.forEach(sp => sp.draw(ctx) )
  bombs.forEach(sp => sp.draw(ctx) )
  waters.forEach(sp => sp.draw(ctx) )
  filters.forEach(sp => sp.draw(ctx) )
  flies.forEach(sp => sp.draw(ctx) )
  enemies.forEach(sp => sp.draw(ctx) )
  hearts.forEach(sp => sp.draw(ctx) )
  
  
  player.draw(ctx)
  if(stat_ctr<=0){
	  writeStats()
	  stat_ctr=20
  }else stat_ctr--
  
   
}

function writeStats_old(){
	  ctx.fillStyle = "#fff";
  ctx.font = "16px monospace";
  let y = 5
  ctx.fillText(`life: ${player.scoreChips}`, 10, y+=20);
  ctx.fillText(`butterflies: ${player.scoreButterflies}`, 10, y+=20);
  ctx.fillText(`key: ${player.key }`, 10, y+=20);
  ctx.fillText(``, 10, y+=20);
 }

function writeStats(){
	const tag = "<span class='headings1'>"
	stats.innerHTML=tag+`level:</span>  ${(CurLevel+1)}<br>`
				   +tag+`life:</span>  ${player.scoreChips}<br>`
				   +tag+`energy:</span>  ${player.scoreButterflies}<br>`
				   +tag+`key:</span>  ${player.key }<br>`
				   +tag+`bombs:</span>  ${player.bombs}<br>`
				   +tag+`pass:</span>  ${player.number}<br>`
	if(dt&&dt>0)
		stats.innerHTML+= tag+`fps:</span> ${Math.floor(1000.0/dt)} `
}

function gameLoop() {
  if(gameRunning){	
	  update();
	  draw();
  }else showHelp()
  requestAnimationFrame(gameLoop);
}

window.onload = function(){ 
    gameRunning=false
	loadLevel(0)
	draw()
	showHelp()
	gameLoop();
	writeStats();
}


/*****************************************
    Help Screen
 *****************************************/
function showHelp( ){
	document.getElementById("level_num").innerHTML=" "+(CurLevel+1)
	document.getElementById("help_div").style.display="block"
}

function toggle(){
	gameRunning = !gameRunning
	if(!gameRunning){
		
		showHelp()
		stopMusic()
	}else {
		
		document.getElementById("help_div").style.display="none"
		lapStartTime = Date.now();
		playMusic() 
	}
}
 
