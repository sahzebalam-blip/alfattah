import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';

const canvas = document.getElementById('three-canvas');

if (canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 9);

  const group = new THREE.Group();
  scene.add(group);

  const blue = new THREE.Color('#77bbff');
  const gold = new THREE.Color('#f5cf87');

  function makeArc(radius, opacity, color, rotationX = 0, rotationY = 0) {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius * 0.55, 0, Math.PI * 1.65, false, 0);
    const points = curve.getPoints(140);
    const geometry = new THREE.BufferGeometry().setFromPoints(points.map((p) => new THREE.Vector3(p.x, p.y, 0)));
    const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
    const line = new THREE.Line(geometry, material);
    line.rotation.x = rotationX;
    line.rotation.y = rotationY;
    return line;
  }

  const arcOne = makeArc(1.45, 0.42, blue, 0.18, 0.1);
  const arcTwo = makeArc(2.1, 0.2, gold, -0.32, 0.22);
  const arcThree = makeArc(2.8, 0.16, blue, 0.44, -0.18);
  group.add(arcOne, arcTwo, arcThree);
  group.position.set(1.8, 0.65, 0);

  const particleCount = 110;
  const positions = new Float32Array(particleCount * 3);
  const scales = [];

  for (let i = 0; i < particleCount; i += 1) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.15) * 6.4;
    positions[i3 + 1] = (Math.random() - 0.2) * 3.8;
    positions[i3 + 2] = (Math.random() - 0.5) * 2;
    scales.push(Math.random() * 0.8 + 0.2);
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    color: '#a9d4ff',
    size: 0.03,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  particles.position.set(1.2, -0.1, -0.2);
  scene.add(particles);

  const glowGeometry = new THREE.SphereGeometry(0.22, 24, 24);
  const glowMaterial = new THREE.MeshBasicMaterial({ color: '#8fc7ff', transparent: true, opacity: 0.18 });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.position.set(1.85, 0.7, -0.4);
  scene.add(glow);

  const mouse = { x: 0, y: 0 };
  window.addEventListener('pointermove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (event.clientY / window.innerHeight) * 2 - 1;
  });

  function animate() {
    requestAnimationFrame(animate);

    const time = performance.now() * 0.00032;
    group.rotation.z += 0.0008;
    group.rotation.y = Math.sin(time * 1.6) * 0.08 + mouse.x * 0.05;
    group.rotation.x = Math.cos(time * 1.4) * 0.05 + mouse.y * 0.04;

    particles.rotation.z = time * 0.08;
    particles.position.x = 1.2 + mouse.x * 0.15;
    particles.position.y = -0.1 + mouse.y * 0.08;

    glow.scale.setScalar(1 + Math.sin(time * 7) * 0.08);
    glow.material.opacity = 0.15 + Math.sin(time * 5) * 0.03;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
