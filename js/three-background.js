import * as THREE from "three";

const particleContainer = document.getElementById("global-particles-canvas");
const ambientLayer = document.getElementById("global-ambient-layer");
const heroSunriseContainer = document.getElementById("hero-sunrise-canvas");

let renderer;
let scene;
let camera;
let particleSystem;
let rayGroup;
let clock;
let animationId;

function initGlobalScene() {
  if (!particleContainer) return;

  scene = new THREE.Scene();
  clock = new THREE.Clock();

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    200
  );
  camera.position.z = 26;

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.position = "fixed";
  renderer.domElement.style.inset = "0";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.pointerEvents = "none";
  renderer.domElement.style.zIndex = "0";

  particleContainer.innerHTML = "";
  particleContainer.appendChild(renderer.domElement);

  createParticles();
  createRays();
  createSoftGlowDOM();
}

function createParticles() {
  const count = 1400;
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    const i3 = i * 3;

    positions[i3] = (Math.random() - 0.5) * 120;
    positions[i3 + 1] = (Math.random() - 0.5) * 90;
    positions[i3 + 2] = (Math.random() - 0.5) * 50;

    scales[i] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: `
      attribute float aScale;
      uniform float uTime;
      varying float vAlpha;

      void main() {
        vec3 pos = position;
        pos.y += sin(uTime * 0.08 + position.x * 0.05) * 0.22;
        pos.x += cos(uTime * 0.05 + position.y * 0.04) * 0.12;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = (1.1 + aScale * 2.2) * (30.0 / -mvPosition.z);
        vAlpha = 0.22 + aScale * 0.48;
      }
    `,
    fragmentShader: `
      varying float vAlpha;

      void main() {
        vec2 uv = gl_PointCoord - vec2(0.5);
        float d = length(uv);
        float strength = smoothstep(0.48, 0.0, d);

        vec3 gold = vec3(0.86, 0.70, 0.36);
        vec3 blue = vec3(0.36, 0.58, 0.96);
        vec3 color = mix(blue, gold, strength * 0.7);

        gl_FragColor = vec4(color, strength * vAlpha);
      }
    `,
  });

  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);
}

function createRays() {
  rayGroup = new THREE.Group();

  const rayGeometry = new THREE.PlaneGeometry(3.2, 36, 1, 1);

  for (let i = 0; i < 10; i += 1) {
    const material = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? 0xd7ad59 : 0x4d7ee6,
      transparent: true,
      opacity: i % 2 === 0 ? 0.028 : 0.02,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    const ray = new THREE.Mesh(rayGeometry, material);
    ray.position.x = -42 + i * 9;
    ray.position.y = -6 + Math.random() * 14;
    ray.position.z = -14 - Math.random() * 8;
    ray.rotation.z = THREE.MathUtils.degToRad(-10 + Math.random() * 20);
    ray.scale.y = 0.7 + Math.random() * 0.8;

    rayGroup.add(ray);
  }

  scene.add(rayGroup);
}

function createSoftGlowDOM() {
  if (!ambientLayer) return;

  ambientLayer.innerHTML = "";

  const glow = document.createElement("div");
  glow.className = "global-soft-glow";

  const haze = document.createElement("div");
  haze.className = "global-soft-haze";

  ambientLayer.append(glow, haze);

  Object.assign(ambientLayer.style, {
    position: "fixed",
    inset: "0",
    pointerEvents: "none",
    zIndex: "0",
    overflow: "hidden",
  });

  Object.assign(glow.style, {
    position: "absolute",
    inset: "0",
    background:
      "radial-gradient(circle at 22% 18%, rgba(214,170,76,0.06), transparent 26%), radial-gradient(circle at 78% 22%, rgba(77,126,230,0.06), transparent 24%), radial-gradient(circle at 50% 72%, rgba(214,170,76,0.04), transparent 30%)",
    filter: "blur(14px)",
  });

  Object.assign(haze.style, {
    position: "absolute",
    inset: "0",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.015), rgba(255,255,255,0))",
    opacity: "0.5",
  });
}

function animateGlobalScene() {
  if (!renderer || !scene || !camera) return;

  const elapsed = clock.getElapsedTime();

  if (particleSystem?.material?.uniforms?.uTime) {
    particleSystem.material.uniforms.uTime.value = elapsed;
  }

  if (particleSystem) {
    particleSystem.rotation.y = elapsed * 0.012;
    particleSystem.rotation.x = Math.sin(elapsed * 0.08) * 0.015;
  }

  if (rayGroup) {
    rayGroup.children.forEach((ray, index) => {
      ray.position.y += Math.sin(elapsed * 0.35 + index) * 0.0028;
      ray.material.opacity =
        (index % 2 === 0 ? 0.026 : 0.018) +
        Math.sin(elapsed * 0.45 + index) * 0.003;
    });
  }

  renderer.render(scene, camera);
  animationId = requestAnimationFrame(animateGlobalScene);
}

function onResize() {
  if (!renderer || !camera) return;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function initHeroSunrise() {
  if (!heroSunriseContainer) return;

  const scene = new THREE.Scene();
  const width = heroSunriseContainer.clientWidth || 520;
  const height = heroSunriseContainer.clientHeight || 520;

  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0);

  heroSunriseContainer.innerHTML = "";
  heroSunriseContainer.appendChild(renderer.domElement);

  const group = new THREE.Group();

  const glowGeometry = new THREE.SphereGeometry(1.3, 48, 48);
  const glowMaterial = new THREE.ShaderMaterial({
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
        vec3 gold = vec3(0.92, 0.76, 0.42);
        vec3 blue = vec3(0.31, 0.52, 0.94);
        vec3 color = mix(blue, gold, 0.62);
        gl_FragColor = vec4(color, intensity * 0.52);
      }
    `,
  });

  const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
  group.add(glowSphere);

  const horizonGeometry = new THREE.RingGeometry(1.8, 2.05, 128);
  const horizonMaterial = new THREE.MeshBasicMaterial({
    color: 0xd7ad59,
    transparent: true,
    opacity: 0.16,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });

  const horizonRing = new THREE.Mesh(horizonGeometry, horizonMaterial);
  horizonRing.rotation.x = Math.PI / 2.8;
  group.add(horizonRing);

  const outerGeometry = new THREE.RingGeometry(2.4, 2.46, 128);
  const outerMaterial = new THREE.MeshBasicMaterial({
    color: 0x4d7ee6,
    transparent: true,
    opacity: 0.08,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });

  const outerRing = new THREE.Mesh(outerGeometry, outerMaterial);
  outerRing.rotation.x = Math.PI / 2.45;
  outerRing.rotation.z = 0.24;
  group.add(outerRing);

  const particleCount = 180;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i += 1) {
    const i3 = i * 3;
    const radius = 2.2 + Math.random() * 1.4;
    const angle = Math.random() * Math.PI * 2;

    positions[i3] = Math.cos(angle) * radius;
    positions[i3 + 1] = (Math.random() - 0.5) * 2.8;
    positions[i3 + 2] = Math.sin(angle) * radius * 0.55;
  }

  const particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const particlesMaterial = new THREE.PointsMaterial({
    color: 0xe6c47f,
    size: 0.038,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  group.add(particles);

  scene.add(group);

  const localClock = new THREE.Clock();

  function renderSunrise() {
    const t = localClock.getElapsedTime();

    glowSphere.scale.setScalar(1 + Math.sin(t * 0.9) * 0.04);
    horizonRing.rotation.z += 0.0017;
    outerRing.rotation.z -= 0.0011;
    particles.rotation.y += 0.0016;
    group.rotation.y = Math.sin(t * 0.18) * 0.12;

    renderer.render(scene, camera);
    requestAnimationFrame(renderSunrise);
  }

  renderSunrise();

  const resizeObserver = new ResizeObserver(() => {
    const newWidth = heroSunriseContainer.clientWidth || 520;
    const newHeight = heroSunriseContainer.clientHeight || 520;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });

  resizeObserver.observe(heroSunriseContainer);
}

function init() {
  initGlobalScene();
  initHeroSunrise();
  animateGlobalScene();
  window.addEventListener("resize", onResize);
}

init();

window.addEventListener("beforeunload", () => {
  if (animationId) cancelAnimationFrame(animationId);
});
