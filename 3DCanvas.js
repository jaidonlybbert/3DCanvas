// Jaidon Lybbert
// August 7, 2019
// A 3d viewport meant for rendering circles in 3d space
// I realize there is already a 3d context for canvas using the webgl context

const VIEWPORT_HEIGHT = 800;
const VIEWPORT_WIDTH = 800;
const VIEWPORT_COORD = [0, 0, -400]
const CAMERA_COORD = [0, 0, 0]; // Coordinates of camera

const METER = 80;

var canvas = document.getElementById("3d");
var ctx = canvas.getContext("2d");

function Game() {
  this.ball = new Ball();

  this.draw = function() {
    // Background
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    // Meter STICK
    ctx.fillStyle = "blue";
    ctx.fillRect(0,0,20,METER);
    // Perspective lines
    ctx.strokeStyle = "#AAA";
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(800,800);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(800,0);
    ctx.lineTo(0,800);
    ctx.stroke();
    // Ball
    this.ball.draw();
  }

  this.calcPol = function() {
    this.ball.pol[0] = Math.atan(-this.ball.coo[2] / this.ball.coo[0]);
    this.ball.pol[1] = Math.atan(-this.ball.coo[2] /
                                          (CAMERA_COORD[1] - this.ball.coo[1]));
    this.ball.pol[2] = Math.sqrt(Math.pow(this.ball.coo[0], 2) +
                 Math.pow(this.ball.coo[1], 2) + Math.pow(this.ball.coo[2], 2));
  }

  this.calcPos = function() {
  /*
  To calculate the screen position, we find the polar coordinates of the object
  first, and map that to the 2d screen. This is the preffered approach, because
  polar coordinates contain the distance to the object for calculating size.
  */
    console.log(this.ball.coo, this.ball.pol);
    this.calcPol();
    console.log(this.ball.coo, this.ball.pol);
  }
}

function Ball() {
  this.coo = [0, 0, -METER]; // Coordinate in space
  this.vel = [0, 0, 0]; // Velocity
  this.pos = [400, 400]; // Screen position
  this.pol = [Math.PI / 2, Math.PI / 2, METER]; // Polar coordinates
  this.rad = 15;
  this.col = "#FFF";

  this.draw = function() {
    ctx.fillStyle = this.col;
    ctx.beginPath();
    ctx.arc(this.pos[0], this.pos[1], this.rad, 0, 2 * Math.PI);
    ctx.fill();
  }

  this.setPos = function(posx, posy) {
    this.pos = [posx, posy];
  }

  this.setCoo = function(posx, posy, posz) {
    this.coo = [posx, posy, posz];
  }

  this.setRad = function(rad) {
    this.rad = rad;
  }
}

var g = new Game();
g.draw();
g.calcPos();
