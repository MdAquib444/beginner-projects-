const canvas = document.getElementById("glCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gl = canvas.getContext("webgl");
if (!gl) {
  showError("WebGL not supported.");
  throw new Error("WebGL not supported");
}

// Error display helper
function showError(msg) {
  const err = document.createElement("div");
  err.style.position = "absolute";
  err.style.top = "10px";
  err.style.left = "10px";
  err.style.color = "red";
  err.style.background = "black";
  err.style.padding = "5px";
  err.style.fontFamily = "monospace";
  err.textContent = msg;
  document.body.appendChild(err);
}

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
    gl_FragColor = vec4(0.1, 0.8, 1.0, 1.0);
  }
`;

function createShader(gl, type, source, name) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    showError(`Shader Error (${name}): ${log}`);
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
    const log = gl.getProgramInfoLog(program);
    showError(`Program Link Error: ${log}`);
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

const vs = createShader(gl, gl.VERTEX_SHADER, vsSource, "Vertex Shader");
const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource, "Fragment Shader");

if (!vs || !fs) throw new Error("Shader compile failed");

const program = createProgram(gl, vs, fs);
if (!program) throw new Error("Program link failed");

// Cube data
const positions = new Float32Array([
  -1, -1,  1,
   1, -1,  1,
   1,  1,  1,
  -1,  1,  1,
  -1, -1, -1,
   1, -1, -1,
   1,  1, -1,
  -1,  1, -1
]);

const indices = new Uint16Array([
  0, 1, 2, 0, 2, 3,
  4, 5, 6, 4, 6, 7,
  3, 2, 6, 3, 6, 7,
  0, 1, 5, 0, 5, 4,
  0, 3, 7, 0, 7, 4,
  1, 2, 6, 1, 6, 5
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

// Matrices
function perspective(fov, aspect, near, far) {
  const f = 1.0 / Math.tan(fov / 2);
  const range = 1 / (near - far);
  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * range, -1,
    0, 0, near * far * 2 * range, 0
  ];
}

function multiply(a, b) {
  const out = new Array(16);
  for (let i = 0; i < 4; ++i)
    for (let j = 0; j < 4; ++j) {
      out[i * 4 + j] = 0;
      for (let k = 0; k < 4; ++k)
        out[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j];
    }
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
    0, 1, 0, 0,
    s, 0,  c, 0,
    0, 0, 0, 1
  ];

  const trans = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, -5, 1
  ];

  const modelView = multiply(trans, rotY);
  const finalMatrix = multiply(proj, modelView);

  gl.uniformMatrix4fv(uMatrix, false, new Float32Array(finalMatrix));
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

  requestAnimationFrame(draw);
}

draw();