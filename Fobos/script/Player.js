const GUN = UI_GUN_0;
// 110 81
class Gun {
    constructor(img) {
        var cont = document.getElementById("load_img").getContext("2d");
        document.getElementById("load_img").width = GUN_WIDTH;
        document.getElementById("load_img").height = GUN_HEIGHT;
        cont.drawImage(img, 0, 0);
        this.sprite = cont.getImageData(0,0, GUN_WIDTH, GUN_HEIGHT);
        cont.clearRect(0,0,1000,1000);

        cont.drawImage(shoot_anim, 0, 0);
        this.shootAnim = cont.getImageData(0,0, SHOOT_SIZE, SHOOT_SIZE);
        cont.clearRect(0,0,1000,1000);
        
        this.scaleAnim = 1;
        this.speed = 250;
        this.damage = 50;
        this.sound = new Audio("sounds/shots/Gun1.mp3");
        this.no_ammo = new Audio("sounds/shots/no_ammo.mp3");
        this.is_shoot = false;
        this.ammunition = 15;
    }


    shoot() {
        if (this.ammunition < 1) {
            this.no_ammo.currentTime = 0.0;
            this.no_ammo.play();
            return;
        }
        this.ammunition--;
        this.sound.currentTime = 0.0;
        this.sound.play();
        this.is_shoot = true;
        var sprite = GS.monsters_buffer[(GS.h >> 1) * GS.w + (GS.w >> 1)];
        if (sprite != 0) sprite[0].lose_damage(this.damage, sprite[1], sprite[2]);
        setTimeout(function() {this.is_shoot = false; this.scaleAnim = 1;}.bind(this), 100);
        this.animShooting();
    }

    animShooting() {
        if (this.is_shoot == true) setTimeout(function() { this.scaleAnim += 0.2;}.bind(this), 25);
    }
}

class Player {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.z = 0;
        this.maxSpeed = 0.1; // speed to this and all of next speeds is m / GAME_TICK ms
        this.zMaxSpeed = 40;
        this.speed = 0;
        this.sideSpeed = 0;
        this.zSpeed = 0;
        this.zAcceleration = -10;
        this.accelleration = 0.020;
        this.a = angle;
        if (this.a > PI) this.a = (this.a % (2 * PI)) - 2 * PI;
        if (this.a < -PI) this.a = (this.a % (2 * PI)) + 2 * PI;
        this.aZ = 0;
        this.fov =  (PI / 3);
        this.moveTimeOut = 0;
        this.gun = new Gun(GUN);
        this.shootTimeout = 0;
        this.is_plagued = false;
        this.maxHP = 100;
        this.hp = 100;
        this.realHP = this.hp;
        this.is_dead_touched = false;
        this.is_blinded = false;
        this.is_slowed = false;
    }

    lose_damage(dmg) {
        this.realHP -= dmg;
        this.hp -= dmg;
        if (this.hp < 0) this.death();
    }

    death() {
       // document.write("gg");
    }

    moving(dir, accelleration,addAngle = 0) {
        var new_x = 0;
        var new_y = 0;
        if (dir == 0) {
            if (this.speed < this.maxSpeed && this.speed > -this.maxSpeed) this.speed += accelleration;
            else if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
            else if (this.speed < -this.maxSpeed) this.speed = -this.maxSpeed;
            new_x = this.x + this.speed * Math.cos(this.a);
            new_y = this.y + this.speed * Math.sin(this.a);
        }
        else  {
            if (this.sideSpeed < this.maxSpeed) this.sideSpeed += accelleration;
            else this.sideSpeed = this.maxSpeed;
            new_x = this.x + this.sideSpeed * Math.cos(this.a + addAngle);
            new_y = this.y + this.sideSpeed * Math.sin(this.a + addAngle);
        }

        if (currentMap.map[Math.floor(new_x) + Math.floor(this.y) * currentMap.w] == ' ') 
            this.x = new_x;
        
        
        if (currentMap.map[Math.floor(this.x) + Math.floor(new_y) * currentMap.w] == ' ') 
            this.y = new_y;
        
    }

    move() {
        if (pressedKeys[W] && pressedKeys[S]) this.stopMoving(0);
        else if (pressedKeys[W]) this.moving(0, this.accelleration);
        else if (pressedKeys[S]) this.moving(0, -this.accelleration);

        if (pressedKeys[A] && pressedKeys[D]) this.stopMoving(1)
        else  if (pressedKeys[A]) this.moving(1, this.accelleration, -Math.PI / 2);
        else  if (pressedKeys[D]) this.moving(1, this.accelleration, Math.PI / 2);

        this.moveTimeOut = setTimeout(function() {this.move()}.bind(this), GAME_TICK);
    }

    stopMoving(dir) {
        if (dir == 0) this.speed = 0;
        if (dir == 1) this.sideSpeed = 0;
    }

    jump() {
        if (this.z == 0) {
            this.zSpeed = this.zMaxSpeed;
            this.z += this.zSpeed;
            this.fall();
        }
    }

    fall() {
        this.zSpeed += this.zAcceleration;
        var new_z = this.z + this.zSpeed;
        if (new_z <= 0) this.z = 0;
        else {
            this.z = new_z; 
            setTimeout(function() {this.fall()}.bind(this), 20);
        }
    }

    changeView(x, y) {
        var rad_x = x*0.001;
        this.a += rad_x;
        if (this.a > PI) this.a = (this.a % (2 * PI)) - 2 * PI;
        if (this.a < -PI) this.a = (this.a % (2 * PI)) + 2 * PI;
        var rad_y = y;
        this.aZ -= rad_y;
        if (this.aZ >  $(window).height()  || this.aZ < (-($(window).height()))) this.aZ += rad_y;
    }

    shoot() {
        this.gun.shoot();
        this.shootTimeout = setTimeout(function() {this.shoot()}.bind(this), this.gun.speed);
    }

    stopShooting() {
        clearTimeout(this.shootTimeout);
    }
}

var player;
