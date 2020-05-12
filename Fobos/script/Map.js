
class Map {
    constructor(map_str, map_w, map_h) {
        this.w = map_w;
        this.h = map_h;
        this.map = map_str;
    }

    is_empty(x, y) {
        return this.map[x + y * this.w] == " ";
    }
}


var lvl1_map = new Map(new String("0000222222220000" + 
                                  "1              0" +
                                  "1     111111   0" + 
                                  "1     0        0" + 
                                  "0     0  1110000" + 
                                  "0     3        0" + 
                                  "0000000 000000 0" + 
                                  "0   0   1      0" + 
                                  "0   0   0      0" + 
                                  "0   0   1 000000" + 
                                  "0   0   1      0" + 
                                  "2       1      0" + 
                                  "0       0      0" + 
                                  "0 0000000      0" + 
                                  "0       0      0" + 
                                  "0002222222200000"), 16, 16);

var currentMap = lvl1_map;