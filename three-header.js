document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById('canvas-container');
  if (!container) return;

  // Setup Scene, Camera, Renderer
  const scene = new THREE.Scene();
  // Deep charcoal fog to blend elements as they move further back
  scene.fog = new THREE.FogExp2(0x0a0a0c, 0.0015);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 40;
  camera.position.y = 10;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x0a0a0c, 1); // Deep charcoal background
  container.appendChild(renderer.domElement);

  // Cinematic Lighting
  const ambientLight = new THREE.AmbientLight(0x222233, 1.5);
  scene.add(ambientLight);

  // Neon Blue Rim Lighting
  const blueLight1 = new THREE.PointLight(0x0066ff, 3, 150);
  blueLight1.position.set(-20, -10, 20);
  scene.add(blueLight1);

  const blueLight2 = new THREE.PointLight(0x00aaff, 2, 100);
  blueLight2.position.set(30, 20, 10);
  scene.add(blueLight2);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(0, 50, 20);
  scene.add(directionalLight);

  // Materials
  // High-gloss metallic liquid material
  const liquidMaterial = new THREE.MeshStandardMaterial({
    color: 0x111115,
    roughness: 0.1,
    metalness: 0.9,
    envMapIntensity: 1.0,
  });

  // Obsidian Shard material
  const obsidianMaterial = new THREE.MeshStandardMaterial({
    color: 0x050508,
    roughness: 0.05,
    metalness: 0.7,
    flatShading: true,
  });

  // Groups to hold elements
  const blobs = [];
  const shards = [];

  // Create Liquid Blobs (using Sphere/Icosahedron geometry)
  const blobGeo = new THREE.IcosahedronGeometry(1, 4);
  for (let i = 0; i < 35; i++) {
    const mesh = new THREE.Mesh(blobGeo, liquidMaterial);
    
    // Random positions
    mesh.position.x = (Math.random() - 0.5) * 80;
    mesh.position.y = (Math.random() - 0.5) * 100 - 20;
    mesh.position.z = (Math.random() - 0.5) * 60 - 10;
    
    // Random scales
    const scale = Math.random() * 2 + 0.5;
    mesh.scale.set(scale, scale, scale);
    
    // Add custom properties for animation
    mesh.userData = {
      speed: Math.random() * 0.05 + 0.02,
      wobbleSpeed: Math.random() * 0.02 + 0.01,
      baseX: mesh.position.x,
      baseZ: mesh.position.z,
      seed: Math.random() * Math.PI * 2
    };
    
    scene.add(mesh);
    blobs.push(mesh);
  }

  // Create Obsidian Shards
  const shardGeo = new THREE.TetrahedronGeometry(1, 0); // Sharp polygonal shapes
  for (let i = 0; i < 60; i++) {
    const mesh = new THREE.Mesh(shardGeo, obsidianMaterial);
    
    mesh.position.x = (Math.random() - 0.5) * 100;
    mesh.position.y = (Math.random() - 0.5) * 100 - 20;
    mesh.position.z = (Math.random() - 0.5) * 80 - 20;
    
    // Elongate and scale to look like shards
    mesh.scale.set(
      Math.random() * 1.5 + 0.5,
      Math.random() * 4 + 1,
      Math.random() * 1.5 + 0.5
    );
    
    // Random rotation
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    mesh.rotation.z = Math.random() * Math.PI;
    
    mesh.userData = {
      speed: Math.random() * 0.08 + 0.03,
      rotSpeedX: (Math.random() - 0.5) * 0.02,
      rotSpeedY: (Math.random() - 0.5) * 0.02,
      rotSpeedZ: (Math.random() - 0.5) * 0.02
    };
    
    scene.add(mesh);
    shards.push(mesh);
  }

  // Mouse interactivity
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    // Smooth camera movement
    camera.rotation.y += 0.05 * (targetX - camera.rotation.y);
    camera.rotation.x += 0.05 * (targetY - camera.rotation.x);

    // Animate Blobs (Drifting upwards + Wobbling)
    blobs.forEach((blob) => {
      blob.position.y += blob.userData.speed;
      
      // Wobble effect
      blob.scale.y = blob.scale.x + Math.sin(time * 2 + blob.userData.seed) * 0.2;
      blob.scale.z = blob.scale.x + Math.cos(time * 2 + blob.userData.seed) * 0.2;
      
      blob.position.x = blob.userData.baseX + Math.sin(time * blob.userData.wobbleSpeed + blob.userData.seed) * 5;
      
      // Reset if it goes too high
      if (blob.position.y > 60) {
        blob.position.y = -60;
      }
    });

    // Animate Shards (Drifting upwards + Rotating)
    shards.forEach((shard) => {
      shard.position.y += shard.userData.speed;
      shard.rotation.x += shard.userData.rotSpeedX;
      shard.rotation.y += shard.userData.rotSpeedY;
      shard.rotation.z += shard.userData.rotSpeedZ;
      
      // Reset if it goes too high
      if (shard.position.y > 60) {
        shard.position.y = -60;
      }
    });

    // Animate Lights
    blueLight1.position.x = Math.sin(time * 0.5) * 30;
    blueLight1.position.z = Math.cos(time * 0.5) * 30;
    
    renderer.render(scene, camera);
  }

  animate();

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Intersection Observer for scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.content-section, .team-card').forEach(section => {
    observer.observe(section);
  });
});

function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('active');
}
