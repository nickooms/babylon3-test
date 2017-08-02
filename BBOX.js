class BBOX {
  constructor(points = []) {
    this.min = { x: Infinity, y: Infinity };
    this.max = { x: -Infinity, y: -Infinity };
    this.addPoints(points);
  }

  addPoints(points) {
    points.forEach(([x, y]) => {
      ['min', 'max'].forEach((value) => {
        this[value] = {
          x: Math[value](this[value].x, x),
          y: Math[value](this[value].y, y),
        };
      });
    });
  }

  get center() {
    return {
      x: (this.max.x + this.min.x) / 2,
      y: (this.max.y + this.min.y) / 2,
    };
  }

  get width() {
    return this.max.x - this.min.x;
  }

  get height() {
    return this.max.y - this.min.y;
  }
}

export default BBOX;
