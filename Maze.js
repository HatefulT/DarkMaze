var CreateMaze = function(w, h, startX, startY, cellSize) {
  let maze = [];
  for(var x=0; x<w; x++) {
    maze[x] = [];
    for(var y=0; y<h; y++) {
      maze[x][y] = { up: true, down: true, left: true, right: true, visited: false };
    }
  }

  let stack = [];
  let currentX = startX;
  let currentY = startY;
  while(true) {
    let m = 0;
    let p = [
      (currentY > 0 && !maze[currentX][currentY - 1].visited) ? 1 : 0,
      (currentX < w-1 && !maze[currentX + 1][currentY].visited) ? 1 : 0,
      (currentY < h-1 && !maze[currentX][currentY + 1].visited) ? 1 : 0,
      (currentX > 0 && !maze[currentX - 1][currentY].visited) ? 1 : 0,
    ];
    m = p.reduce( (a, x) => (a+x), 0 );
    // console.log(m);
    if(m > 0) {
      let r = Math.floor(Math.random()*m);
      let side = -1;
      for(let i=0; i<4; i++) {
        r -= p[i];
        if(r < 0) {
          side = i;
          break;
        }
      }
      // console.log(side);
      maze[currentX][currentY].visited = true;
      stack.push( [currentX, currentY] );
      if(side == 0) {
        maze[currentX][currentY].up = false;
        currentY --;
        maze[currentX][currentY].down = false;
      } else if(side == 1) {
        maze[currentX][currentY].right = false;
        currentX ++;
        maze[currentX][currentY].left = false;
      } else if(side == 2) {
        maze[currentX][currentY].down = false;
        currentY ++;
        maze[currentX][currentY].up = false;
      } else if(side == 3) {
        maze[currentX][currentY].left = false;
        currentX --;
        maze[currentX][currentY].right = false;
      }
    } else {
      maze[currentX][currentY].visited = true;
      if(stack.length == 0)
        break;
      currentX = stack[stack.length-1][0];
      currentY = stack[stack.length-1][1];
      stack.pop();
    }
  }

  return toWalls(maze, cellSize);
}
var toWalls = function(maze, cellSize) {
  let walls = [];
  let w = maze.length;
  let h = maze[0].length;
  for(let x=0; x<w; x++) 
    for(let y=0; y<h; y++) {
      if(maze[x][y].up) {
        walls.push(new Wall((3*x-1)*cellSize, (3*y-1)*cellSize, 3*cellSize, cellSize));
        //if(y > 0) maze[x][y-1].down = false;
      }
      if(maze[x][y].down) {
        walls.push(new Wall((3*x-1)*cellSize, (3*y+1)*cellSize, 3*cellSize, cellSize));
        //if(y < h-1) maze[x][y+1].up = false;
      }
      if(maze[x][y].left) {
        walls.push(new Wall((3*x-1)*cellSize, (3*y-1)*cellSize, cellSize, 3*cellSize));
        //if(x > 0) maze[x-1][y].right = false;
      }
      if(maze[x][y].right) {
        walls.push(new Wall((3*x+1)*cellSize, (3*y-1)*cellSize, cellSize, 3*cellSize));
        //if(x < w-1) maze[x+1][y].left = false;
      }
    }
  return walls;
}
