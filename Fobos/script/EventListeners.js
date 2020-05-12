var pressedKeys = new Array();

const W = 87;
const A = 65;
const S = 83;
const D = 68;
const space = 32; 
const TAB = 9;



function clickListener() {
  player.shoot();
}

function stopShooting() {
    player.stopShooting();
  }


function keydownListener() {
    pressedKeys[event.keyCode] = true;
    if (pressedKeys[space]) player.jump();
}

function keyupListener() {
    pressedKeys[event.keyCode] = false;
    if (event.keyCode == W || event.keyCode == S) player.stopMoving(0);
    if (event.keyCode == A || event.keyCode == D) player.stopMoving(1);
}

function moveCallBack() {
    var x = event.movementX;
    var y = event.movementY;
    player.changeView(x, y);
}

function test() {
    var requestedElement = document.getElementById('game');
    requestedElement.requestPointerLock();
}

function startGameEvents() {
    var requestedElement = document.getElementById('game');
    requestedElement.requestPointerLock();
    document.addEventListener("mousemove", moveCallBack, false);
    document.addEventListener("click",test, false);
    window.addEventListener("keydown", keydownListener);
    window.addEventListener("keyup", keyupListener);
    window.addEventListener("mousedown", clickListener);
    window.addEventListener("mouseup", stopShooting);
    for (var i = 0; i < sprites.length; ++i) sprites[i].attackManager();
}

function clickListenerMainMenu() {
    if (_distance(event.clientX, event.clientY, GS.w, 0) < 100) {
        light_menu.currentTime = 0.0;
        light_menu.play();
        cur_earth = (cur_earth == 0) ? 1 : 0;
        if (GS.ctx.globalAlpha < 1) GS.ctx.globalAlpha = 1;
        else GS.ctx.globalAlpha = 0.1;
    }
    else if (_distance(event.clientX, event.clientY, 300 + MOON_R * Math.cos(moon_a), 150 + MOON_R * Math.sin(moon_a)) < 50) { // from polar cordinates to Decard
        if (cur_moon < 5) {
            ++cur_moon;
            boom.currentTime = 0.0;
            boom.play();
        }
        if (cur_moon == 5) setTimeout(function() {
            burst.currentTime = 0.0;
            burst.play();
            cur_moon = 6;
            setTimeout(function() {
                cur_moon = 0;
            },100000);
        },100);

    }
    else if (is_select) {
        removeEventsMainMenu();
        player.move();
        startGameEvents();
        is_started = true;
        play();
        
    }
}

function highlightMars() {  
    if (_distance(event.clientX, event.clientY, GS.w / 2 + EARTH_SIZE / 2, GS.h / 2  - EARTH_W / 4 + 50) < ((EARTH_W / 2) - 20) ) {
       is_select = true;
        cur_earth = 2;
    }
    else {is_select = false;
    cur_earth = (GS.ctx.globalAlpha == 1) ? 0 : 1; 
}
}

function startEventsMainMenu() {
    document.addEventListener("click", clickListenerMainMenu);
    document.addEventListener("mousemove", highlightMars);

}

function removeEventsMainMenu() {
    document.removeEventListener("click", clickListenerMainMenu);
    document.removeEventListener("mousemove", highlightMars);
}