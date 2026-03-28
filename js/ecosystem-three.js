import * as THREE from "three";

const canvas = document.getElementById("ecosystem-three-canvas");
if (!canvas) {
  throw new Error("ecosystem-three-canvas not found");
}

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 0, 12);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
renderer.setSize(window.innerWidth, window.innerHeight);

const group = new THREE.Group();
scene.add(group);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.44);
scene.add(ambientLight);

const warmLight = new THREE.PointLight(0xf1c97f, 1.25, 30);
warmLight.position.set(4, 4, 8);
scene.add(warmLight);

const fillLight = new THREE.PointLight(0xd7ecff, 0.22, 24);
fillLight.position.set(-6, -2, 6);
scene.add(fillLight);

const slabMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xf1c97f,
  transparent: true,
  opacity: 0.12,
  roughness: 0.45,
  metalness: 0.72,
  clearcoat: 0.45,
  clearcoatRoughness: 0.4
});

const wireMaterial = new THREE.MeshBasicMaterial({
  color: 0xf1c97f,
  transparent: true,
  opacity: 0.12
});

const planeGeometry = new THREE.BoxGeometry(2.2, 0.06, 1.2);
const lineGeometry = new THREE.BoxGeometry(0.08, 2.8, 0.08);
const frameGeometry = new THREE.BoxGeometry(1.6, 1.6, 0.06);

const slabs = [];
const frames = [];
const lines = [];

for (let i = 0; i < 10; i++) {
  const slab = new THREE.Mesh(planeGeometry, slabMaterial.clone());
  slab.position.set(
    (Math.random() - 0.5) * 14,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 4
  );
  slab.rotation.set(
    Math.random() * 0.5,
    Math.random() * 0.9,
    Math.random() * 0.24
  );
  slab.userData = {
    speed: 0.001 + Math.random() * 0.002
  };
  group.add(slab);
  slabs.push(slab);
}

for (let i = 0; i < 6; i++) {
  const frame = new THREE.Mesh(frameGeometry, wireMaterial.clone());
  frame.position.set(
    (Math.random() - 0.5) * 12,
    (Math.random() - 0.5) * 9,
    -1 - Math.random() * 2.5
  );
  frame.rotation.set(
    Math.random() * 0.4,
    Math.random() * 0.5,
    Math.random() * 0.2
  );
  frame.scale.setScalar(0.8 + Math.random() * 0.8);
  frame.userData = {
    speed: 0.001 + Math.random() * 0.0012
  };
  group.add(frame);
  frames.push(frame);
}

for (let i = 0; i < 8; i++) {
  const line = new THREE.Mesh(lineGeometry, wireMaterial.clone());
  line.position.set(
    (Math.random() - 0.5) * 12,
    (Math.random() - 0.5) * 8,
    -0.5 - Math.random() * 2
  );
  line.rotation.z = (Math.random() - 0.5) * 0.8;
  line.userData = {
    speed: 0.0008 + Math.random() * 0.0012
  };
  group.add(line);
  lines.push(line);
}

let targetScrollFactor = 0;
let currentScrollFactor = 0;
let mouseX = 0;
let mouseY = 0;

function updateScrollFactor() {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  targetScrollFactor = maxScroll > 0 ? window.scrollY / maxScroll : 0;
}

updateScrollFactor();
window.addEventListener("scroll", updateScrollFactor, { passive: true });

window.addEventListener("mousemove", (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = (event.clientY / window.innerHeight) * 2 - 1;
});

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
}

window.addEventListener("resize", onResize);

const clock = new THREE.Clock();

function animate() {
  const elapsed = clock.getElapsedTime();
  currentScrollFactor += (targetScrollFactor - currentScrollFactor) * 0.04;

  group.rotation.y += (mouseX * 0.08 - group.rotation.y) * 0.02;
  group.rotation.x += (-mouseY * 0.04 - group.rotation.x) * 0.02;
  group.position.y += ((-currentScrollFactor * 2.2) - group.position.y) * 0.03;

  slabs.forEach((slab, index) => {
    slab.rotation.y += slab.userData.speed;
    slab.rotation.x += slab.userData.speed * 0.45;
    slab.position.y += Math.sin(elapsed * 0.5 + index) * 0.0028;
  });

  frames.forEach((frame, index) => {
    frame.rotation.z += frame.userData.speed;
    frame.position.x += Math.sin(elapsed * 0.32 + index) * 0.0014;
  });

  lines.forEach((line, index) => {
    line.rotation.z += Math.sin(elapsed * 0.24 + index) * 0.0008;
    line.position.y += Math.cos(elapsed * 0.4 + index) * 0.0014;
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
