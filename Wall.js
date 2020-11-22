var Wall = function(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
};
Wall.prototype = {
  getDist: function(x, y) {
    let dx = Math.max(this.x-x, x-(this.x+this.w), 0),
        dy = Math.max(this.y-y, y-(this.y+this.h), 0);
    return Math.sqrt(dx*dx + dy*dy);
  }
};
