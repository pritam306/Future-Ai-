const container = document.getElementById("canvas-container");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

/* =========================
   MAIN WIREFRAME SPHERE
========================= */
const geometry = new THREE.SphereGeometry(2, 16, 8);

const material = new THREE.MeshBasicMaterial({
  color: 0x00eaff, // cyan
  wireframe: true
});

const sphere = new THREE.Mesh(geometry, material);
sphere.position.y = -1;
scene.add(sphere);

/* =========================
   PURPLE OUTER RING
========================= */
const ringGeometry = new THREE.TorusGeometry(2.5, 0.01, 16, 200);

const ringMaterial = new THREE.MeshBasicMaterial({
  color: 0xff00ff, // purple
});

const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.rotation.x = Math.PI / 2;
ring.position.y = -1;
scene.add(ring);

/* =========================
   MULTIPLE LATITUDE RINGS
========================= */
for (let i = -2; i <= 2; i++) {
  const latGeo = new THREE.TorusGeometry(2 * Math.cos(i * 0.4), 0.005, 16, 100);
  const latMat = new THREE.MeshBasicMaterial({ color: 0x00eaff });

  const latRing = new THREE.Mesh(latGeo, latMat);
  latRing.rotation.x = Math.PI / 2;
  latRing.position.y = -1 + i * 0.4;

  scene.add(latRing);
}

/* =========================
   GLOW SPHERE
========================= */
const glowMaterial = new THREE.MeshBasicMaterial({
  color: 0x00eaff,
  transparent: true,
  opacity: 0.08
});

const glow = new THREE.Mesh(
  new THREE.SphereGeometry(2.3, 32, 32),
  glowMaterial
);

glow.position.y = -1;
scene.add(glow);

/* =========================
   PARTICLE POINTS (STARS ON GRID)
========================= */
const pointsGeometry = new THREE.BufferGeometry();
const pointsCount = 300;

const positions = [];

for (let i = 0; i < pointsCount; i++) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos((Math.random() * 2) - 1);

  const r = 2;

  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.sin(phi) * Math.sin(theta) - 1;
  const z = r * Math.cos(phi);

  positions.push(x, y, z);
}

pointsGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(positions, 3)
);

const pointsMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.03
});

const points = new THREE.Points(pointsGeometry, pointsMaterial);
scene.add(points);

/* =========================
   CAMERA
========================= */
camera.position.z = 6;

/* =========================
   ANIMATION
========================= */
function animate() {
  requestAnimationFrame(animate);

  sphere.rotation.y += 0.004;
  ring.rotation.z += 0.002;
  glow.rotation.y += 0.002;

  renderer.render(scene, camera);
}

animate();

/* =========================
   RESPONSIVE
========================= */
window.addEventListener("resize", () => {
  renderer.setSize(container.clientWidth, container.clientHeight);
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
});

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  const progress = (scrollTop / height) * 100;

  document.getElementById("scroll-progress").style.width = progress + "%";
});

const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});


/* COUNT UP  */
const counters = document.querySelectorAll(".count");

function animateCount(el) {
  const target = +el.getAttribute("data-target");
  let count = 0;

  const duration = 2000; // ⏱️ total time (2 seconds)
  const stepTime = 1;   // ~60fps
  const totalSteps = duration / stepTime;
  const increment = target / totalSteps;

  function update() {
    count += increment;

    if (count < target) {
      el.innerText = Math.floor(count).toLocaleString();
      requestAnimationFrame(update);
    } else {
      el.innerText = target.toLocaleString() + "+";
    }
  }

  update();
}

/* SCROLL TRIGGER */
const statsBox = document.querySelector(".stats-box");

const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    statsBox.classList.add("show");

    counters.forEach(counter => {
      animateCount(counter);
    });

    observer.disconnect();
  }
}, { threshold: 0.3 });

observer.observe(statsBox);

document.getElementById("seoOutput").style.opacity = "0";
document.getElementById("seoOutput").style.transform = "translateY(20px)";

setTimeout(() => {
  document.getElementById("seoOutput").style.transition = "0.5s";
  document.getElementById("seoOutput").style.opacity = "1";
  document.getElementById("seoOutput").style.transform = "translateY(0)";
}, 100);



