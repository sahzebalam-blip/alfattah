import * as THREE from "three";

const canvas = document.getElementById("access-three-canvas");

if (canvas) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.2));

  // ===== LIGHT =====
  const light = new THREE.PointLight(0xf1c97f, 1.2);
  light.position.set(2, 3, 4);
  scene.add(light);

  const softLight = new THREE.AmbientLight(0xffffff, 0.25);
  scene.add(softLight);

  // ===== OBJECTS (minimal for performance) =====

  const group = new THREE.Group();
  scene.add(group);

  // floating slabs
  for (let i = 0; i < 6; i++) {
    const geo = new THREE.BoxGeometry(0.9, 1.6, 0.05);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      emissive: 0xf1c97f,
      emissiveIntensity: 0.06,
      roughness: 0.4,
      metalness: 0.6,
      transparent: true,
      opacity: 0.55,
    });

    const mesh = new THREE.Mesh(geo, mat);

    mesh.position.x = (Math.random() - 0.5) * 6;
    mesh.position.y = (Math.random() - 0.5) * 4;
    mesh.position.z = (Math.random() - 0.5) * 2;

    mesh.rotation.y = Math.random() * Math.PI;

    group.add(mesh);
  }

  // thin signal lines
  for (let i = 0; i < 4; i++) {
    const geo = new THREE.BoxGeometry(0.02, 2.4, 0.02);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xf1c97f,
      transparent: true,
      opacity: 0.25,
    });

    const line = new THREE.Mesh(geo, mat);

    line.position.x = (Math.random() - 0.5) * 5;
    line.position.y = (Math.random() - 0.5) * 3;

    scene.add(line);
  }

  // ===== ANIMATION =====
  let time = 0;

  function animate() {
    requestAnimationFrame(animate);

    time += 0.003;

    group.rotation.y += 0.0008;

    group.children.forEach((obj, i) => {
      obj.position.y += Math.sin(time + i) * 0.0015;
      obj.rotation.y += 0.001;
    });

    renderer.render(scene, camera);
  }

  animate();

  // ===== RESIZE =====
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
