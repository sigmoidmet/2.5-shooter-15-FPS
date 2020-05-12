var playerMark = new Image();      
playerMark.src = "img/figures/player_dir5.png";

var lvl1_walls = new Image();
lvl1_walls.src = "img/Textures/walltext_lvl1.png";

var lvl1_monsters = new Image();
lvl1_monsters.src = "img/Textures/Sprites/monsters_lvl1.png";

var blink = new Image();
blink.src = "img/Textures/Sprites/blink1.png";

var UI_GUN_0 = new Image();
UI_GUN_0.src = "/img/GUNS/UI_GUN_1.png";

var shoot_anim = new Image();
shoot_anim.src = "/img/GUNS/shoot_animation.png";

var sun = new Array(SUN_COUNT);
for (var i = 1; i <= SUN_COUNT; ++i) {
    sun[i - 1] = new Image();
    sun[i - 1].src = "SolarSystem/SSimg/sun/sun" + i + ".png";
}




var moon = new Array(MOON_COUNT);
//moon.src = 'SolarSystem/SSimg/moon.png';
for (var i = 1; i <= MOON_COUNT; ++i) {
    moon[i - 1] = new Image();
    moon[i - 1].src = "SolarSystem/SSimg/Moon" + i + ".png";
}

var aster = new Array(ASTER_COUNT);
for (var i = 1; i <= ASTER_COUNT; ++i) {
    aster[i - 1] = new Image();
    aster[i - 1].src = "SolarSystem/SSimg/aster/meteor" + i + ".png";
}

var earth = new Array(new Image(), new Image(), new Image());
earth[0].src = 'SolarSystem/SSimg/mars1.png';
earth[1].src = 'SolarSystem/SSimg/mars2.png';
earth[2].src = 'SolarSystem/SSimg/mars3.png';

var cur_sun = 0;
var earth_a = 0;
var moon_a = PI;

var star_sky = new Image();
star_sky.src = "img/sky/star.jpg";


shell_fireball = new Image();
shell_fireball.src = "img/Textures/shells/fireball.png";


var shell_fireball_drawen = new Array(SHELL_FIREBALL_COUNT);

function loadImages() {
    document.getElementById("load_img").width = OBJECT_SIZE; 
    document.getElementById("load_img").height = OBJECT_SIZE;
    var cont = document.getElementById("load_img").getContext("2d");
    for (var i = 0; i < SHELL_FIREBALL_COUNT; ++i) {
        cont.drawImage(shell_fireball, i * OBJECT_SIZE, 0, OBJECT_SIZE, OBJECT_SIZE, 0, 0, OBJECT_SIZE, OBJECT_SIZE);
        shell_fireball_drawen[i] = cont.getImageData(0, 0, OBJECT_SIZE, OBJECT_SIZE);
        cont.clearRect(0, 0, 1000, 1000);
    }

}




lvl1_monsters.onload = function() {
    sprites = new Array(new Sprite(1.834, 8.765, 2, lvl1_monsters,4, 64, REGENERATOR), new Sprite(1.323, 12.365, 0, lvl1_monsters, 4, 64, TELEPORT), new Sprite(2.123, 10.265, 1, lvl1_monsters, 4, 64, TELEPORT));
}


