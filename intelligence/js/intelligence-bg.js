import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js";

const canvas = document.getElementById("intelligence-bg");

if (canvas) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 12;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const particleCount = 140;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 26;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  const particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const particlesMaterial = new THREE.PointsMaterial({
    color: "#0b1c3d",
    size: 0.045,
    transparent: true,
    opacity: 0.18,
  });

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  const lineMaterial = new THREE.LineBasicMaterial({
    color: "#c8a96a",
    transparent: true,
    opacity: 0.06,
  });

  const linePoints = [
    new THREE.Vector3(-6, 2.5, 0),
    new THREE.Vector3(-1.5, 0.6, 0),
    new THREE.Vector3(2, 1.4, 0),
    new THREE.Vector3(6, -1.2, 0),
  ];

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
  const line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);

  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener("mousemove", (event) => {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 0.35;
    mouseY = (event.clientY / window.innerHeight - 0.5) * 0.25;
  });

  function animate() {
    requestAnimationFrame(animate);

    particles.rotation.y += 0.0009;
    particles.rotation.x += 0.0003;

    particles.position.x += (mouseX - particles.position.x) * 0.03;
    particles.position.y += (-mouseY - particles.position.y) * 0.03;

    line.rotation.y += 0.0006;
    line.position.x += (mouseX * 1.2 - line.position.x) * 0.03;
    line.position.y += (-mouseY * 1.1 - line.position.y) * 0.03;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
