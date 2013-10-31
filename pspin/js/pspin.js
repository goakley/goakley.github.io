window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


var canvas = document.getElementById("projectspin");
if (canvas.getAttribute('tabindex') === null || 
    canvas.getAttribute('tabindex') === undefined)
    canvas.setAttribute("tabindex", 1);
if (canvas.getAttribute('tabIndex') === null || 
    canvas.getAttribute('tabIndex') === undefined)
    canvas.setAttribute("tabIndex", 1);
canvas.width = 800;
canvas.height = 600;
var ctx = canvas.getContext('2d');
var score = 0;


var keys = new Array(256);
canvas.addEventListener("keydown", function(event) {
    if (event.preventDefault)
        event.preventDefault();
    if (event.stopPropagation)
        event.stopPropagation();
    var code = event.keyCode;
    keys[code] = true;
    if (code == 87) { // W
        audioManager.toggleLoop(0);
    }
    else if (code == 65) { // A
        audioManager.toggleLoop(1);
    }
    else if (code == 83) { // S
        audioManager.toggleLoop(2);
    }
    else if (code == 68) { // D
        audioManager.toggleLoop(3);
    }
    else if (code == 38) { // UP
        audioManager.toggleLoop(4);
    }
    else if (code == 37) { // LEFT
        audioManager.toggleLoop(5);
    }
    else if (code == 40) { // DOWN
        audioManager.toggleLoop(6);
    }
    else if (code == 39) { // RIGHT
        audioManager.toggleLoop(7);
    }
    else if (code == 32) { // SPACE
        audioManager.playScratch();
    }
    else if (code == 74) { // J
        graphicsManager.showLight(1);
    }
    else if (code == 75) { // K
        graphicsManager.showLight(2);
    }
    else if (code == 76) { // L
        graphicsManager.showLight(3);
    }
    else if (code == 186) { // ;
        graphicsManager.showLight(0);
    }
    else if (code == 85) { // U
        audioManager.playVoice(0);
    }
    else if (code == 73) { // I
        audioManager.playVoice(1);
    }
    else if (code == 79) { // O
        audioManager.playVoice(2);
    }
    else if (code == 80) { // P
        audioManager.playVoice(3);
    }
    else {
        return;
    }
    if ([65,68,83,87].indexOf(code) >= 0) {
        graphicsManager.playerPic(1);
    } else if ([37,38,39,40].indexOf(code) >= 0) {
        graphicsManager.playerPic(2);
    } else {
        graphicsManager.playerPic(4);
    }
    score -= (audioManager.quarteroffset() - 0.4) / 8;
    if (score < 0) score = 0;
    else if (score > 1) score = 1;
    audioManager.setBassIntensity(score);
    graphicsManager.visualHit();
    graphicsManager.toggleKey(code);
    graphicsManager.setMeterLevel(score);
});
canvas.addEventListener("keyup", function(event) {
    //if (event.preventDefault)
    //    event.preventDefault();
    //if (event.stopPropagation)
    //    event.stopPropagation();
    keys[event.keyCode] = undefined;
});




(function update(){
    requestAnimFrame(update);
    // update the gui
    graphicsManager.update(ctx,
                           audioManager.quartercompletion(),
                           audioManager.measurecompletion());
})();
