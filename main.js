var C, CTX, w, h;

window.onload = function() {
  C = document.getElementById('canvas');
  CTX = C.getContext('2d');
  C.width = w = window.innerWidth;
  C.height = h = window.innerHeight;
  lastTime = Date.now();

  menu = document.getElementById('start-menu');
}

var initGame = function() {
  player = new Player(10, 10);
  walls = CreateMaze(100, 100, 0, 0, 100);
  //walls.push(new Wall(100, 100, 100, 100));

  camera.x = w/2;
  camera.y = h*.9;
}

var menu;
var startGame = function() {
  menu.style.display = 'none';
  initGame();

  document.addEventListener('keydown', toggleOn);
  document.addEventListener('keyup', toggleOff);

  requestAnimationFrame(loop);
}

var lastTime;
var loop = function() {
  let time = Date.now();
  let dt = time - lastTime;
  lastTime = time;

  update(dt);
  render();

  requestAnimationFrame(loop);
}

// Game physics and movement

var player,
    walls;

var rotationTime = 0,
    lastRotation = 0;

var update = function(dt) {
  if(dt >= 1000) return;

  var omega = (keys.o ? -1 : 0) + (keys.p ? 1 : 0);
  if(omega == lastRotation) {
    rotationTime += dt;
  } else {
    rotationTime = 0;
    lastRotation = omega;
  }
  player.angle += .0001*omega*(dt+rotationTime);

  let hy = (keys.up ? 1 : 0) + (keys.down ? -1 : 0);
  let hx = (keys.left ? -1 : 0) + (keys.right ? 1: 0);
  if(hy != 0 || hx != 0) {
    let abs = Math.sqrt(hy*hy + hx*hx);
    hy /= abs;
    hx /= abs;

    player.y += (hy * Math.sin(player.angle) + hx * Math.cos(player.angle))*player.speed;
    player.x += (hy * Math.cos(player.angle) - hx * Math.sin(player.angle))*player.speed;
  }
}


// Rendering
var camera = {
  x: w/2,
  y: .9*h,
  fov: 2*Math.PI/3,
  rays: 25,
  size: 1.,
  maxDist: 1000
};
var colors = {
  white: 'rgb(250, 244, 245)',
  gray: 'rgb(155, 150, 160)',
  black: 'rgb(34, 24, 28)'
}
var render = function() {
  camera.maxDist = w * camera.size * .6;

  CTX.fillStyle = colors.black;
  CTX.fillRect(0, 0, w, h);

  let da = -Math.PI/2;
  CTX.translate(camera.x, camera.y);
  CTX.rotate(da);
  CTX.scale(camera.size, camera.size);

  CTX.strokeStyle = colors.gray;
  for(var a=-camera.fov*.5+player.angle; a<=camera.fov*.5+player.angle; a+=camera.fov/camera.rays) {
    let D = getDist(player.x, player.y, Math.cos(a), Math.sin(a));
    CTX.beginPath();
    CTX.moveTo(0, 0);
    CTX.lineTo(D*Math.cos(a-player.angle), D*Math.sin(a-player.angle));
    CTX.stroke();
  }

  CTX.fillStyle = colors.white;
  CTX.beginPath();
  CTX.arc(-camera.size*PLAYERWIDTH/2, 0, camera.size*PLAYERWIDTH, 0, 2*Math.PI, true);
  CTX.fill();

  CTX.scale(1./camera.size, 1./camera.size);
  CTX.rotate(-da);
  CTX.translate(-camera.x, -camera.y);
}
const MAX_RAYS = 100;
var getDist = function(x, y, dx, dy) {
  MIN_D = 0.1;
  var D = 0;
  for(let j=0; j<MAX_RAYS; j++) {
    var min = Infinity;
    for(var i=0; i<walls.length; i++) {
      let d = walls[i].getDist(x, y);
      if(d < min)
        min = d;
    }
    D += min;
    x += min*dx;
    y += min*dy;
    if(D >= camera.maxDist)
      return camera.maxDist;
    if(min <= MIN_D)
      return D;
  }
  return D
}


// Controls
var keys = {
  right: false,
  left: false,
  up: false,
  down: false,
  space: false,
  o: false,
  p: false,
};
var toggleOn = function(e) {
  switch(e.key.toLowerCase()) {
    case 'a':
      keys.left = true;
    break;
    case 'ф':
      keys.left = true;
    break;
    case 'w':
      keys.up = true;
    break;
    case 'ц':
      keys.up = true;
    break;
    case 's':
      keys.down = true;
    break;
    case 'ы':
      keys.down = true;
    break;
    case 'd':
      keys.right = true;
    break;
    case 'в':
      keys.right = true;
    break;
    case 'o':
      keys.o = true;
    break;
    case 'щ':
      keys.o = true;
    break;
    case 'p':
      keys.p = true;
    break;
    case 'з':
      keys.p = true;
    break;
    case ' ':
      keys.space = true;
    break;
  }
}
var toggleOff = function(e) {
  switch(e.key.toLowerCase()) {
    case 'a':
      keys.left = false;
    break;
    case 'ф':
      keys.left = false;
    break;
    case 'w':
      keys.up = false;
    break;
    case 'ц':
      keys.up = false;
    break;
    case 's':
      keys.down = false;
    break;
    case 'ы':
      keys.down = false;
    break;
    case 'd':
      keys.right = false;
    break;
    case 'в':
      keys.right = false;
    break;
    case 'o':
      keys.o = false;
    break;
    case 'щ':
      keys.o = false;
    break;
    case 'p':
      keys.p = false;
    break;
    case 'з':
      keys.p = false;
    break;
    case ' ':
      keys.space = false;
    break;
  }
}
