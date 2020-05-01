//Credit https://site.uplabs.com/posts/windows-10-file-explorer
var isMoving = false;
var beginX = 0;
var beginY = 0;
var selectorX = 0;
var selectorY = 0;
var nowX = 0;
var nowY = 0;
var partenzaselettoreX;
var partenzaselettoreY;

function start(){
  	isMoving = true;
		beginX = window.event.clientX;
		beginY = window.event.clientY;
}

function trascina(){
  if(isMoving){
  	nowX = window.event.clientX;
		nowY = window.event.clientY;
					if(nowX > beginX){
						partenzaselettoreX = beginX;
					}else{
						partenzaselettoreX = nowX;
					}
    
          selectorX = Math.abs(beginX - nowX);
    
           if(nowY > beginY){
						  partenzaselettoreY = beginY;
					  }
					  else{
						  partenzaselettoreY = nowY;
					  }
    
    selectorY = Math.abs(beginY - nowY);
    
    $("#selettore").show();
    $("#selettore").css("margin-top",partenzaselettoreY);
    $("#selettore").css("margin-left",partenzaselettoreX);
    $("#selettore").css("width",selectorX);
    $("#selettore").css("height",selectorY);
  }
}

function stop(){
  isMoving = false;
  $("#selettore").hide();
}