// Vector which attracts particles based on gravitational pull
export class Attractor {
  constructor(x, y, p, m = 4) {
    this.p = p;
    this.pos = this.p.createVector(x, y);
    this.mass = m;
    this.r = this.p.sqrt(this.mass) * 2;

    // push();
    // fill(255);
    // ellipse(this.pos.x, this.pos.y, 20);
    // pop();
  }

  update(x, y) {
    this.pos.x = x;
    this.pos.y = y;
  }
}
