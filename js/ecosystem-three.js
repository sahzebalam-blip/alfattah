document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("ecoHeroCanvas");
  if (!canvas || typeof THREE === "undefined") return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 14;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });

  const mobile = window.innerWidth <= 767;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const group = new THREE.Group();
  scene.add(group);

  // Core sphere
  const sphereGeo = new THREE.IcosahedronGeometry(1.5, 1);
  const sphereMat = new THREE.MeshBasicMaterial({
    color: 0x6ba4ff,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  group.add(sphere);

  // Rings
  const ringMaterial = new THREE.LineBasicMaterial({
    color: 0x7fb0ff,
    transparent: true,
    opacity: 0.34
  });

  function createRing(radius, tiltX, tiltY) {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius * 0.48, 0, Math.PI * 2, false, 0);
    const points = curve.getPoints(100).map((p) => new THREE.Vector3(p.x, p.y, 0));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.LineLoop(geometry, ringMaterial);
    line.rotation.x = tiltX;
    line.rotation.y = tiltY;
    return line;
  }

  const ring1 = createRing(3.1, 0.8, 0.2);
  const ring2 = createRing(4.3, 1.1, -0.5);
  const ring3 = createRing(5.6, 0.35, 0.9);

  group.add(ring1, ring2, ring3);

  // Floating nodes
  const nodeMaterial = new THREE.MeshBasicMaterial({
    color: 0x9fc3ff,
    transparent: true,
    opacity: 0.9
  });

  const nodes = [];
  const nodeCount = mobile ? 18 : 34;

  for (let i = 0; i < nodeCount; i++) {
    const nodeGeo = new THREE.SphereGeometry(0.05, 12, 12);
    const node = new THREE.Mesh(nodeGeo, nodeMaterial);

    const radius = 3 + Math.random() * 3.8;
    const angle = Math.random() * Math.PI * 2;
    const height = (Math.random() - 0.5) * 4.5;

    node.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.45 + height * 0.08,
      (Math.random() - 0.5) * 2.8
    );

    node.userData = {
      angle,
      radius,
      speed: 0.0015 + Math.random() * 0.0022,
      offsetY: (Math.random() - 0.5) * 0.5
    };

    nodes.push(node);
    group.add(node);
  }

  // Connection lines
  const lineGroup = new THREE.Group();
  group.add(lineGroup);

  function updateConnections() {
    while (lineGroup.children.length) {
      const child = lineGroup.children.pop();
      child.geometry.dispose();
      lineGroup.remove(child);
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i].position;
        const b = nodes[j].position;
        const dist = a.distanceTo(b);

        if (dist < 2.1) {
          const geometry = new THREE.BufferGeometry().setFromPoints([a.clone(), b.clone()]);
          const material = new THREE.LineBasicMaterial({
            color: 0x6f9ef3,
            transparent: true,
            opacity: 0.12
          });
          const line = new THREE.Line(geometry, material);
          lineGroup.add(line);
        }
      }
    }
  }

  // Ambient stars
  const starCount = mobile ? 180 : 360;
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = [];

  for (let i = 0; i < starCount; i++) {
    starPositions.push(
      (Math.random() - 0.5) * 90,
      (Math.random() - 0.5) * 54,
      -20 - Math.random() * 40
    );
  }

  starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starPositions, 3)
  );

  const starMaterial = new THREE.PointsMaterial({
    size: mobile ? 0.045 : 0.06,
    color: 0x9cbcff,
    transparent: true,
    opacity: 0.34
  });

  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  function animate() {
    requestAnimationFrame(animate);

    sphere.rotation.x += 0.0024;
    sphere.rotation.y += 0.003;

    ring1.rotation.z += 0.002;
    ring2.rotation.z -= 0.0015;
    ring3.rotation.z += 0.0011;

    nodes.forEach((node, index) => {
      node.userData.angle += node.userData.speed;
      node.position.x = Math.cos(node.userData.angle + index * 0.1) * node.userData.radius;
      node.position.y =
        Math.sin(node.userData.angle + index * 0.08) * node.userData.radius * 0.45 +
        Math.sin(node.userData.angle * 2) * 0.2 +
        node.userData.offsetY;
    });

    updateConnections();

    group.rotation.y += 0.0018;
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, mouseY * 0.08, 0.03);
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, group.rotation.y + mouseX * 0.002, 0.02);

    stars.rotation.z += 0.00025;

    renderer.render(scene, camera);
  }

  animate();

  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, w <= 767 ? 1.5 : 2));
    renderer.setSize(w, h);
  }

  window.addEventListener("resize", onResize);
});
