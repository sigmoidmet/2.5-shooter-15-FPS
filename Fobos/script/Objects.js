


class GameObject {
    constructor(x, y, z, is_animated, img, count_imgs = 1) {
        this.x = x;
        this.y = y;
        this.Z = z;
        this.is_animated = is_animated;
        this.size = OBJECT_SIZE;
        if (this.is_animated) {
            this.vectIMG = img;
            this.cur_img = 0;
            this.img = this.vectIMG[0];
            this.count_imgs = count_imgs
        }
        else 
            this.img = img;
    }

    animate() {
        ++this.cur_img;
        if (this.cur_img >= this.count_imgs) this.cur_img = 0;
        this.img = this.vectIMG[this.cur_img];
        
    }

    remove() {
        for (var i = 0; i < objects.length; ++i) 
            if (objects[i] == this) {
                objects.splice(i, 1);
                break;
            }
    }

    get_pixel(x, y) {
       // console.log(this.img);
        var coord = 4*(x + y * this.size);
        return [this.img.data[coord + 0], this.img.data[coord + 1], this.img.data[coord + 2], this.img.data[coord + 3]];
    }


}



function make_object(x, y, z, is_animated, img, count_imgs = 1) {
    var obj = new GameObject(x, y, z, is_animated, img, count_imgs);
    objects.push(obj);
    return obj;
}