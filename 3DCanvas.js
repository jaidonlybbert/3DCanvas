// Jaidon Lybbert
// August 7, 2019
// A 3d viewport meant for rendering circles in 3d space
// I realize there is already a 3d context for HTML canvas using webgl

const VIEWPORT_HEIGHT = 800;
const VIEWPORT_WIDTH = 800;
const VIEWPORT_COORD = [0, 0, -400]
const CAMERA_COORD = [0, 0, 0]; // Coordinates of camera
const CAMERA_FOV = (Math.PI / 2);
const FPS = 1;

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

  this.loop = function() {
    this.ball.calcPos();
    this.draw();
  }
}


function Ball() {
  this.coo = [0, 0, -METER]; // Coordinate in space
  this.vel = [0, 0, 0]; // Velocity
  this.pos = [400, 400]; // Screen position
  this.pol = [Math.PI / 2, Math.PI / 2, METER]; // Polar coordinates
  this.rad = (0.0971 * METER / 2); // Radius
  this.col = "#FFF"; // Color
  this.span = 0; // Spanning angle of the ball in FOV of camera
  this.sizeOnScreen = 0; // Size of the ball on the screen

  this.draw = function() {
    ctx.fillStyle = this.col;
    ctx.beginPath();
    ctx.arc(this.pos[0], this.pos[1], (this.sizeOnScreen / 2), 0, 2 * Math.PI);
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

  // function to calculate polar coordinates of the ball from cartesian
  this.calcPol = function() {
    // yaw = arctan(z / x)
    this.pol[0] = Math.atan(this.coo[2] / this.coo[0]);
    // pitch = arctan(z / y)
    this.pol[1] = Math.atan(this.coo[2] /
                                          (CAMERA_COORD[1] - this.coo[1]));
    // distance formula
    this.pol[2] = Math.sqrt(Math.pow(this.coo[0], 2) +
                 Math.pow(this.coo[1], 2) + Math.pow(this.coo[2], 2));
  }

  // The 'span' of the ball refers to the angular space the ball takes up in the
  // field of view of the camera. This is used in calculating the ultimate size
  // of the ball as it appears on the screen.
  this.calcSpan = function() {
    this.span = 2 * Math.atan(this.rad / this.pol[2]);
  }

  // Translates the angular span of the ball into the radius of the ball as it
  // appears on the screen. NOTE: this method does not distort the shape of the
  // the ball as it moves from the center of the screen.
  this.calcSize = function() {
    this.sizeOnScreen = (this.span / CAMERA_FOV) * (VIEWPORT_HEIGHT);
  }

  this.calcPos = function() {
  /*
  To calculate the screen position, we find the polar coordinates of the object
  first, and map that to the 2d screen. This is the preffered approach, because
  polar coordinates contain the distance to the object for calculating size.
  */
    console.log(this.coo, this.pol);
    this.calcPol();
    this.calcSpan();
    this.calcSize();
    console.log(this.coo, this.pol, this.span, this.sizeOnScreen);
  }
}

var g = new Game();

var xSlider = document.getElementById("xPos");
var xDisplay = document.getElementById("xPosDisplay");
xDisplay.innerHTML = xSlider.value;

var ySlider = document.getElementById("yPos");
var yDisplay = document.getElementById("yPosDisplay");
yDisplay.innerHTML = ySlider.value;

var zSlider = document.getElementById("zPos");
var zDisplay = document.getElementById("zPosDisplay");
zDisplay.innerHTML = -zSlider.value;

g.ball.setCoo(xSlider.value, ySlider.value, -zSlider.value);

xSlider.oninput = function() {
  xDisplay.innerHTML = this.value;
  g.ball.coo[0] = this.value;
}

ySlider.oninput = function() {
  yDisplay.innerHTML = this.value;
  g.ball.coo[1] = this.value;
}

zSlider.oninput = function() {
  zDisplay.innerHTML = -this.value;
  g.ball.coo[2] = -this.value;
}

setInterval(function() {g.loop();}, 1000 / FPS);
