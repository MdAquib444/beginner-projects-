const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Set canvas size to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Cube size (half length of one edge)
const size = 5;

// Cube center position
let cubePos = {
  x: canvas.width / 2,
  y: canvas.height / 2
};

// Cube velocity for bouncing movement
let velocity = { x: 2.5, y: 2.1 };

// Rotation functions
function rotateX(p, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const y = p.y * cos - p.z * sin;
  const z = p.y * sin + p.z * cos;
  return { x: p.x, y, z };
}

function rotateY(p, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const x = p.z * sin + p.x * cos;
  const z = p.z * cos - p.x * sin;
  return { x, y: p.y, z };
}

// Project 3D point to 2D screen
function project(p) {
  const scale = 3; // Zoom factor
  return {
    x: p.x * scale + cubePos.x,
    y: p.y * scale + cubePos.y
  };
}

// Define 8 vertices of cube in 3D space
const originalPoints = [
  {x:-1,y:-1,z:-1}, {x:1,y:-1,z:-1},
  {x:1,y:1,z:-1},  {x:-1,y:1,z:-1},
  {x:-1,y:-1,z:1}, {x:1,y:-1,z:1},
  {x:1,y:1,z:1},   {x:-1,y:1,z:1}
].map(p => ({
  x: p.x * size,
  y: p.y * size,
  z: p.z * size
}));

// Define faces (each face has 4 vertex indices)
const faces = [
  [0,1,2,3], // back
  [4,5,6,7], // front
  [0,1,5,4], // bottom
  [2,3,7,6], // top
  [1,2,6,5], // right
  [0,3,7,4]  // left
];

// Face colors (for better depth perception)
const faceColors = ["#0ff", "#0cc", "#088", "#0aa", "#066", "#044"];

// Rotation angles
let angleX = 0;
let angleY = 0;

// Main draw loop
function draw() {
  // Clear canvas with black background
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Increment rotation
  angleX += 0.01;
  angleY += 0.015;

  // Move cube
  cubePos.x += velocity.x;
  cubePos.y += velocity.y;

  // Bounce off edges
  const margin = size * 3;
  if (cubePos.x - margin < 0 || cubePos.x + margin > canvas.width) {
    velocity.x *= -1;
  }
  if (cubePos.y - margin < 0 || cubePos.y + margin > canvas.height) {
    velocity.y *= -1;
  }

  // Apply rotation to each point
  const rotated = originalPoints.map(p => rotateY(rotateX(p, angleX), angleY));

  // Project 3D to 2D
  const projected = rotated.map(project);

  // Sort faces based on depth (z) to draw from back to front
  const faceDepth = faces.map((face, i) => {
    const zAvg = face.reduce((sum, idx) => sum + rotated[idx].z, 0) / 4;
    return { index: i, z: zAvg };
  }).sort((a, b) => b.z - a.z);

  // Draw each face
  for (const { index } of faceDepth) {
    const face = faces[index];
    ctx.beginPath();
    const p0 = projected[face[0]];
    ctx.moveTo(p0.x, p0.y);
    for (let i = 1; i < face.length; i++) {
      const p = projected[face[i]];
      ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.fillStyle = faceColors[index];
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.stroke(); // Outline
  }

  // Next frame
  requestAnimationFrame(draw);
}

// Start animation
draw();