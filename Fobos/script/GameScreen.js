




class GameScreen {
    constructor() {
        this.canvas = document.getElementById("game");
        this.canvas.width =  $(window).width(); 
        this.canvas.height =  $(window).height();
        this.ctx = this.canvas.getContext("2d"); 
        this.w = $(window).width(); 
        this.h = $(window).height();
        this.imgData = this.ctx.getImageData(0,0,this.w, this.h);
        this.depth_buffer = new Array(this.w * this.h).fill(1e3);
        this.monsters_buffer = new Array(this.w * this.h).fill(0);
        console.log(this.w + " " + this.h);
        window.addEventListener('resize', (function() {this.resize();}).bind(this));


        
        this.countAsyncFuncs = 4;
        this.asyncFuncsArray = new Array(this.countAsyncFuncs);
        setTimeout(function() {GS.launchAsyncFunctions()}, 20);
    }

    launchAsyncFunctions() {
        var step = Math.floor(this.w / this.countAsyncFuncs);
        for (var i = 0; i < this.countAsyncFuncs; ++i) {
            let st = i * step;
            let en = st + step;
            if (i == this.countAsyncFuncs - 1) en = this.w;
            this.asyncFuncsArray[i] = async function() {
                this.rend_quart_screen(st, en, currentMap, currentTexture);
            }.bind(this);
            
        }
    }
    

    resize() {
        this.w = $(window).width(); 
        this.h = $(window).height();
        this.canvas.width =  this.w; 
        this.canvas.height =  this.h;
        this.depth_buffer = new Array(this.w * this.h).fill(1e3);
        this.monsters_buffer = new Array(this.w * this.h).fill(0);
        this.imgData = this.ctx.getImageData(0,0,this.w, this.h);
        this.draw();

        this.asyncFuncsArray = new Array();
        this.launchAsyncFunctions();
    }
    

    clear() {
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.depth_buffer.fill(1e3);
        this.monsters_buffer.fill(0);
        this.imgData = this.ctx.getImageData(0,0,this.w, this.h);
    }

    pack_color(x, y, r = 0, g = 0, b = 0, a = 255) {
        var coord = ((y * this.w) + x) << 2;
        this.imgData.data[coord + 0] = r;
        this.imgData.data[coord + 1] = g;
        this.imgData.data[coord + 2] = b;
        this.imgData.data[coord + 3] = a;
    }

    draw_amunition() {
        var x = (this.w >> 1) - (GUN_WIDTH >> 2) + 150 + 304;
        if (player.gun.ammunition < 10) x += 14;
        else if (player.gun.ammunition >= 100) x -= 15;
        var y = this.h - GUN_HEIGHT + 50 + 120;
        this.ctx.font = "40pt Arial Italic";
        this.ctx.fillStyle = "#E46F11";
        this.ctx.fillText(player.gun.ammunition, x, y);
    }


    draw() {
        this.ctx.putImageData(this.imgData,0,0);
        this.draw_gun();
        this.draw_gui();
    }

    set_rectangle(x, y, w, h, r, g, b, a = 255, pred = function(x,y) {return true;}) {
        y = Math.floor(y);
        x = Math.floor(x);
        for (var i = 0; i < w; ++i) {
            var cx = x + i;
            if (cx >= this.w) continue;
            for (var j = 0; j < h; ++j) {
                var cy = y + j;
                if (cy >= this.h || !(pred(cx, cy))) continue;
                this.pack_color(cx, cy, r, g, b, a);
            }
        }
    }

    map_set_player(pos_x, pos_y, rect_h, rect_w) {
        var x = pos_x + Math.floor(player.x * rect_w);
        var y = pos_y + Math.floor(player.y * rect_h);

            var cont = document.getElementById("load_img").getContext("2d");
            cont.save();
            cont.translate(8, 8);
            cont.rotate(player.a);
            cont.drawImage(playerMark,-8, -8);
            var data = cont.getImageData(0,0, 16 ,16);
            cont.restore();
            cont.clearRect(0,0,1000,1000);

            for (var i = 0; i < data.width; ++i)
                for (var j = 0; j < data.height; ++j) {
                    var coord = ((j << 4) + i) << 2;
                    if (data.data[coord + 3] > 180) 
                        this.pack_color(x - 8 + i, y - 8 + j, data.data[coord + 0],data.data[coord + 1], data.data[coord + 2],  data.data[coord + 3]);
                }
                    
    }


    set_map(map, sprites, texture) { // draw the map
        const rect_w = 512 / map.w;
        const rect_h = 512 / map.h;
        const pos_y =  (Math.floor(this.h*3.3) >> 2) - Math.floor(player.y * rect_h);
        const pos_x =  150 - Math.floor(player.x * rect_w);
       
        for (var j = 0; j < map.h; ++j) {
            var rect_y = pos_y + j * rect_h;
            for (var i = 0; i < map.w; ++i) {
                var rect_x = pos_x + i * rect_w;

               var pred = function(x, y) {
                var distance = Math.sqrt(Math.pow(Math.abs(x - (pos_x + Math.floor(player.x * rect_w))), 2) + Math.pow(Math.abs(y - (pos_y + Math.floor(player.y * rect_h))), 2));
                if (distance > 125) return false;
                return true;
               }
               var id = map.map[i + j * map.w];
                if (id == ' ') 
                    this.set_rectangle(rect_x, rect_y, rect_w, rect_h, 104, 74, 32, 255, pred);        
                else {
                    id = parseInt(id);
                    var colors = texture.get_pixel(0, 0, id);
                    this.set_rectangle(rect_x, rect_y, rect_w, rect_h, colors[0], colors[1], colors[2], colors[3], pred);
                }
            }
        }
        for (var i = 0; i < sprites.length; ++i)  {
            var coord_x = pos_x + sprites[i].x * rect_w;
            var coord_y = pos_y + sprites[i].y * rect_h; 
            if (pred(coord_x, coord_y)) 
            this.set_rectangle(coord_x - 3, coord_y - 3, 6, 6, 255, 0, 0);
        }

        this.map_set_player(pos_x, pos_y, rect_h, rect_w, pred);
    }

    disToWall(map, angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle)

        var distance = 0;
       // var step = 0.05 ;
        var step = 1;
        for (; true; distance += step) {
            var cx = Math.floor(player.x + distance * cos);
            var cy = Math.floor(player.y + distance * sin);
            if (!map.is_empty(cx, cy)) {
                if (step < 1e-3)  break;
                distance -= step;
                step /= 10;
            }
            if (distance > MAX_VIEW_DISTANCE) return -1;
        }
        return distance;
    }

    texture_column(cx, cy, pix_x, texture, texid, column_height, distance) {
        var hitx = cx - Math.floor(cx + 0.5); // hitx and hity contain (signed) fractional parts of cx and cy,
        var hity = cy - Math.floor(cy + 0.5); // they vary between -0.5 and +0.5, and one of them is supposed to be very close to 0
        var x_texcoord = hitx * texture.size;
        if (Math.abs(hity) > Math.abs(hitx)) {
            x_texcoord = hity * texture.size;
        }
        if (x_texcoord < 0) x_texcoord += texture.size; // do not forget x_texcoord can be negative, fix that

        var img_x = Math.floor(texid * texture.size + x_texcoord);
        const img_w = texture.size*texture.cnt;
        var pix_y;
        var add_y =  (this.h >> 1) - (column_height >> 1)  + player.z + player.aZ;
      //  var y_cof = column_height / texture.size;
        var y_cof = texture.size / column_height;
        for (var j = Math.max(-add_y, 0); j < column_height; ++j) {
            pix_y = Math.floor(j + add_y);
            if (pix_y >= this.h) break;
            var img_y = Math.floor(j * y_cof);
            var it = (img_x + img_y*img_w) << 2; 
            this.depth_buffer[pix_x + pix_y * this.w] = distance;
            
            this.pack_color(pix_x, pix_y, texture.walls.data[it + 0], texture.walls.data[it + 1], texture.walls.data[it + 2], texture.walls.data[it + 3]);
        } 
      /* this.ctx.scale(1, y_cof);
       add_y /= y_cof;
        this.ctx.drawImage(lvl1_walls, img_x, 0, 1, texture.size, pix_x, add_y, 1, texture.size);
        this.ctx.scale(1, 1 / y_cof);
        pix_y = add_y + column_height; */
        return pix_y;
    }

    draw_sprite(sprite) {
        var sprite_dir = Math.atan2(sprite.y - player.y, sprite.x - player.x);
        
        var relat_angle = sprite_dir - player.a;
        if (relat_angle > PI) relat_angle = (relat_angle % (2 * PI)) - 2 * PI;
        if (relat_angle < -PI) relat_angle = (relat_angle % (2 * PI)) + 2 * PI;

        var sprite_dist = Math.sqrt(Math.pow(player.x - sprite.x, 2) + Math.pow(player.y - sprite.y, 2)); // distance from the player to the sprite
        if (sprite_dist > MAX_VIEW_DISTANCE) return;    
        var sprite_screen_size = 1000;
        if (sprite_dist != 0) 
             sprite_screen_size = Math.min(1000, this.h / sprite_dist); // screen sprite size
        var h_offset = Math.floor(relat_angle * this.w / player.fov  + (this.w / 2) - sprite_screen_size / 2); // do not forget the 3D view takes only a half of the framebuffer
        var v_offset = Math.floor(this.h / 2 - sprite_screen_size / 2 + player.z + player.aZ + sprite.Z);
        var mult = sprite.size / sprite_screen_size;
       //var mult = sprite_screen_size / sprite.size;
        for (var i = Math.max(-h_offset, 0); i < sprite_screen_size; ++i) {
            var x = h_offset + i;
            if (x >= this.w) break;;
            for (var j = Math.max(-v_offset, 0); j < sprite_screen_size; ++j) {
                var y = v_offset + j; 
                if (y >= this.h) break;
                var it = Math.floor(x) + Math.floor(y * this.w);
                
                if (this.depth_buffer[it] < sprite_dist) 
                    continue;   // this sprite pixel is occluded
                
                var img_x = Math.floor(i * mult);
                var img_y = Math.floor(j * mult);
                var color;
                if (sprite.isTeleporting)
                     color = sprite.get_pixel(img_x, img_y, sprite.blink);
                else color = sprite.get_pixel(img_x, img_y);
                if (color[3] > 128) {
                this.pack_color(x, y, color[0], color[1], color[2], color[3]);
                this.monsters_buffer[it] = [sprite, img_x, img_y];
                this.depth_buffer[it] = sprite_dist;
                }
            }
        }
       /* this.ctx.scale(mult, mult);
        h_offset /= mult;
        v_offset /= mult;
        if (!sprite.isTeleporting)
            this.ctx.drawImage(lvl1_monsters, sprite.texid * sprite.size, 0, sprite.size, sprite.size, h_offset, v_offset, sprite.size, sprite.size);
        else this.ctx.drawImage(blink, 0, 0, sprite.size, sprite.size, h_offset, v_offset, sprite.size, sprite.size);
         this.ctx.scale(1 / mult, 1 / mult);*/
    }

    draw_gun() {
        var x = (this.w >> 1) - (GUN_WIDTH >> 2) + 150;
        var y = this.h - GUN_HEIGHT + 50;
        if (player.gun.is_shoot == true) {
            this.ctx.scale(player.gun.scaleAnim, player.gun.scaleAnim);
            
            var sizeAnim = Math.floor(SHOOT_SIZE * player.gun.scaleAnim);
            var x_anim = Math.floor(x + 110 - (sizeAnim >> 1));
            var y_anim = Math.floor(y + 81 - (sizeAnim >> 1));
            //x_anim /= player.gun.scaleAnim;
            //y_anim /= player.gun.scaleAnim;

            this.ctx.drawImage(shoot_anim, x_anim, y_anim);
           /* for (var i = 0; i < sizeAnim; ++i) {
            var sh_x = Math.floor(i / player.gun.scaleAnim);
                for (var j = 0; j < sizeAnim; ++j) {
                    var sh_y = Math.floor(j / player.gun.scaleAnim);
                    var coord = Math.floor((sh_y * SHOOT_SIZE) + sh_x) << 2;
                    if (player.gun.shootAnim.data[coord + 3] > 230)  
                        this.pack_color(x_anim + i, y_anim + j, player.gun.shootAnim.data[coord + 0], player.gun.shootAnim.data[coord + 1], player.gun.shootAnim.data[coord + 2],  player.gun.shootAnim.data[coord + 3]);
                }
            }*/
            this.ctx.scale(1 / player.gun.scaleAnim, 1 / player.gun.scaleAnim);
        }

        this.ctx.drawImage(UI_GUN_0, x, y);

      /*  for (var i = 0; i < player.gun.sprite.width; ++i)
            for (var j = 0; j < player.gun.sprite.height; ++j) {
                var coord = ((j * player.gun.sprite.width) + i) << 2;
                if (player.gun.sprite.data[coord + 3] > 230) 
                    this.pack_color(x + i, y + j, player.gun.sprite.data[coord + 0], player.gun.sprite.data[coord + 1], player.gun.sprite.data[coord + 2],  player.gun.sprite.data[coord + 3]);
            }*/
    }

    draw_hp() {
        var x = (this.w >> 1) - (GUN_WIDTH >> 2) + 150 + 297;
        var y = this.h - GUN_HEIGHT + 50 + 135;
        var h = 20;
        var w = Math.floor(player.hp / 1.4);
        var realW = Math.floor(player.realHP / 1.4);
        var maxW = Math.floor(player.maxHP / 1.4);
       // this.set_rectangle(x - 1, y - 1, 51, h + 2, 3, 11, 12, 100);
       this.ctx.fillStyle = "rgb(11, 12, 100)";
        this.ctx.fillRect(x - 1, y - 1, maxW, h + 2);
        if (player.is_dead_touched) {
            this.ctx.fillStyle = "rgba(3, 116, 100, 88 / 255)";
            this.ctx.fillRect(x, y, realW, h);
        }
            //this.set_rectangle(x, y, realW, h, 3, 116, 100, 88);
        if (player.hp > 0) {
            if (player.is_plagued) {
                this.ctx.fillStyle = "rgb(8, 145, 59)";
                this.ctx.fillRect(x, y, w, h);
            }
            //    this.set_rectangle(x, y, w, h,  8, 145, 59);
            else {
                this.ctx.fillStyle = "rgb(221, 5, 3)";
                this.ctx.fillRect(x, y, w, h);
            }
            //  this.set_rectangle(x, y, w, h,  221, 5, 3);
        }
    }   

    draw_gui() {
        var center_x = this.w >> 1;
        var center_y = this.h >> 1;
        this.ctx.fillStyle = "rgb(0, 255, 0)";
        this.ctx.fillRect(center_x + 4, center_y - 2, 10, 4);
        this.ctx.fillStyle = "rgb(0, 255, 0)";
        this.ctx.fillRect(center_x - 14, center_y - 2, 10, 4);
        this.ctx.fillStyle = "rgb(0, 255, 0)";
        this.ctx.fillRect(center_x - 2, center_y + 4, 4, 10);
        this.ctx.fillStyle = "rgb(0, 255, 0)";
        this.ctx.fillRect(center_x - 2, center_y - 14, 4, 10);
        /*this.set_rectangle(center_x + 4, center_y - 2, 10, 4, 0, 255, 0);
        this.set_rectangle(center_x - 14, center_y - 2, 10, 4, 0, 255, 0);
        this.set_rectangle(center_x - 2, center_y + 4, 4, 10, 0, 255, 0);
        this.set_rectangle(center_x - 2, center_y - 14, 4, 10, 0, 255, 0);*/
        this.draw_hp();
        this.draw_amunition();
    }



    draw_object(obj) {
        
            // absolute direction from the player to the object (in radians)
            var obj_dir = Math.atan2(obj.y - player.y, obj.x - player.x);
        
            var relat_angle = obj_dir - player.a;
            if (relat_angle > PI) relat_angle = (relat_angle % (2 * PI)) - 2 * PI;
            if (relat_angle < -PI) relat_angle = (relat_angle % (2 * PI)) + 2 * PI;
    
            var obj_dist = Math.sqrt(Math.pow(player.x - obj.x, 2) + Math.pow(player.y - obj.y, 2)); // distance from the player to the object
            if (obj_dist > MAX_VIEW_DISTANCE) return;    
            var obj_screen_size = 250;
            if (obj_dist != 0) 
                 obj_screen_size = Math.min(250, (this.h / obj_dist) / 8); // screen object size
            var h_offset = Math.floor(relat_angle * this.w / player.fov  + (this.w / 2) - obj_screen_size / 2); // do not forget the 3D view takes only a half of the framebuffer
            var v_offset = Math.floor(this.h / 2 - obj_screen_size / 2 + player.z + player.aZ + obj.Z);
            var mult = obj.size / obj_screen_size;
            for (var i = 0; i < obj_screen_size; ++i) {
                var x = h_offset + i;
                if (x < 0 || x >= this.w) continue;
                for (var j = 0; j < obj_screen_size; ++j) {
                    var y = v_offset + j; 
                    
                    if (y < 0 || y >= this.h) continue;
                    var it = Math.floor(x) + Math.floor(y * this.w);
                    
                    if (this.depth_buffer[it] < obj_dist) 
                        continue;   // this sprite pixel is occluded
                    
                    
                    var color = obj.get_pixel(Math.floor(i * mult), Math.floor(j * mult));
                    
                    if (color[3] > 128) {
                    this.pack_color(x, y, color[0], color[1], color[2], color[3]);
                    this.depth_buffer[it] = obj_dist;
                    }
                }
            }
            if (obj.is_animated) obj.animate();
    }


    async rend_quart_screen(start, end, map, texture) {
        var y;
        var pixToAngle = player.fov / this.w;
        var angle = player.a - (player.fov / 2) + pixToAngle * start;
        
        for (var i = start; i < end; ++i) { // draw the "3D" view
            var distance = this.disToWall(map, angle);
            var column_height = 2000; 
                if (distance != -1) {
                    if (distance > 0.01) 
                        column_height = 2 * Math.floor(this.h / (distance * Math.cos(angle - player.a)));
                    var cx = player.x + distance * Math.cos(angle);
                    var cy = player.y + distance * Math.sin(angle);
                    var texid = parseInt(map.map[Math.floor(cx) + Math.floor(cy) * map.w]);
                    y = this.texture_column(cx, cy, i, texture, texid, column_height, distance);
                }   
                else {
                    column_height = 2 * Math.floor(this.h / (MAX_VIEW_DISTANCE * Math.cos(angle - player.a)));
                    y =  (this.h >> 1) - (column_height >> 1)  + player.z + player.aZ + column_height;
                }
            for (; y < this.h; ++y) this.pack_color(i, y, 124, 84, 42);
            angle += pixToAngle;
        }
    }

     async render(map, texture, sprites) { 
         var funcs = new Array(this.countAsyncFuncs);
         for (let i = 0; i < this.countAsyncFuncs; ++i)
            funcs[i] = this.asyncFuncsArray[i]();   
      await Promise.all(funcs);  
      for (var i = 0; i < sprites.length; ++i) 
        this.draw_sprite(sprites[i]);
    
      for (var i = 0; i < objects.length; ++i) 
        this.draw_object(objects[i]);
       if (pressedKeys[TAB]) this.set_map(map, sprites, texture);
        
    }

    roundRect(x, y, width, height, radius, fill, stroke) {
        if (typeof stroke == 'undefined') {
          fill = true;
        }
        if (typeof radius === 'undefined') {
          radius = 5;
        }
        if (typeof radius === 'number') {
          radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } else {
          var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
          for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
          }
        }
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius.tl, y);
        this.ctx.lineTo(x + width - radius.tr, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        this.ctx.lineTo(x + width, y + height - radius.br);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        this.ctx.lineTo(x + radius.bl, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        this.ctx.lineTo(x, y + radius.tl);
        this.ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        this.ctx.closePath();
        if (fill) {
            this.ctx.fill();
        }
        if (stroke) {
            this.ctx.stroke();
        }
      
      }

    mainScreen() {
        this.ctx.clearRect(0,0,this.w,this.h); 
        this.ctx.drawImage(star_sky, 0, 0);
        this.ctx.drawImage(aster[cur_aster], aster_x, aster_y);
        if (++cur_aster >= ASTER_COUNT) cur_aster = 0;
        aster_x += ASTER_STEP_X;
        aster_y += ASTER_STEP_Y;
         // Sun
         this.ctx.drawImage(sun[cur_sun], this.w - SUN_SIZE / 2, - SUN_SIZE / 2);
        if (++cur_sun >= SUN_COUNT) cur_sun = 0;
      // Earth    
        this.ctx.drawImage(earth[cur_earth], this.w / 2, this.h / 2 - EARTH_SIZE / 2);
        if (is_select) {
            this.ctx.font = "100pt Squaresharps";
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            this.roundRect(GS.w / 2 + EARTH_SIZE / 4 + 15, GS.h / 2  - EARTH_W / 4 - 75, 400, 175, 50);
            this.ctx.fillStyle = "#180080";
            this.ctx.fillText("START",  GS.w / 2 + EARTH_SIZE / 4, GS.h / 2  - EARTH_W / 4);
            this.ctx.lineWidth = 12;
            this.ctx.beginPath();
            this.ctx.moveTo(GS.w / 2 + EARTH_SIZE / 4 + 125, GS.h / 2  - EARTH_W / 4 + 15);
            this.ctx.lineTo(GS.w / 2 + EARTH_SIZE / 4 + 300, GS.h / 2  - EARTH_W / 4 + 15);
            this.ctx.stroke();
            this.ctx.closePath();
            this.ctx.fillText("GAME",  GS.w / 2 + EARTH_SIZE / 4 + 40, GS.h / 2  - EARTH_W / 4 + 100);
        }


        // Moon
        this.ctx.save();
        this.ctx.translate(300,150);
        this.ctx.rotate(moon_a);
        moon_a += MOON_STEP;
        this.ctx.drawImage(moon[cur_moon],MOON_R,0);

        this.ctx.restore();


        this.ctx.font = "150pt Squaresharps";
        this.ctx.fillStyle = "#180080";
        this.ctx.strokeStyle = "#180080";
        this.ctx.fillText("FOBOS", 50, 150);
        this.ctx.lineWidth = 15;
        this.ctx.beginPath();
        this.ctx.moveTo(50, 140);
        this.ctx.lineTo(75, 50);
        this.ctx.lineTo(690, 50);
        this.ctx.lineTo(665, 140);
        this.ctx.lineTo(43, 140);
        this.ctx.stroke();
        this.ctx.closePath();
      }

      rayRenderer(start, end, map, texture, testWallX, testWallY) {
          var i = start;
        var y;
        var pixToAngle = player.fov / this.w;
        var angle = player.a - (player.fov / 2) + pixToAngle * start;
        
        for (; i < end; ++i) { // draw the "3D" view
            var distance = this.disToWall(map, angle);
            var column_height = 2000; 
                if (distance != -1) {
                    if (distance > 0.01) 
                        column_height = 2 * Math.floor(this.h / (distance * Math.cos(angle - player.a)));
                    var cx = player.x + distance * Math.cos(angle);
                    var cy = player.y + distance * Math.sin(angle);
                    var wallX = Math.floor(cx);
                    var wallY = Math.floor(cy);
                    if (wallX != testWallX || wallY != testWallY) return i;

                    var texid = parseInt(map.map[wallX + wallY * map.w]);
                    y = this.texture_column(cx, cy, i, texture, texid, column_height, distance);
                }   
                else {
                    column_height = 2 * Math.floor(this.h / (MAX_VIEW_DISTANCE * Math.cos(angle - player.a)));
                    y =  (this.h >> 1) - (column_height >> 1)  + player.z + player.aZ + column_height;
                }
            for (; y < this.h; ++y) this.pack_color(i, y, 255,  0, 0);
            angle += pixToAngle;
        }
    }

     renderer(start, end, map, texture) {
        var endAngle = player.a - (player.fov / 2) + (player.fov * end / this.w);
        var pixToAngle = player.fov / this.w;
          for (var i = start; i < end; ++i) {
            var startAngle = player.a - (player.fov / 2) + pixToAngle * i;
            
            var distance = this.disToWall(map, startAngle);
            var rayX = player.x + distance * Math.cos(startAngle);
            var rayY = player.y + distance * Math.sin(startAngle);
            var wallX = Math.floor(rayX);
            var wallY = Math.floor(rayY);
            var hitX = rayX - Math.floor(rayX + 0.5); // hitx and hity contain (signed) fractional parts of cx and cy,
            var hitY = rayY - Math.floor(rayY + 0.5); // they vary between -0.5 and +0.5, and one of them is supposed to be very close to 0
            var endWallX;
            var endWallY;
            if (Math.abs(hitX) > Math.abs(hitY)) { // for horizontal walls
                endWallX = (player.a > -PI / 2 && player.a < PI / 2) ? wallX + 0.99 : wallX;
                endWallY = wallY + 0.99;
            }
            else { // for vertical walls
                endWallX = wallX + 0.99;
                endWallY = (player.a < 0) ? wallY + 0.99 : wallY;
            }
            var endWallAngle = Math.atan((player.x - endWallX) / (player.y - endWallY)) - PI;
            if (player.y - endWallY == 0) endWallAngle = (player.x - endWallX > 0) ? PI / 2 : -PI / 2;
            if (endWallAngle > PI) endWallAngle = (endWallAngle % (2 * PI)) - 2 * PI;
            if (endWallAngle < -PI) endWallAngle = (endWallAngle % (2 * PI)) + 2 * PI;
            if (endWallAngle > endAngle) endWallAngle = endAngle;
            var endDist = this.disToWall(map, endWallAngle);
            var endX = Math.floor(player.x + endDist * Math.cos(endWallAngle));
            var endY = Math.floor(player.y + endDist * Math.sin(endWallAngle));
            if (endX != wallX || endY != wallY) {
                
                i = this.rayRenderer(i, end, map, texture, wallX, wallY) - 1;
               // document.write(i + " " + " ");
                continue;
            }
            else {
                var y;
                var nearestAngle = 2 * PI;
                var m1 = (player.x - rayX);
                var m2 = (rayX - endWallX);
                var n1 = (player.y - rayY);
                var n2 = (rayY - endWallY);
                // angle between ray and wall
                var betta = Math.atan((m1 * m2 + n1 * n2) / (Math.sqrt(Math.pow(m1, 2) + Math.pow(n1, 2)) + Math.sqrt(Math.pow(m2, 2) + Math.pow(n2, 2))));
                var angle = startAngle;
                for (; i < end; ++i) {
                    var alpha = Math.abs(angle - startAngle); // angle is opposite wall 
                    var gamma =  PI - alpha - betta; // angle is opposite first ray
                    var dist = distance * (Math.sin(betta) / Math.sin(gamma)); // find new distance
                    if (angle == startAngle) dist = distance;
                    var column_height = 2000; 
                    if (dist != -1) {
                        if (dist > 0.01) 
                            column_height = 2 * Math.floor(this.h / (distance * Math.cos(angle - player.a)));
                        var cx = player.x + dist * Math.cos(angle);
                        var cy = player.y + dist * Math.sin(angle);
    
                        var texid = parseInt(map.map[Math.floor(cx) + Math.floor(cy) * map.w]);
                        y = this.texture_column(cx, cy, i, texture, texid, column_height, dist);
                    }   
                    for (; y < this.h; ++y) this.pack_color(i, y, 255,  0, 0);


                    angle += pixToAngle;
                    var angleDist = Math.abs(angle - endWallAngle);
                    if (angleDist < nearestAngle) nearestAngle = angleDist;
                    else break;
                }

            }
      }
    }



}



