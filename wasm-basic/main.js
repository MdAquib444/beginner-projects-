fetch('hello.wasm')
  .then(res => res.arrayBuffer())
  .then(bytes => WebAssembly.instantiate(bytes))
  .then(result => {
    const val = result.instance.exports.hello();
    document.getElementById("output").textContent = "✅ Hello from WASM! Value: " + val;
  });