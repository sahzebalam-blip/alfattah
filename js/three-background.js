import * as THREE from "three";

const particleMount = document.getElementById("global-particles-canvas");
const ambientLayer = document.getElementById("global-ambient-layer");

if (particleMount) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 16;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  particleMount.appendChild(renderer.domElement);

  Object.assign(particleMount.style, {
    position: "fixed",
    inset: "0",
    zIndex: "0",
    pointerEvents: "none",
    overflow: "hidden",
  });

  Object.assign(renderer.domElement.style, {
    width: "100%",
    height: "100%",
    display: "block",
    opacity: window.innerWidth <= 768 ? "0.55" : "0.85",
  });

  // =========================
  // PARTICLES
  // =========================
  const particleCount = window.innerWidth <= 768 ? 120 : 220;
  const positions = new Float32Array(particleCount * 3);
  const scales = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 38;
    positions[i3 + 1] = (Math.random() - 0.5) * 24;
    positions[i3 + 2] = (Math.random() - 0.5) * 16;
    scales[i] = Math.random();
  }

  const particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  particlesGeometry.setAttribute(
    "aScale",
    new THREE.BufferAttribute(scales, 1)
  );

  const particlesMaterial = new THREE.PointsMaterial({
    size: window.innerWidth <= 768 ? 0.05 : 0.065,
    color: new THREE.Color("#d7b46a"),
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  // =========================
  // GOLD HAZE
  // =========================
  const hazeGeometry = new THREE.PlaneGeometry(18, 18, 1, 1);

  const createGlowPlane = (color, opacity, x, y, scaleX, scaleY) => {
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const plane = new THREE.Mesh(hazeGeometry, material);
    plane.position.set(x, y, -4);
    plane.scale.set(scaleX, scaleY, 1);
    scene.add(plane);
    return plane;
  };

  const goldGlowLeft = createGlowPlane("#c99a3c", 0.07, -6.4, 2.4, 0.9, 1.6);
  const blueGlowRight = createGlowPlane("#315fb2", 0.05, 6.6, 0.3, 1.2, 1.8);
  const horizonGlow = createGlowPlane("#e0aa55", 0.08, 0, -6.3, 1.9, 0.65);

  // =========================
  // FLOATING SIGNAL LINES
  // =========================
  const lineGroup = new THREE.Group();
  scene.add(lineGroup);

  const makeLine = (width, y, opacity, color, xOffset = 0) => {
    const geo = new THREE.PlaneGeometry(width, 0.018, 1, 1);
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(xOffset, y, -2.5);
    lineGroup.add(mesh);
    return mesh;
  };

  const lines = [
    makeLine(11.5, 3.2, 0.06, "#d8b469", -1.4),
    makeLine(8.8, -1.4, 0.045, "#6ea4ff", 1.8),
    makeLine(9.4, -4.8, 0.05, "#d8b469", 0.2),
  ];

  // =========================
  // MOUSE INTERACTION
  // =========================
  const mouse = {
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
  };

  window.addEventListener("mousemove", (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // =========================
  // AMBIENT LAYER CSS LIGHT
  // =========================
  if (ambientLayer) {
    Object.assign(ambientLayer.style, {
      position: "fixed",
      inset: "0",
      pointerEvents: "none",
      zIndex: "0",
      background: `
        radial-gradient(circle at 18% 20%, rgba(255, 215, 120, 0.08), transparent 24%),
        radial-gradient(circle at 78% 28%, rgba(94, 167, 255, 0.06), transparent 26%),
        radial-gradient(circle at 50% 105%, rgba(255, 190, 90, 0.08), transparent 28%)
      `,
      mixBlendMode: "screen",
      opacity: window.innerWidth <= 768 ? "0.7" : "1",
    });
  }

  // =========================
  // RESIZE
  // =========================
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.domElement.style.opacity = window.innerWidth <= 768 ? "0.55" : "0.85";

    if (ambientLayer) {
      ambientLayer.style.opacity = window.innerWidth <= 768 ? "0.7" : "1";
    }
  };

  window.addEventListener("resize", handleResize);

  // =========================
  // ANIMATION LOOP
  // =========================
  const clock = new THREE.Clock();

  const animate = () => {
    const elapsed = clock.getElapsedTime();

    mouse.x += (mouse.tx - mouse.x) * 0.03;
    mouse.y += (mouse.ty - mouse.y) * 0.03;

    particles.rotation.z = elapsed * 0.012;
    particles.rotation.x = mouse.y * 0.03;
    particles.rotation.y = mouse.x * 0.05;

    const pos = particlesGeometry.attributes.position.array;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      pos[i3 + 1] += Math.sin(elapsed * 0.35 + i * 0.17) * 0.0018;
      pos[i3] += Math.cos(elapsed * 0.22 + i * 0.11) * 0.0009;
    }

    particlesGeometry.attributes.position.needsUpdate = true;

    goldGlowLeft.position.y = 2.4 + Math.sin(elapsed * 0.35) * 0.16;
    goldGlowLeft.position.x = -6.4 + mouse.x * 0.35;

    blueGlowRight.position.y = 0.3 + Math.cos(elapsed * 0.28) * 0.22;
    blueGlowRight.position.x = 6.6 + mouse.x * 0.28;

    horizonGlow.position.y = -6.3 + Math.sin(elapsed * 0.2) * 0.1;
    horizonGlow.material.opacity = 0.075 + Math.sin(elapsed * 0.55) * 0.01;

    lines[0].position.x = -1.4 + Math.sin(elapsed * 0.4) * 0.25;
    lines[1].position.x = 1.8 + Math.cos(elapsed * 0.3) * 0.28;
    lines[2].position.x = 0.2 + Math.sin(elapsed * 0.22) * 0.18;

    lineGroup.rotation.z = mouse.x * 0.025;
    lineGroup.position.y = mouse.y * 0.16;

    camera.position.x = mouse.x * 0.3;
    camera.position.y = mouse.y * 0.18;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();
}
