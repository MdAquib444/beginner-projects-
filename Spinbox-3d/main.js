const canvas = document.getElementById("glCanvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  alert("WebGL not supported");
  throw new Error("WebGL not supported");
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
gl.viewport(0, 0, canvas.width, canvas.height);

// Shaders
const vsSource = `
attribute vec4 a_position;
uniform mat4 u_matrix;
void main() {
  gl_Position = u_matrix * a_position;
}
`;

const fsSource = `
precision mediump float;
void main() {
  gl_FragColor = vec4(0.2, 0.6, 1.0, 1.0);
}
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

function createProgram(gl, vs, fs) {
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  return program;
}

const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
const program = createProgram(gl, vs, fs);

const positions = new Float32Array([
  -1, -1,  1,
   1, -1,  1,
  -1,  1,  1,
   1,  1,  1,
  -1, -1, -1,
   1, -1, -1,
  -1,  1, -1,
   1,  1, -1,
]);

const indices = new Uint16Array([
  0, 1, 2, 2, 1, 3,
  5, 4, 7, 7, 4, 6,
  2, 3, 6, 6, 3, 7,
  0, 1, 4, 4, 1, 5,
  0, 2, 4, 4, 2, 6,
  1, 3, 5, 5, 3, 7,
]);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

const aPosition = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(aPosition);
gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

const uMatrix = gl.getUniformLocation(program, "u_matrix");

function perspective(fov, aspect, near, far) {
  const f = 1 / Math.tan(fov / 2);
  const rangeInv = 1 / (near - far);

  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, (2 * near * far) * rangeInv, 0
  ];
}

let angle = 0;

function draw() {
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.useProgram(program);

  const aspect = canvas.clientWidth / canvas.clientHeight;
  const proj = perspective(Math.PI / 4, aspect, 0.1, 100);

  angle += 0.01;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const rotation = [
    cos, 0, sin, 0,
    0,   1, 0,   0,
   -sin, 0, cos, 0,
    0,   0, -6,  1
  ];

  const matrix = proj.map((v, i) => v + rotation[i]);
  gl.uniformMatrix4fv(uMatrix, false, new Float32Array(matrix));
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

  requestAnimationFrame(draw);
}

draw();