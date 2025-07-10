// Node class representing each node in the tree
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

let root = null;

// Insert a node into the binary tree (level-order)
function insertNode() {
  const value = parseInt(document.getElementById("nodeValue").value);
  if (!value && value !== 0) return; // reject empty input
  root = insertLevelOrder(root, value);
  renderTree(); // update tree display
}

// Level-order insertion for completeness
function insertLevelOrder(node, value) {
  if (!node) return new TreeNode(value);
  const queue = [node];
  while (queue.length) {
    let temp = queue.shift();
    if (!temp.left) {
      temp.left = new TreeNode(value);
      break;
    } else queue.push(temp.left);
    if (!temp.right) {
      temp.right = new TreeNode(value);
      break;
    } else queue.push(temp.right);
  }
  return node;
}

// Traverse tree based on type and display output
function traverse(type) {
  let result = [];
  switch (type) {
    case 'inorder': inorder(root, result); break;
    case 'preorder': preorder(root, result); break;
    case 'postorder': postorder(root, result); break;
    case 'level': result = levelOrder(root); break;
  }
  document.getElementById("output").innerText = `${type} : ${result.join(', ')}`;
}

// Inorder traversal: Left -> Root -> Right
function inorder(node, res) {
  if (!node) return;
  inorder(node.left, res);
  res.push(node.value);
  inorder(node.right, res);
}

// Preorder traversal: Root -> Left -> Right
function preorder(node, res) {
  if (!node) return;
  res.push(node.value);
  preorder(node.left, res);
  preorder(node.right, res);
}

// Postorder traversal: Left -> Right -> Root
function postorder(node, res) {
  if (!node) return;
  postorder(node.left, res);
  postorder(node.right, res);
  res.push(node.value);
}

// Level-order traversal (BFS)
function levelOrder(node) {
  if (!node) return [];
  const res = [];
  const queue = [node];
  while (queue.length) {
    let n = queue.shift();
    res.push(n.value);
    if (n.left) queue.push(n.left);
    if (n.right) queue.push(n.right);
  }
  return res;
}

// Search for a value in tree, highlight if found
function searchNode() {
  const val = parseInt(document.getElementById("nodeValue").value);
  const matches = [];
  search(root, val, matches);
  if (matches.length) {
    document.getElementById("output").innerText = `Found ${val} (x${matches.length})`;
  } else {
    document.getElementById("output").innerText = `${val} not found`;
  }
  renderTree(val); // highlight found nodes
}

// Recursive search with match tracking
function search(node, val, matches) {
  if (!node) return;
  if (node.value === val) matches.push(node);
  search(node.left, val, matches);
  search(node.right, val, matches);
}

// Delete a node by value from binary tree
function deleteNode() {
  const val = parseInt(document.getElementById("nodeValue").value);
  root = deleteInBinaryTree(root, val);
  renderTree(); // update display
}

// Deletion using last node replacement
function deleteInBinaryTree(node, val) {
  if (!node) return null;

  const queue = [node];
  let keyNode = null, lastNode = null, parent = null;

  // Level order to find target + last node
  while (queue.length) {
    lastNode = queue.shift();
    if (lastNode.value === val) keyNode = lastNode;

    if (lastNode.left) {
      queue.push(lastNode.left);
      if (lastNode.left.value === val) parent = lastNode;
    }
    if (lastNode.right) {
      queue.push(lastNode.right);
      if (lastNode.right.value === val) parent = lastNode;
    }
  }

  // Replace keyNode with lastNode and delete lastNode
  if (keyNode && lastNode) {
    keyNode.value = lastNode.value;
    if (parent?.left === lastNode) parent.left = null;
    else if (parent?.right === lastNode) parent.right = null;
    else root = null;
  }

  return node;
}

// Get the height of the binary tree
function getHeight() {
  const h = height(root);
  document.getElementById("output").innerText = `Height: ${h}`;
}

// Recursive function to calculate height
function height(node) {
  if (!node) return 0;
  return 1 + Math.max(height(node.left), node.right ? height(node.right) : 0);
}

// Render tree visually with lines and node elements
function renderTree(highlightVal = null) {
  const container = document.getElementById("treeContainer");
  const svg = document.getElementById("lines");
  container.innerHTML = "";
  svg.innerHTML = "";

  if (!root) return;

  // Level-wise layout
  const levels = [];
  const queue = [{ node: root, level: 0 }];
  while (queue.length) {
    const { node, level } = queue.shift();
    if (!levels[level]) levels[level] = [];
    levels[level].push(node);
    if (node.left) queue.push({ node: node.left, level: level + 1 });
    if (node.right) queue.push({ node: node.right, level: level + 1 });
  }

  // Scale down tree if too wide
  const zoomDiv = document.getElementById("treeZoom");
  zoomDiv.style.transform = `scale(${Math.min(1, 6 / levels[levels.length - 1].length)})`;

  // Create DOM nodes for each level
  levels.forEach((nodes, i) => {
    const levelDiv = document.createElement("div");
    levelDiv.className = "tree-level";
    nodes.forEach(n => {
      const div = document.createElement("div");
      div.className = "node";
      div.innerText = n.value;
      if (highlightVal !== null && n.value == highlightVal) {
        div.classList.add("highlight"); // highlight match
      }
      n._el = div; // store for drawing lines
      levelDiv.appendChild(div);
    });
    container.appendChild(levelDiv);
  });

  // Utility: Get center position of a node element
  function getCenter(el) {
    const r = el.getBoundingClientRect();
    return {
      x: r.left + r.width / 2 + window.scrollX,
      y: r.top + r.height / 2 + window.scrollY,
    };
  }

  // Draw a line between two nodes using SVG
  function drawLine(from, to) {
    if (!from || !to) return;
    const p1 = getCenter(from);
    const p2 = getCenter(to);
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", p1.x);
    line.setAttribute("y1", p1.y);
    line.setAttribute("x2", p2.x);
    line.setAttribute("y2", p2.y);
    line.setAttribute("stroke", "#888");
    line.setAttribute("stroke-width", "2");
    svg.appendChild(line);
  }

  // Connect all parent-child nodes recursively
  function connect(node) {
    if (!node || !node._el) return;
    if (node.left && node.left._el) drawLine(node._el, node.left._el);
    if (node.right && node.right._el) drawLine(node._el, node.right._el);
    connect(node.left);
    connect(node.right);
  }

  // Start connecting from root
  connect(root);
}