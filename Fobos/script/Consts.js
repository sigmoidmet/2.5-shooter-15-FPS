
var MAX_VIEW_DISTANCE = 3.7;

const GUN_WIDTH = 600;
const GUN_HEIGHT = 400;

const SHOOT_SIZE = 64;

const SUN_COUNT = 60;
const SUN_SIZE = 200;
const ELLIPSE_C = 250;


var is_select = false;
var cur_earth = 0;
const EARTH_SIZE = 800;
const EARTH_W = 600;
const MAX_EARTH_STEP = 0.003; 
var EARTH_STEP = MAX_EARTH_STEP;

var cur_moon = 0;
const MOON_R = 500;
const MOON_COUNT = 7;
const MOON_STEP = 0.0006;


var cur_aster = 0;
const ASTER_COUNT = 10;
const ASTER_STEP_X = 1;
const ASTER_STEP_Y = 1.4;
var aster_x = -1000;
var aster_y = -500;

const SHELL_FIREBALL_COUNT = 32;

const OBJECT_SIZE = 64;

var is_started = false;


const PI = Math.PI;


const VIPER_CLAWLER = 0;
const VIPER_FIREWARD = 1;
const REIK = 2;
const MOOGUN = 3;
const DEMON = 4;
const TURRET = 5;
const BUMBLEBEE = 6;


const COUNT_AFFIXES = 10;
const NO_AFFIXES = 0;
const HEAVY = 1;
const POWER = 2;
const SPEED = 3;
const PLAGUE = 4;
const DEAD_TOUCH = 5;
const BLIND = 6;
const SLOW = 7;
const TELEPORT = 8;
const DISTANCER = 9;
const REGENERATOR = 10;

const GAME_TICK = 20; // ms