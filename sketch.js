import { Attractor } from "./attractor";
import { Particle } from "./particle";

// Exporting a function called 'mySketch'
export const mySketch = (p) => {
  let maxSize = 500;
  let wspeed = 1.66;
  let hspeed = 1.33;
  let w = 0;
  let h = maxSize;
  let r = 0;

  // Calling p5.js functions, using the variable 'p'
  p.setup = () => {
    // Creating a canvas using the entire screen of the webpage
    p.createCanvas(window.innerWidth, window.innerHeight);
    p.strokeWeight(5);
    p.background(255);

    console.log("p5.js setup function executed!");
  };

  p.draw = () => {
    // Clear the frame
    p.background(255, 50);

    // Draw an ellipse
    p.translate(p.width / 2, p.height / 2);
    p.rotate(r);
    p.fill(0, 1);
    p.stroke(5);
    p.ellipse(0, 0, w, h);

    // Updating rotation and increment values
    r = r + 0.015;
    w = w + wspeed;
    h = h + hspeed;
    if (w < 0 || w > maxSize) wspeed *= -1;
    if (h < 0 || h > maxSize) hspeed *= -1;
  };

  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight);
  };
};

export const mySecondSketch = (p) => {
  const containerEl = document.getElementById("banner-canvas");

  console.log("processing ::: ", p);
  // Color palette
  const bg = "#051736";
  const palette = ["#ffffff", "#2bc1d2"];

  const totalParticles = 750;
  let mouseIsMoving = false;
  let mouseMovingTimeout = null;

  // Particles collection
  const singleParticlesCollection = [];
  const attractors = [];

  p.setup = () => {
    p.createCanvas(containerEl.offsetWidth, containerEl.offsetHeight);
    p.background(bg);

    // Setup attractors
    for (let i = 0; i < 1; i++) {
      attractors.push(new Attractor(p.random(p.width), p.random(p.height), p));
    }
  };

  p.draw = () => {
    p.background(bg); // Refresh background

    // fill particles on the canvas
    fillParticleArray();

    // Draw particles on the canvas
    for (const particle of singleParticlesCollection) {
      const attractionMod = mouseIsMoving ? -20 : 1;

      particle.slowDown(mouseIsMoving); // Slow down the particle if the mouse is moving
      particle.followAttractor(attractors, 300, attractionMod); // Push the particle away from cursor if mouse is moving

      // Refresh particle if it's lifecycle is over
      // a new particle will be added in the fillParticleArray() function during the next drawloop
      const shouldRemove = particle.update();
      if (shouldRemove) {
        singleParticlesCollection.shift();
      } else {
        particle.show();
      }
    }

    // Debug, showing FPS
    showFPS();
  };

  function spawnParticle(x, y, array) {
    const px = x + p.random(-5, 5);
    const py = y + p.random(-5, 5);
    array.push(new Particle(px, py, palette, p));
  }

  function fillParticleArray() {
    if (singleParticlesCollection.length < totalParticles) {
      for (let i = 0; i < 15; i++) {
        spawnParticle(p.mouseX, p.mouseY, singleParticlesCollection);
      }
    }
  }

  function showFPS() {
    const fps = p.frameRate();
    p.push();
    p.textSize(30);
    p.fill(255);
    p.stroke(0);
    p.text(fps.toFixed(2), p.width - 30, 50);
    p.pop();
  }

  /***************************/
  /***** Event listeners *****/
  /***************************/
  p.windowResized = () => {
    p.resizeCanvas(containerEl.offsetWidth, containerEl.offsetHeight);
  };

  p.mouseMoved = () => {
    if (mouseIsMoving) return;

    mouseIsMoving = true;
    attractors.length > 0 && attractors[0].update(p.mouseX, p.mouseY);

    clearTimeout(mouseMovingTimeout);
    mouseMovingTimeout = setTimeout(() => {
      mouseIsMoving = false;
    }, 200);
  };
};
