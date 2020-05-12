

class Textures {
    constructor(size, cnt) {
        this.size = size;
        this.cnt = cnt;
        document.getElementById("load_img").width =  size * cnt; 
        document.getElementById("load_img").height =  size;
        var cont = document.getElementById("load_img").getContext("2d");
            cont.drawImage(lvl1_walls, 0, 0, size * cnt, size);
            this.walls = cont.getImageData(0,0, size * cnt, size);
            cont.clearRect(0, 0, 1000, 1000);
    }

    get_pixel(x, y, id) {
        var coord = (x + y * this.cnt * this.size + id * this.size) * 4;
        return new Array(this.walls.data[coord + 0], this.walls.data[coord + 1], this.walls.data[coord + 2], this.walls.data[coord + 3]);
    }

}


var  lvl1_Textures;

var currentTexture;