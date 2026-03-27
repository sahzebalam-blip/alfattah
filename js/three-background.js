import * as THREE from "three";

/* ---------- GLOBAL PARTICLES ---------- */
function initGlobalParticles() {
  const container = document.getElementById("global-particles-canvas");
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 42;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const count = window.innerWidth < 768 ? 120 : 220;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 95;
    positions[i3 + 1] = (Math.random() - 0.5) * 70;
    positions[i3 + 2] = (Math.random() - 0.5) * 20;
    sizes[i] = Math.random() * 1.6 + 0.5;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 }
    },
    vertexShader: `
      attribute float aSize;
      uniform float uTime;
      varying float vAlpha;

      void main() {
        vec3 pos = position;
        pos.y += sin(uTime * 0.18 + position.x * 0.12) * 0.18;
        pos.x += cos(uTime * 0.12 + position.y * 0.08) * 0.08;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = aSize * (220.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
        vAlpha = 0.30;
      }
    `,
    fragmentShader: `
      varying float vAlpha;

      void main() {
        float d = distance(gl_PointCoord, vec2(0.5));
        float strength = smoothstep(0.5, 0.0, d);
        vec3 color = mix(
          vec3(0.95, 0.79, 0.50),
          vec3(0.48, 0.75, 1.0),
          gl_PointCoord.y
        );
        gl_FragColor = vec4(color, strength * vAlpha);
      }
    `
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener("resize", onResize);

  function animate(time) {
    material.uniforms.uTime.value = time * 0.001;
    points.rotation.z = Math.sin(time * 0.00008) * 0.03;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate(0);
}

/* ---------- HERO SUNRISE ---------- */
function initHeroSunrise() {
  const container = document.getElementById("hero-sunrise-canvas");
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);

  const glowGeometry = new THREE.PlaneGeometry(7.5, 7.5);
  const glowMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 }
    },
    vertexShader: `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;
        vec2 center = vec2(0.56, 0.66);

        float d = distance(uv, center);
        float core = smoothstep(0.42, 0.0, d);
        float halo = smoothstep(0.72, 0.18, d);
        float rise = smoothstep(1.0, 0.2, uv.y);

        float pulse = 0.92 + sin(uTime * 1.2) * 0.05;

        vec3 gold = vec3(0.95, 0.79, 0.50);
        vec3 blue = vec3(0.48, 0.75, 1.0);
        vec3 whiteGlow = vec3(1.0, 0.97, 0.92);

        vec3 color = mix(blue, gold, smoothstep(0.8, 0.25, d));
        color = mix(color, whiteGlow, core * 0.55);

        float rays = smoothstep(0.9, 0.0, abs(uv.x - 0.56)) * smoothstep(1.0, 0.18, uv.y);
        float alpha = (halo * 0.34 + core * 0.28 + rays * 0.08) * rise * pulse;

        gl_FragColor = vec4(color, alpha);
      }
    `
  });

  const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
  glowMesh.position.set(0.65, -0.1, 0);
  group.add(glowMesh);

  const rayGeometry = new THREE.PlaneGeometry(8, 8);
  const rayMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 }
    },
    vertexShader: `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;
        vec2 center = vec2(0.56, 0.22);
        vec2 p = uv - center;

        float angle = atan(p.y, p.x);
        float radius = length(p);

        float beam = sin(angle * 8.0 + uTime * 0.25) * 0.5 + 0.5;
        beam = smoothstep(0.72, 1.0, beam);
        float mask = smoothstep(0.9, 0.15, radius) * smoothstep(-0.05, 0.22, p.y);

        vec3 color = mix(
          vec3(0.95, 0.79, 0.50),
          vec3(0.48, 0.75, 1.0),
          uv.x * 0.4
        );

        float alpha = beam * mask * 0.08;
        gl_FragColor = vec4(color, alpha);
      }
    `
  });

  const rayMesh = new THREE.Mesh(rayGeometry, rayMaterial);
  rayMesh.position.set(0.25, -0.35, -0.2);
  group.add(rayMesh);

  const particleCount = window.innerWidth < 768 ? 70 : 120;
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    particlePositions[i3] = (Math.random() - 0.15) * 5.2;
    particlePositions[i3 + 1] = (Math.random() - 0.35) * 4.8;
    particlePositions[i3 + 2] = (Math.random() - 0.5) * 2;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(particlePositions, 3)
  );

  const particleMaterial = new THREE.PointsMaterial({
    size: window.innerWidth < 768 ? 0.03 : 0.04,
    transparent: true,
    opacity: 0.40,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: new THREE.Color("#f2d089")
  });

  const particlePoints = new THREE.Points(particleGeometry, particleMaterial);
  particlePoints.position.set(0.45, -0.15, 0.2);
  group.add(particlePoints);

  function onResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  window.addEventListener("resize", onResize);

  function animate(time) {
    const t = time * 0.001;
    glowMaterial.uniforms.uTime.value = t;
    rayMaterial.uniforms.uTime.value = t;

    glowMesh.position.y = -0.1 + Math.sin(t * 0.8) * 0.04;
    particlePoints.rotation.z = Math.sin(t * 0.18) * 0.08;
    particlePoints.position.y = -0.15 + Math.sin(t * 0.45) * 0.04;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate(0);
}

initGlobalParticles();
initHeroSunrise();
