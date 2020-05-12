//texids:
//0 - VIPER-CLAWLER
//1 - VIPER-FIREWARD
//2 - Reik
//3 - Moogun
//4 - Demon
//5 - Turret
//6 - Bumblebee

//unit affixes
//0 - without effects
//1 - heavy
//2 - power
//3 - speed
//4 - plague
//5 - dead touch
//6 - blind
//7 - slow
//8 - teleport
//9 - distancer
//10 - regenerator


var active_plaguers = 0;



class Sprite {
    constructor(x, y, texid, img, cnt, size = 64, affix = Math.round(Math.random() * COUNT_AFFIXES)) {
        this.texid = texid;
        this.x = x;
        this.y = y;
        this.Z = 0;
        this.size = size;
        this.type = texid;
        this.affix = affix;
        this.bodySize = 0.5;
        document.getElementById("load_img").width =  size * cnt; 
        document.getElementById("load_img").height =  size;
        var cont = document.getElementById("load_img").getContext("2d");
        cont.drawImage(img, 0,0);
        this.img = cont.getImageData(texid * size, 0, size, size);
        cont.clearRect(0, 0, 1000, 1000);
        this.dmgSound = new Audio("sounds/monsters/damage1.mp3");

        this.a = 0;

        this.is_moving = false;
        this.distanceView = 4;
        
        if (this.type == VIPER_CLAWLER) {
            this.maxHP = 100;
            this.damage = 10;
            this.attackSpeed = 100;
            this.attackDistance = 0.5;
            this.moveSpeed = 0.075;
            while (this.affix == DISTANCER) this.affix =  Math.round(Math.random() * COUNT_AFFIXES);
        }
        else if (this.type == VIPER_FIREWARD) {
            this.distanceView = 6;
            this.maxHP = 100;
            this.damage = 10;
            this.attackSpeed = 5000;
            this.attackDistance = 3.5;
            this.moveSpeed = 0.075;
            this.randomGoingTimer = 0;
        }
        else if (this.type == REIK) {
            this.maxHP = 200;
            this.damage = 15;
            this.attackSpeed = 500;
            this.attackDistance = 0.5;
            this.maxAttackDistance = 2;
            this.moveSpeed = 0.1;
            while (this.affix != NO_AFFIXES && this.affix != HEAVY) this.affix =  Math.round(Math.random() * 2);
        }
        else if (this.type == MOOGUN) {
            this.maxHP = 500;
            this.damage = 80;
            this.attackSpeed = 10000;
            this.attackDistance = 4;
            this.moveSpeed = 0.1;
        }
        else if (this.type == DEMON) {
            this.maxHP = 50000;
            this.damage = 1000;
            this.attackSpeed = 0;
            this.attackDistance = 1;
            this.moveSpeed = 0;
            this.affix = NO_AFFIXES;
        }
        else if (this.type == TURRET) {
            this.maxHP = 150;
            this.damage = 5;
            this.attackSpeed = 25;
            this.attackDistance = 3.5;
            this.moveSpeed = 0;
            while (this.affix == SPEED || this.affix == TELEPORT) this.affix =  Math.round(Math.random() * COUNT_AFFIXES);
        }
        else if (this.type == BUMBLEBEE) {
            this.maxHP = 50000;
            this.damage = 90;
            this.attackSpeed = 500;
            this.attackDistance = 1;
            this.moveSpeed = 0.05;
            while (this.affix == DISTANCER) this.affix =  Math.round(Math.random() * COUNT_AFFIXES);
        }

        this.hp = this.maxHP;

        var imgSize = this.img.width * this.img.height * 4;
        if (this.affix == HEAVY) {
            this.hp += 150;
            for (var i = 2; i < imgSize; i += 4) {
                this.img.data[i] += 100;
                if (this.img.data[i] > 255) this.img.data[i] = 255;
            }
        }
        else if (this.affix == POWER) {
            this.damage += 10;
            for (var i = 0; i < imgSize; i += 4) {
                this.img.data[i] += 100;
                if (this.img.data[i] > 255) this.img.data[i] = 255;
            }        
        }
        else if (this.affix == SPEED) {
            this.moveSpeed += 0.1;
            for (var i = 0; i < imgSize; i += 4) {
                this.img.data[i] += 75;
                this.img.data[i + 1] += 75;
                if (this.img.data[i] > 255) this.img.data[i] = 255;
                if (this.img.data[i + 1] > 255) this.img.data[i + 1] = 255;
            }
        }
        else if (this.affix == PLAGUE) {
            this.plagueDamage = 5; 
            this.plaguePeriod = 1000;
            this.plagueDistance = 3;
            this.is_plague_active = false;
            for (var i = 1; i < imgSize; i += 4) {
                this.img.data[i] += 100;
                if (this.img.data[i] > 255) this.img.data[i] = 255;
            }  
        }
        else if (this.affix == DEAD_TOUCH) {
            this.timer = [0, 0];
            this.cur_timer = 0;
            this.courseCoeff = 2; // reduce hp of oppenent in two times
            this.courseTime = 10000; 
            for (var i = 0; i < imgSize; i += 4) {
                this.img.data[i] -= 50;
                this.img.data[i + 1] -= 50;
                this.img.data[i + 2] -= 50;
                if (this.img.data[i] < 0) this.img.data[i] = 0;
                if (this.img.data[i + 1] < 0) this.img.data[i + 1] = 0;
                if (this.img.data[i + 2] < 0) this.img.data[i + 2] = 0;
            }  
        }
        else if (this.affix == BLIND) {
            this.timer = [0, 0];
            this.cur_timer = 0;
            this.blindCoeff = 2; // reduce FIELD_OF_VIEW in 2 times
            this.blindTime = 10000;
            for (var i = 0; i < imgSize; i += 4) {
                this.img.data[i] += 50;
                this.img.data[i + 1] += 70;
                this.img.data[i + 2] += 90;
                if (this.img.data[i] > 255) this.img.data[i] = 255;
                if (this.img.data[i + 1] > 255) this.img.data[i + 1] = 255;
                if (this.img.data[i + 2] > 255) this.img.data[i + 2] = 255;
            } 
        }
        else if (this.affix == SLOW) {
            this.timer = [0, 0];
            this.cur_timer = 0;
            this.slowSpeedCoeff = 2; // reduce speed in 2 times
            this.slowSpeedTime = 10000;
            for (var i = 0; i < imgSize; i += 4) {
                this.img.data[i] += 100;
                this.img.data[i + 1] += 65;
                if (this.img.data[i] > 255) this.img.data[i] = 255;
                if (this.img.data[i + 1] > 255) this.img.data[i + 1] = 255;
            } 
        }
        else if (this.affix == TELEPORT) {
            this.teleportTime = 125;
            this.isTeleporting = false;
            document.getElementById("load_img").width =  size; 
            document.getElementById("load_img").height =  size;
            var cont = document.getElementById("load_img").getContext("2d");
            cont.drawImage(blink, 0,0);
            this.blink = cont.getImageData(0, 0, size, size);
            cont.clearRect(0, 0, 1000, 1000);
            this.isTeleported = false;
            this.teleportDistance = 3;
            this.teleportEffect = null;
            this.teleportCoolDown = 15000;
            for (var i = 1; i < imgSize; i += 4) {
                this.img.data[i] += 84;
                this.img.data[i + 1] += 120;
                if (this.img.data[i] > 255) this.img.data[i] = 255;
                if (this.img.data[i + 1] > 255) this.img.data[i + 1] = 255;
            } 
        }
        else if (this.affix == DISTANCER) {
            this.attackDistance += 1;
            for (var i = 1; i < imgSize; i += 4) {
                this.img.data[i] += 150;
                this.img.data[i + 1] += 20;
                this.img.data[i + 2] += 100;
                if (this.img.data[i] > 255) this.img.data[i] = 255;
                if (this.img.data[i + 1] > 255) this.img.data[i + 1] = 255;
                if (this.img.data[i + 2] > 255) this.img.data[i + 2] = 255;
            } 
        }
        else if (this.affix == REGENERATOR) {
            this.regenerate = 10; // hp per second
            this.regenerateCoolDown = 1000;
            this.regenerateRadius = 3;
            for (var i = 1; i < imgSize; i += 4) {
                this.img.data[i] += 30;
                this.img.data[i + 1] += 60;
                this.img.data[i + 2] += 90;
                if (this.img.data[i] > 255) this.img.data[i] = 255;
                if (this.img.data[i + 1] > 255) this.img.data[i + 1] = 255;
                if (this.img.data[i + 2] > 255) this.img.data[i + 2] = 255;
            } 
        }

        this.is_alive = true;
    }
    
    blood(x, y) {
        var coord = 4*(x + y * this.size);
        var coordL = coord - 4;
        var coordR = coord + 4;
        var coordU = 4*(x + (y + 1) * this.size);
        var coordUR = coordU + 4;
        var coordUL = coordU - 4;
        var coordD = 4*(x + (y - 1) * this.size);
        var coordDR = coordD + 4;
        var coordDL = coordD - 4;
        this.put_pixel(coord, 152, 0, 2, 255);
        if (coordL >= 0 && this.img.data[coordL + 3] > 128 && Math.random() > 0.5) this.put_pixel(coordL, 152, 0, 2, 255);
        if (coordR < this.size * this.size * 4 && this.img.data[coordR + 3] > 128 && Math.random() > 0.5) this.put_pixel(coordR, 152, 0, 2, 255);
        if (coordU < this.size * this.size * 4 && this.img.data[coordU + 3] > 128 && Math.random() > 0.5) this.put_pixel(coordU, 152, 0, 2, 255);
        if (coordUR < this.size * this.size * 4 && this.img.data[coordUR + 3] > 128 && Math.random() > 0.5) this.put_pixel(coordUR, 152, 0, 2, 255);
        if (coordUL < this.size * this.size * 4 && this.img.data[coordUL + 3] > 128 && Math.random() > 0.5) this.put_pixel(coordUL, 152, 0, 2, 255);
        if (coordD >= 0 && this.img.data[coordD + 3] > 128 && Math.random() > 0.5) this.put_pixel(coordD, 152, 0, 2, 255);
        if (coordDR >= 0 && this.img.data[coordDR + 3] > 128 && Math.random() > 0.5) this.put_pixel(coordDR, 152, 0, 2, 255);
        if (coordDL >= 0 && this.img.data[coordDL + 3] > 128 && Math.random() > 0.5) this.put_pixel(coordDL, 152, 0, 2, 255);
    }

    lose_damage(dmg, x, y) {
        this.dmgSound.currentTime = 0.0;
        this.dmgSound.play();
        this.hp -= dmg;
        this.blood(x, y);
        if (this.hp <= 0) this.kill();
    }

    kill() {
        console.log(this.affix);
        if (this.type == REIK) {
            var dist = _distance(this.x, this.y, player.x, player.y);
            if (dist <= this.maxAttackDistance) 
                player.lose_damage(this.damage / dist);
        }
        for (var i = 0; i < sprites.length; ++i) 
            if (sprites[i] == this) 
                sprites.splice(i, 1);
        this.is_alive = false;
     }

     stop_dead_touch() {
         player.hp = player.realHP;
        player.maxHP *= this.courseCoeff;
        player.is_dead_touched = false; 
     }

     dead_touch() {
         if (player.is_cursed) return;
        player.maxHP /= this.courseCoeff;
        player.hp /= this.courseCoeff;
        player.is_dead_touched = true; 
        clearTimeout(this.timer[this.cur_timer % 2]);
        ++this.cur_timer;
        this.timer[this.cur_timer % 2] = setTimeout(function() {this.stop_dead_touch()}.bind(this), this.courseTime);

     }
     animate_decrese_view_distance(max_value) {
        MAX_VIEW_DISTANCE -= 0.1;
        if (MAX_VIEW_DISTANCE > max_value / 2) setTimeout(function() { this.animate_decrese_view_distance(max_value);}.bind(this), GAME_TICK);
     }

     animate_increse_view_distance(min_value) {
        MAX_VIEW_DISTANCE += 0.1;
        if (MAX_VIEW_DISTANCE < min_value * 2) setTimeout(function() { this.animate_increse_view_distance(min_value);}.bind(this), GAME_TICK);
        else player.is_blinded = false;
     }

     stop_blind() {
        this.animate_increse_view_distance(MAX_VIEW_DISTANCE);
    }

    blind() {
        if (player.is_blinded) return;
       //MAX_VIEW_DISTANCE /= this.blindCoeff;
       this.animate_decrese_view_distance(MAX_VIEW_DISTANCE);
       player.is_blinded = true; 
       clearTimeout(this.timer[this.cur_timer % 2]);
       ++this.cur_timer;
       this.timer[this.cur_timer % 2] = setTimeout(function() {this.stop_blind()}.bind(this), this.blindTime);

    }

    stop_slow() {
        player.maxSpeed *= this.slowSpeedCoeff;
        player.zMaxSpeed *= this.slowSpeedCoeff;
        player.is_slowed = false;
    }

    slow() {
        if (player.is_slowed) return;
        player.maxSpeed /= this.slowSpeedCoeff;
        player.zMaxSpeed /= this.slowSpeedCoeff;
        player.is_slowed = true;
        clearTimeout(this.timer[this.cur_timer % 2]);
        ++this.cur_timer;
        this.timer[this.cur_timer % 2] = setTimeout(function() {this.stop_slow()}.bind(this), this.slowSpeedTime);
    }

     damageAffixes() {
        if (this.affix == DEAD_TOUCH) this.dead_touch();
        if (this.affix == BLIND) this.blind();
        if (this.affix == SLOW) this.slow();
     }

     attackManager() {
         switch(this.type) {
            case VIPER_CLAWLER: this.attack_VIPER_CLAWLER(); break;
            case VIPER_FIREWARD: this.attack_VIPER_FIREWARD(); break;
            case REIK: this.attack_REIK(); break;
            case MOOGUN: this.attack_MOOGUN(); break;
            case DEMON: this.attack_DEMON(); break;
            case TURRET: this.attack_TURRET(); break;
            case BUMBLEBEE: this.attack_BUMBLEBEE(); break;
         }

         if (this.affix == PLAGUE) this.plague(); 
         if (this.affix == REGENERATOR) this.regenerating();
     }

     regenerating() {
        if (!this.is_alive) return;
        for (var i = 0; i < sprites.length; ++i) {
            if (_distance(this.x, this.y, sprites[i].x, sprites[i].y) < this.regenerateRadius) 
                if (sprites[i].hp < sprites[i].maxHP) sprites[i].hp = Math.max(sprites[i].hp + this.regenerate, sprites[i].maxHP);
        }

        setTimeout(function() {this.regenerating();}.bind(this), this.regenerateCoolDown);
     }

     plague() {
         if (!this.is_alive) {
            if (this.is_plague_active != false) active_plaguers--;
            this.is_plague_active = false;
            if (active_plaguers <= 0) player.is_plagued = false;
             return;
         }
        var dist = _distance(this.x, this.y, player.x, player.y);
        if (dist <= this.plagueDistance) {
            if (this.is_plague_active != true) {
                this.is_plague_active = true;
                active_plaguers++;
                player.is_plagued = true;
            }
            player.lose_damage(this.plagueDamage);
        }
        else {
            if (this.is_plague_active != false) active_plaguers--;
            this.is_plague_active = false;
            if (active_plaguers <= 0) player.is_plagued = false;
        }
         setTimeout(function() {this.plague();}.bind(this), this.plaguePeriod);
     }

     teleport(angle = Math.random() * PI * 2) {
         this.isTeleported = true;
        var distance = Math.random() * this.teleportDistance;
        var cx = this.x + distance * Math.cos(angle);
        var cy = this.y + distance * Math.sin(angle);
        while (!currentMap.is_empty(Math.floor(cx), Math.floor(cy))) {
            distance = Math.random() * this.teleportDistance;
            angle = Math.random() * PI * 2;
            cx = this.x + distance * Math.cos(angle);
            cy = this.y + distance * Math.sin(angle);
        }
        this.x = cx;
        this.y = cy;
        setTimeout(function(){ this.isTeleporting = false;}.bind(this), this.teleportTime);
        setTimeout(function(){ this.isTeleported = false;}.bind(this), this.teleportCoolDown);
     }

     attack_VIPER_CLAWLER() {
        if (!this.is_alive) return;
         var distToPlayer = _distance(this.x, this.y, player.x, player.y);
        if (distToPlayer <= this.distanceView) {
            if (distToPlayer <= this.attackDistance) {
                player.lose_damage(this.damage);
                this.damageAffixes();
            }
            else if (this.affix == TELEPORT && !this.isTeleported) {
                var angle =  lineAngle(this.x, this.y, player.x, player.y);
                if (player.x - this.x < 0 && (angle > -PI / 2 && angle < PI / 2)) angle -= PI;
                if (player.y - this.y < 0 && (angle > 0 && angle < PI)) angle -= PI;
                this.isTeleporting = true;
                setTimeout(function() {this.teleport(angle);}.bind(this), this.teleportTime);

             }
            else if (!this.is_moving) {
                this.is_moving = true;
               setTimeout(function() { this.moveToPlayer(); }.bind(this),500);
            }
        }
         setTimeout(function() { this.attack_VIPER_CLAWLER()}.bind(this),this.attackSpeed)
     }

     attack_VIPER_FIREWARD() {
        if (!this.is_alive) return;
        var distToPlayer = _distance(this.x, this.y, player.x, player.y);
        if (distToPlayer <= this.distanceView) {
           
            if (distToPlayer <= this.attackDistance) {
                var angle =  lineAngle(this.x, this.y, player.x, player.y);
                this.a = angle;
                if (player.x - this.x < 0 && (angle > -PI / 2 && angle < PI / 2)) angle -= PI;
                var cx = this.x + player.maxSpeed * Math.cos(angle);
                if (player.y - this.y < 0 && (angle > 0 && angle < PI)) angle -= PI;
                var cy = this.y + player.maxSpeed * Math.sin(angle);
                 this.shell_move(angle, make_object(cx, cy, 0, true, shell_fireball_drawen, SHELL_FIREBALL_COUNT));
                 if (this.affix == TELEPORT && !this.isTeleported) {
                    this.isTeleporting = true;
                    setTimeout(function() {this.teleport();}.bind(this), this.teleportTime);

                 }
                 else if (!this.is_moving) {
                    var goOrNot = Math.random();
                    if (goOrNot > 0.8) {
                        var max_distance = this.attackSpeed * this.moveSpeed / GAME_TICK;
                        var distance = Math.random() * max_distance;
                        var angle = Math.random() * PI * 2;
                        this.a = angle;
                        this.random_move(distance, angle);
                    }
                 }
            }
            else if (!this.is_moving) {
                this.is_moving = true;
               setTimeout(function() { this.moveToPlayer(); }.bind(this),500);
            }
        }
         setTimeout(function() { this.attack_VIPER_FIREWARD()}.bind(this),this.attackSpeed)
     }

     attack_REIK() {
        if (!this.is_alive) return;
         var distToPlayer = _distance(this.x, this.y, player.x, player.y);
        if (distToPlayer <= this.distanceView) {
            if (distToPlayer <= this.attackDistance) {
                console.log(distToPlayer);  
                player.lose_damage(this.damage / distToPlayer);
                this.kill();
            }
            else if (!this.is_moving) {
                this.is_moving = true;
               setTimeout(function() { this.moveToPlayer(); }.bind(this),500);
            }
        }
         setTimeout(function() { this.attack_REIK()}.bind(this),this.attackSpeed)
     }

     random_move(distance, angle) {
         if (!this.is_alive || !this.is_moving) {
            this.is_moving = false;
            return;
         }

         var cx = this.x + this.moveSpeed * Math.cos(angle);
         var cy = this.y + this.moveSpeed * Math.sin(angle);
     
     var change_x = true;
     var change_y = true;
     
     if (!currentMap.is_empty(Math.floor(cx), Math.floor(this.y))) 
          change_x = false;
     if (!currentMap.is_empty(Math.floor(this.x), Math.floor(cy))) 
          change_y = false;

     for (var i = 0; i < sprites.length; ++i) {
         if (sprites[i] == this) continue;
         var dist_x = _distance(sprites[i].x, sprites[i].y, cx, this.y);
         var dist_y = _distance(sprites[i].x, sprites[i].y, this.x, cy);
         if (dist_x < this.bodySize) change_x = false;
         if (dist_y < this.bodySize) change_y = false;
     }
     if (change_x) 
         this.x = cx;
     if (change_y) 
         this.y = cy;
     if (!change_x && !change_y) angle = Math.random() * 2 * PI;
     this.a = angle;
     distance -= this.moveSpeed;
     
     if (distance > this.bodySize) this.randomGoingTimer = setTimeout(function() { this.random_move(distance, angle);}.bind(this), GAME_TICK);
     else this.is_moving = false;


     }

     shell_move(angle, shell) {
         shell.x = shell.x + player.maxSpeed * Math.cos(angle);
         shell.y = shell.y + player.maxSpeed * Math.sin(angle);
            if (_distance(shell.x, shell.y, player.x, player.y) < 0.5) {
                shell.remove();
                player.lose_damage(this.damage);
                this.damageAffixes();
                return;
            }

            if (!currentMap.is_empty(Math.floor(shell.x), Math.floor(shell.y))){ 
                shell.remove();
                return;
            }

         setTimeout(function() {this.shell_move(angle, shell)}.bind(this), GAME_TICK);
     }


     moveToPlayer() {
        var distToPlayer = _distance(player.x, player.y, this.x, this.y);
        if (distToPlayer > this.distanceView || distToPlayer <= this.attackDistance || !this.is_alive) {
            this.is_moving = false;
            return;
        }
        
         var angle = lineAngle(player.x, player.y, this.x, this.y);
        
         var cx;
         var cy;
        if (player.x - this.x < 0 && (angle > -PI / 2 && angle < PI / 2)) angle -= PI;
            cx = this.x + this.moveSpeed * Math.cos(angle);
        if (player.y - this.y < 0 && (angle > 0 && angle < PI)) angle -= PI;
             cy = this.y + this.moveSpeed * Math.sin(angle);
        
        var change_x = true;
        var change_y = true;
        
        if (!currentMap.is_empty(Math.floor(cx), Math.floor(this.y))) 
             change_x = false;
        if (!currentMap.is_empty(Math.floor(this.x), Math.floor(cy))) 
             change_y = false;

        for (var i = 0; i < sprites.length; ++i) {
            if (sprites[i] == this) continue;
            var dist_x = _distance(sprites[i].x, sprites[i].y, cx, this.y);
            var dist_y = _distance(sprites[i].x, sprites[i].y, this.x, cy);
            if (dist_x < this.bodySize) change_x = false;
            if (dist_y < this.bodySize) change_y = false;
        }
        if (change_x) this.x = cx;
        if (change_y) this.y = cy;
        this.a = angle;
       setTimeout(function() { this.moveToPlayer();}.bind(this), GAME_TICK);

     }




    get_pixel(x, y, image = this.img) {
        var coord = 4*(x + y * this.size);
        return [image.data[coord + 0], image.data[coord + 1], image.data[coord + 2], image.data[coord + 3]];
    }

    put_pixel(coord, r, g, b, a) {
        this.img.data[coord + 0] = r;
        this.img.data[coord + 1] = g;
        this.img.data[coord + 2] = b;
        this.img.data[coord + 3] = a;
    }
}