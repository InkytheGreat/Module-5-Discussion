import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { visitChildren } from '/modelUtil';


// Ran using vite
// Installed with npm install
// Ran using npx vite


// Create an empty scene
var scene = new THREE.Scene();
scene.backgroundColor = 0x000000;
scene.fog = new THREE.Fog(0x444444, 0.0025, 100);

// Create a basic perspective camera with initial position and rotation
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(-2.73, 0.00, -3.65);
camera.rotation.set(0, -1.31, 0);

// Create a floor
const geo = new THREE.PlaneGeometry(10000, 10000)
  const mat = new THREE.MeshLambertMaterial({
    color: 0xffffff
  })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.position.set(0, -3, 0)
  mesh.rotation.set(Math.PI / -2, 0, 0)
  mesh.receiveShadow = true
  mesh.name = 'forever-floor'
  scene.add(mesh)


// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

// Update renderer settings for proper tone mapping
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

// Configure renderer size
renderer.setSize( window.innerWidth, window.innerHeight );

// Append Renderer to DOM
document.body.appendChild( renderer.domElement );


// Create left wall of hallway
var geometryScaled = new THREE.BoxGeometry( 10, 100, 0.5);
var materialScaled = new THREE.MeshLambertMaterial( { color: "#ADD8E6" } );
var leftWall = new THREE.Mesh( geometryScaled, materialScaled );
leftWall.rotateZ((Math.PI / 180) * 90);
leftWall.position.x = 2;
leftWall.position.y = 0;
leftWall.position.z = -8;
scene.add( leftWall );

// Create top wall of hallway
var geometryScaled = new THREE.BoxGeometry( 100, 10, 0.5);
var materialScaled = new THREE.MeshLambertMaterial( { color: "#ADD8E6" } );
var topWall = new THREE.Mesh( geometryScaled, materialScaled );
topWall.rotateX((Math.PI / 180) * 90);
topWall.position.x = 2;
topWall.position.y = 4;
topWall.position.z = -5;
scene.add( topWall );

// Create right wall of hallway
var geometryScaled = new THREE.BoxGeometry( 10, 100, 0.5);
var materialScaled = new THREE.MeshLambertMaterial( { color: "#ADD8E6" } );
var rightWall = new THREE.Mesh( geometryScaled, materialScaled );
rightWall.rotateZ((Math.PI / 180) * 90);
rightWall.position.x = 2;
rightWall.position.y = 0;
rightWall.position.z = -2;
scene.add( rightWall );

// Create far wall of hallway
var geometryScaled = new THREE.BoxGeometry( 10, 100, 0.5);
var materialScaled = new THREE.MeshLambertMaterial( { color: "#ADD8E6" } );
var farWall = new THREE.Mesh( geometryScaled, materialScaled );
farWall.rotateZ((Math.PI / 180) * 90);
farWall.rotateX((Math.PI / 180) * 90);
farWall.position.x = 30;
farWall.position.y = 0;
farWall.position.z = -2;
scene.add( farWall );

// Load the keyhole.png as a sprite
const textureLoader = new THREE.TextureLoader();
textureLoader.load('./keyhole.png', (texture) => {
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(spriteMaterial);

  // Position the sprite on the inside of the far wall
  sprite.position.set(29, 0, -5);
  sprite.scale.set(2.5, 1.25, 1);
  scene.add(sprite);
});

// Create the keyblade beam
var geometryScaled = new THREE.CylinderGeometry( 0.05, 0.05, 100);
var materialScaled = new THREE.MeshLambertMaterial( { color: "#ADD8E6" , emissive: "#89CFF0", emissiveIntensity: 3} );
var keybladeBeam = new THREE.Mesh( geometryScaled, materialScaled );
keybladeBeam.rotateZ((Math.PI / 180) * 90);
keybladeBeam.position.x = 51;
keybladeBeam.position.y = 0;
keybladeBeam.position.z = -5;
scene.add( keybladeBeam );


// Simulate light emitting from the entire length of the cylinder
const lightCount = 20;
const beamLength = 100;
const lightsAndSpheres = []; // Store lights and spheres for animation
for (let i = 0; i < lightCount; i++) {
  const light = new THREE.PointLight(0x89CFF0, 1, 10); // Light color, intensity, and distance
  const sphereGeometry = new THREE.SphereGeometry(0.1, 16, 16);
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x89CFF0 });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  const positionX = keybladeBeam.position.x - beamLength / 2 + (i * (beamLength / lightCount)); // Spread lights evenly along the cylinder
  light.position.set(positionX, keybladeBeam.position.y, keybladeBeam.position.z);
  sphere.position.copy(light.position);

  scene.add(light);
  scene.add(sphere);

  lightsAndSpheres.push({ light, sphere, offset: i * (beamLength / lightCount) });
}

// Animate lights and spheres
let accumulatedTime = 0;
let previousTime = 0;
function animateLightsAndSpheres(deltaTime) {
  const speed = 20; // Speed of movement in units per second
  accumulatedTime += deltaTime * speed;
  lightsAndSpheres.forEach(({ light, sphere, offset }) => {
    const newPositionX = (keybladeBeam.position.x + 0.3) - beamLength / 2 + ((offset + accumulatedTime) % beamLength);
    light.position.x = newPositionX;
    sphere.position.x = newPositionX;
  });
}

// Load the Keyblade model
const loader = new GLTFLoader();
loader.load(
  './Models/Keyblade/scene.gltf', // Path to the Keyblade model
  (gltf) => {
    const keyblade = gltf.scene;
    keyblade.position.set(0, 0, -5);
    keyblade.scale.set(0.5, 0.5, 0.5);
    keyblade.rotation.set(0, (Math.PI / 180) * -8.7, (Math.PI / 180) * -20);
    scene.add(keyblade);

    // Add illuminated sphere at the tip of the Keyblade
    const lightSphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const lightSphereMaterial = new THREE.MeshBasicMaterial({ color: 0x89CFF0 });
    const lightSphere = new THREE.Mesh(lightSphereGeometry, lightSphereMaterial);
    lightSphere.position.set(1.4, 0, -5);
    scene.add(lightSphere);

    // Add a light to the illuminated sphere
    const pointLight = new THREE.PointLight(0x9ADFF1, 5, 5);
    pointLight.position.copy(lightSphere.position);
    scene.add(pointLight);

    // Add a light to the handle of the Keyblade
    const handleLight = new THREE.PointLight(0xD4AF37, 5, 5); // Bright yellow light
    handleLight.position.set(-1.4, 0, -5);
    scene.add(handleLight);

  },
  (xhr) => {
    console.log(`Keyblade model ${(xhr.loaded / xhr.total) * 100}% loaded`);
  },
  (error) => {
    console.error('An error occurred while loading the Keyblade model:', error);
  }
);

// Render Loop
var render = function (currentTime) {
  requestAnimationFrame(render);

  // Calculate delta time
  const deltaTime = (currentTime - previousTime) / 1000; // Convert to seconds
  previousTime = currentTime;


  // Animate lights and spheres
  animateLightsAndSpheres(deltaTime);

  // Render the scene
  renderer.render(scene, camera);
};

render(0);

// Handle window resize
window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});