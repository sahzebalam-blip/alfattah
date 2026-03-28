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
    opacity: window.innerWidth <= 768 ? "0.52" : "0.74",
  });

  // =========================
  // PARTICLES
  // =========================
  const particleCount = window.innerWidth <= 768 ? 110 : 200;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 38;
    positions[i3 + 1] = (Math.random() - 0.5) * 24;
    positions[i3 + 2] = (Math.random() - 0.5) * 16;
  }

  const particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const particlesMaterial = new THREE.PointsMaterial({
    size: window.innerWidth <= 768 ? 0.05 : 0.065,
    color: new THREE.Color("#d7b46a"),
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  // =========================
  // GLOW PLANES
  // =========================
  const glowGeometry = new THREE.PlaneGeometry(18, 18, 1, 1);

  const createGlowPlane = (color, opacity, x, y, scaleX, scaleY) => {
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const plane = new THREE.Mesh(glowGeometry, material);
    plane.position.set(x, y, -4);
    plane.scale.set(scaleX, scaleY, 1);
    scene.add(plane);
    return plane;
  };

  // toned-down big washes
  const leftGoldGlow = createGlowPlane("#c99634", 0.035, -6.1, 1.7, 1.0, 1.55);
  const rightBlueGlow = createGlowPlane("#294f9a", 0.026, 6.8, 0.9, 1.15, 1.8);

  // subtle sunrise horizon
  const horizonGlow = createGlowPlane("#d79a43", 0.06, 0, -6.7, 2.25, 0.6);

  // =========================
  // SIGNAL LINES
  // =========================
  const lineGroup = new THREE.Group();
  scene.add(lineGroup);

  const makeLine = (width, y, opacity, color, xOffset = 0) => {
    const geo = new THREE.PlaneGeometry(width, 0.014, 1, 1);
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(xOffset, y, -2.6);
    lineGroup.add(mesh);
    return mesh;
  };

  const lines = [
    makeLine(10.5, 3.3, 0.028, "#cfa75a", -1.2),
    makeLine(8.4, -1.6, 0.022, "#5b8fe7", 1.7),
    makeLine(9.1, -4.9, 0.025, "#cfa75a", 0.1),
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
  // CSS AMBIENT LAYER
  // =========================
  if (ambientLayer) {
    Object.assign(ambientLayer.style, {
      position: "fixed",
      inset: "0",
      pointerEvents: "none",
      zIndex: "0",
      background: `
        radial-gradient(circle at 18% 24%, rgba(255, 210, 110, 0.05), transparent 24%),
        radial-gradient(circle at 78% 26%, rgba(94, 167, 255, 0.04), transparent 26%),
        radial-gradient(circle at 50% 108%, rgba(215, 150, 70, 0.085), transparent 22%)
      `,
      mixBlendMode: "screen",
      opacity: window.innerWidth <= 768 ? "0.58" : "0.84",
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
    renderer.domElement.style.opacity = window.innerWidth <= 768 ? "0.52" : "0.74";

    if (ambientLayer) {
      ambientLayer.style.opacity = window.innerWidth <= 768 ? "0.58" : "0.84";
    }
  };

  window.addEventListener("resize", handleResize);

  // =========================
  // ANIMATION LOOP
  // =========================
  const clock = new THREE.Clock();

  const animate = () => {
    const elapsed = clock.getElapsedTime();

    mouse.x += (mouse.tx - mouse.x) * 0.024;
    mouse.y += (mouse.ty - mouse.y) * 0.024;

    particles.rotation.z = elapsed * 0.009;
    particles.rotation.x = mouse.y * 0.022;
    particles.rotation.y = mouse.x * 0.032;

    const pos = particlesGeometry.attributes.position.array;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      pos[i3 + 1] += Math.sin(elapsed * 0.28 + i * 0.14) * 0.0013;
      pos[i3] += Math.cos(elapsed * 0.18 + i * 0.09) * 0.00065;
    }

    particlesGeometry.attributes.position.needsUpdate = true;

    leftGoldGlow.position.y = 1.7 + Math.sin(elapsed * 0.22) * 0.1;
    leftGoldGlow.position.x = -6.1 + mouse.x * 0.18;

    rightBlueGlow.position.y = 0.9 + Math.cos(elapsed * 0.2) * 0.11;
    rightBlueGlow.position.x = 6.8 + mouse.x * 0.15;

    horizonGlow.position.y = -6.7 + Math.sin(elapsed * 0.12) * 0.05;
    horizonGlow.material.opacity = 0.056 + Math.sin(elapsed * 0.35) * 0.005;

    lines[0].position.x = -1.2 + Math.sin(elapsed * 0.24) * 0.14;
    lines[1].position.x = 1.7 + Math.cos(elapsed * 0.2) * 0.14;
    lines[2].position.x = 0.1 + Math.sin(elapsed * 0.16) * 0.1;

    lineGroup.rotation.z = mouse.x * 0.01;
    lineGroup.position.y = mouse.y * 0.07;

    camera.position.x = mouse.x * 0.14;
    camera.position.y = mouse.y * 0.09;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();
}
