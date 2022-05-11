import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import './style.css'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
const controls = new OrbitControls(camera, renderer.domElement);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({color: 0xFF6347 });
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// Light sources
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 20);
scene.add(pointLight);

//const ambientLight = new THREE.AmbientLight(0xffffff);
//scene.add(ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper);

const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(gridHelper);


// Generated stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Background
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

// Image of me
const meTexture = new THREE.TextureLoader().load('PG.jpg');
const me = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: meTexture }));
scene.add(me);

// Moon
const moonTexture = new THREE.TextureLoader().load('Cube.jpg');
//const normalTexture = new THREE.TextureLoader().load('normal.jpg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    //normalMap: normalTexture,
  })
);
moon.position.z = 15;
moon.position.setX(-10);
scene.add(moon);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.02;
  moon.rotation.y += 0.01;
  moon.rotation.z += 0.03;

  me.rotation.y += 0.01;
  me.rotation.z += 0.01;

  camera.position.z = 5 - t * 0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();


function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.001;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();
