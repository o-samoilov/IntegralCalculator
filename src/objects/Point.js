function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.Compare = function(point) {
    /*
    return false if this point smaller
    else return true
    */

    if(this.x < point.x ||
        (this.x == point.x && this.y < point.y)) {

        return false;
    }

    return true;

}