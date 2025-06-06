const STABLE = 0.35;
const THRESHOLD = 1300;
const G = 5;
let star;
let orbitor;
let comet;

function setup() {
  createCanvas(windowWidth, windowHeight);
  star = new CelestialBody(100, createVector(0,0), createVector(0,0), 50);

  const cometPos = createVector(300, -300);
  let cometVel = cometPos.copy();
  cometVel.rotate(-60);
  cometVel.setMag(sqrt(G * star.mass / cometPos.mag()));
  comet = new CelestialBody(1, cometPos, cometVel, 5);
}

function draw() {
  translate(width/2, height/2);
  background(0);
  star.show();
  
  let distance = dist(star.pos.x, star.pos.y, comet.pos.x, comet.pos.y);
  if (distance <= THRESHOLD) {
    star.attract(comet);
  }
  comet.update();
  comet.show();
  document.getElementById("gameboard").innerText = `distance: ${Math.floor(distance)}`
}

function CelestialBody(mass, pos, vel, diameter) {
  this.mass = mass;
  this.pos = pos;
  this.vel = vel;
  this.diameter = diameter;
  this.radius = this.diameter / 2;
  this.tail = [];
  
  this.show = function() {
    fill(255);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.radius, this.radius);
    if (this.tail.length) {
      stroke(150);
      for (let i = 0; i < this.tail.length - 2; i++) {
        line (this.tail[i].x, this.tail[i].y, this.tail[i+1].x, this.tail[i+1].y);
      }
    }
  }

  this.update = function() {
    this.pos.add(this.vel);
    if (this.mass === 1) {
      this.tail.push(this.pos.copy());
      if (this.tail.length > 100) this.tail.splice(0, 1);
    }
  }

  this.attract = function(otherCelestial) {
    const r = dist(this.pos.x, this.pos.y, otherCelestial.pos.x, otherCelestial.pos.y);
    const force = this.pos.copy().sub(otherCelestial.pos);
    force.setMag((G * this.mass * otherCelestial.mass) / (r * r));
    otherCelestial.applyForce(force);
  }

  this.applyForce = function(force) {
    this.vel.x += force.x / this.mass;
    this.vel.y += force.y / this.mass;
  }
}