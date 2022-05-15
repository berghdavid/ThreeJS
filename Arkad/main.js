import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import './style.css'

const loader = new GLTFLoader();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
});
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 6, -30)

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Light sources
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 10, 30);
scene.add(pointLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper);

const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);


// Background
const spaceTexture = new THREE.TextureLoader().load('assets/images/space.jpg');
scene.background = spaceTexture;

// Arkad board
const plaque = new THREE.Mesh(
  new THREE.PlaneGeometry(32, 32),
  new THREE.MeshStandardMaterial({
    transparent: true,
    opacity: 0.8,
    color: 0xFFFFFF
  })
);
plaque.position.set(0, 13, -34)
scene.add(plaque)

// Arkad logo
loader.load(
  'assets/models/arkad.gltf',
  function (gltf) {
    gltf.scene.scale.set(32, 32, 32)
    gltf.scene.rotateX(Math.PI / 2)
    gltf.scene.position.x = -11.5
    gltf.scene.position.y = 23
    gltf.scene.position.z = -30

    // Change material from darker to lighter
    var newMaterial = new THREE.MeshStandardMaterial({color: 0x1C3C86});
    gltf.scene.traverse((o) => {
      o.material = newMaterial;
    });

    scene.add(gltf.scene)
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
  },
  (error) => {
    console.log(error)
  }
)

// Earth
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(40, 32, 32),
  new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load('assets/images/earth.jpg')
  })
);
earth.position.set(0, 13, -80)
scene.add(earth);

// Camera scrolling
const flyZ = 32;
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  camera.position.set(0, 1, 5 - t * 0.02)

  if(camera.position.z > flyZ) {
    let diff = camera.position.z - flyZ
    let modifier = diff*0.08 + Math.min(diff, 8)*diff*0.08;
    camera.position.x -= modifier;
    camera.position.y += modifier;
  }
}

document.body.onscroll = moveCamera;
moveCamera();

function animate() {
  requestAnimationFrame(animate);

  earth.rotation.y -= 0.0014;

  controls.update();
  renderer.render(scene, camera);
}

animate();
