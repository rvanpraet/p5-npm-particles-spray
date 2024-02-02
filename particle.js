import p5 from "p5";
import { colorAlpha } from "./utils";

export class Particle {
  constructor(xPos = 0, yPos = 0, palette, p, mass = 4) {
    this.p = p;
    this.pos = this.p.createVector(xPos, yPos);
    this.startPos = this.p.createVector(xPos, yPos);

    this.palette = palette;

    this.iteration = 0;
    this.maxIterations = 400;
    this.weight = this.p.random(1, 2.5);
    this.initialMaxspeed = this.p.random(0.75, 2);
    this.maxspeed = this.initialMaxspeed;
    this.isSlowedDown = false;

    this.mass = mass;
    this.vel = p5.Vector.random2D();
    // this.vel = this.p
    //   .createVector(this.p.random(-1, 1), this.p.random(-1, 1))
    //   .normalize();
    this.acc = this.p.createVector(0, 0);
    this.color =
      palette[this.p.floor(this.p.random(0, palette.length - 0.00001))];

    this.trail = [this.startPos.copy()];
  }

  /**
   * Update the position of particle by increasing the velocity if there is acceleration.
   * Then adding the velocity to the current position of the particle
   */
  update() {
    let shouldRemove = false;
    const posCopy = this.pos.copy();

    // Chance to increase acceleration
    // if (this.p.random(0, 1) > 0.995) {
    //   this.acc.add(this.vel);
    // }

    this.acc.add(this.vel);

    // Update velocity and position
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    // this.acc.mult(0);

    this.iteration++;
    shouldRemove = this.iteration >= this.maxIterations;

    // Update trail
    const trailLength = this.p.map(this.iteration, 0, this.maxIterations, 3, 0);
    if (this.trail.length >= trailLength) {
      this.trail.pop();
    }
    this.trail.unshift(posCopy);

    return shouldRemove;
  }

  /**
   * Shows the particle based on the time it has lived
   */
  show() {
    // this._edges();

    // Linear distribution
    const alpha = this.p.map(this.iteration, 0, this.maxIterations, 1, 0);

    // Bell curve distribution
    // const alpha = bellCurve(this.iteration, this.maxIterations);

    const drawFn = (pos, weight, alpha) => {
      this.p.push();
      this.p.stroke(alpha);
      this.p.strokeWeight(weight);
      this.p.point(pos);
      this.p.pop();
    };

    // Draw leading particle
    drawFn(this.pos, this.weight, colorAlpha(this.p, this.color, alpha));

    // Draw particle trail
    this.trail.forEach((pos, i) => {
      const trailFadeCoeff = (this.trail.length - i - 1) / this.trail.length;
      const trailAlpha = colorAlpha(this.p, this.color, alpha * trailFadeCoeff);
      const weight = this.weight * trailFadeCoeff;
      drawFn(pos, weight, trailAlpha);
    });
  }

  followAttractor(attractors, G = 0.5, mod = 1) {
    if (attractors.length === 0 || mod === 0) return;

    if (this.iteration <= this.maxIterations * 0.25) return;

    let distance;
    let activeAttractor = attractors[0];

    if (attractors.length > 1) {
      // Determine closest attractor
      for (const attractor of attractors) {
        const newDist = this.p.dist(
          this.pos.x,
          this.pos.y,
          attractor.pos.x,
          attractor.pos.y
        );
        if (!distance || newDist < distance) {
          distance = newDist;
          activeAttractor = attractor;
        }
      }
    }

    // To apply force from selected attractor
    let force = p5.Vector.sub(activeAttractor.pos, this.pos);
    let distanceSq = this.p.constrain(
      force.magSq(),
      this.p.pow(50, 2),
      this.p.pow(225, 2)
    );

    // "Universal" gravitational force
    //   let G = 0.5;

    // Calculated strength F = (m1 * m2) * G / r²
    let strength =
      ((G * (activeAttractor.mass * this.mass)) / distanceSq) * mod;

    // console.log(strength);
    // Set magnitude of force and apply
    force.setMag(strength);
    this._applyForce(force);
  }

  slowDown(willSlowDown, factor = 0.9) {
    if (this.isSlowedDown === willSlowDown) return;

    this.isSlowedDown = willSlowDown;
    this.maxspeed = this.isSlowedDown
      ? this.initialMaxspeed * factor
      : this.initialMaxspeed;
  }

  /**
   * Increase particle acceleration
   * @param {number} force
   */
  _applyForce(force) {
    this.acc.add(force);
  }

  /**
   * Resets the particle
   */
  _reset() {
    this.pos.x = this.startPos.x;
    this.pos.y = this.startPos.y;
    this.vel = this.p.Vector.random2D();
    this.iteration = 0;
  }

  /**
   * Handle particles overflowing the edges of the canvas
   */
  _edges() {
    if (this.pos.x > width) {
      this.pos.x = 0;
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
    }
  }
}
