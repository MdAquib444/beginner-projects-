const canvas = document.getElementById("glCanvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  alert("WebGL not supported");
  throw new Error("WebGL not supported");
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

// Shaders
const vsSource = `
  attribute vec4 a_position;
  uniform mat4 u_matrix;
  void main() {
    gl_Position = u_matrix * a_position;
  }
`;

const fsSource = `
  precision highp float;
  void main() {
    gl_FragColor = vec4(0.2, 0.8, 1.0, 1.0);
  }
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vs, fs) {
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
const program = createProgram(gl, vs, fs);

// Cube vertices (corrected: 8 vertices needed, not 12)
const positions = new Float32Array([
  -1, -1,  1,   1, -1,  1,   1,  1,  1,  -1,  1,  1, // front face
  -1, -1, -1,   1, -1, -1,   1,  1, -1,  -1,  1, -1  // back face
]);

const indices = new Uint16Array([
  0, 1, 2, 0, 2, 3, // front
  4, 5, 6, 4, 6, 7, // back
  3, 2, 6, 3, 6, 7, // top
  0, 1, 5, 0, 5, 4, // bottom
  0, 3, 7, 0, 7, 4, // left
  1, 2, 6, 1, 6, 5  // right
]);

const posBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

const aPosition = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(aPosition);
gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

const uMatrix = gl.getUniformLocation(program, "u_matrix");

// Matrix math
function perspective(fov, aspect, near, far) {
  const f = 1 / Math.tan(fov / 2);
  const rangeInv = 1 / (near - far);
  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, 2 * near * far * rangeInv, 0
  ];
}

function multiply(a, b) {
  const out = new Array(16).fill(0);
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++)
      for (let k = 0; k < 4; k++)
        out[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j];
  return out;
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
  const c = Math.cos(angle), s = Math.sin(angle);

  const rotY = [
    c, 0, -s, 0,
    0, 1,  0, 0,
    s, 0,  c, 0,
    0, 0,  0, 1
  ];

  const trans = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, -6, 1
  ];

  const modelView = multiply(trans, rotY);
  const finalMatrix = multiply(proj, modelView);

  gl.uniformMatrix4fv(uMatrix, false, new Float32Array(finalMatrix));
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

  requestAnimationFrame(draw);
}

draw();