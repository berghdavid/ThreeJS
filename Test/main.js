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

// Donut
const geometry = new THREE.TorusGeometry(10, 1, 16, 100);
const material = new THREE.MeshStandardMaterial({color: 0xFF6347 });
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// Light sources
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 10, 30);
scene.add(pointLight);

//const ambientLight = new THREE.AmbientLight(0xffffff);
//scene.add(ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
//scene.add(lightHelper);

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

// Moon 2
const moonTexture2 = new THREE.TextureLoader().load('zuku.jpg');
moonTexture2.rotation = 0.6;
moonTexture2.offset.y = 0.25; // 0.0 - 1.0
moonTexture2.offset.x = -0.18; // 0.0 - 1.0
const moon2 = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture2,
    //normalMap: normalTexture,
  })
);
moon2.position.z = 18;
moon2.position.x = 10;
moon2.rotation.y = -1.8;
scene.add(moon2);

// Obama
const obamaTexture = new THREE.TextureLoader().load('obama.jpg');
obamaTexture.offset.y = 0.1;
obamaTexture.offset.x = 0.35;
const oba = new THREE.Mesh(
  new THREE.SphereGeometry(8, 32, 32),
  new THREE.MeshStandardMaterial({
    map: obamaTexture,
    //normalMap: normalTexture,
  })
);
oba.position.z = -15;
oba.position.x = 0;
scene.add(oba);

// Zuku 2
const zukuTexture = new THREE.TextureLoader().load('zuku3.jpg');
zukuTexture.offset.y = 0;
zukuTexture.offset.x = 0.26;
const zuku3 = new THREE.Mesh(
  new THREE.SphereGeometry(8, 32, 32),
  new THREE.MeshStandardMaterial({
    map: zukuTexture,
  })
);
zuku3.position.z = -15;
zuku3.position.x = 0;
scene.add(zuku3);


// Camera scrolling
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.02;
  moon.rotation.y += 0.005;
  moon.rotation.z += 0.03;

  me.rotation.y += 0.01;
  me.rotation.z += 0.01;

  camera.position.z = 5 - t * 0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
  if(camera.position.z > 24) {
    let diff = camera.position.z - 24
    let modifier = diff*0.01 + Math.min(diff, 10)*diff*0.1;
    camera.position.x -= modifier;
    camera.position.y += modifier;
  }
}

document.body.onscroll = moveCamera;
moveCamera();

let startRot = moon2.rotation.y;
let max = 0.5;
let adder = 0.01;
let rotationI = 0;
let rotationCenter = [oba.position.x, oba.position.y]
function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.001;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon2.rotation.y += adder;
  if(Math.abs(startRot - moon2.rotation.y) > max) {
    adder = -adder;
  }

  rotationI += 0.008;

  oba.position.x = rotationCenter[0] + 20*Math.cos(rotationI);
  oba.position.y = rotationCenter[1] + 20*Math.sin(rotationI);
  oba.lookAt(camera.position.x, camera.position.y, camera.position.z)
  zuku3.position.x = rotationCenter[0] - 20*Math.cos(rotationI);
  zuku3.position.y = rotationCenter[1] - 20*Math.sin(rotationI);
  zuku3.lookAt(camera.position.x, camera.position.y, camera.position.z)


  controls.update();

  renderer.render(scene, camera);
}

animate();
