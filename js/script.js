import * as THREE from 'https://cdn.skypack.dev/three@0.136.0'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js'
import { Vector3 } from 'https://cdn.skypack.dev/three@0.136.0'

//Loading
const textureLoader = new THREE.TextureLoader()
const saturnTexture = textureLoader.load('textures/Saturn.jpg')
const ringTexture = textureLoader.load('textures/satRing.jpg')
const shadowTexture = textureLoader.load('textures/shadow.png')

// Canvas
const canvas = document.querySelector('canvas.webgl')
var divChara = document.getElementsByClassName('character');

var CANVAS_WIDTH = 850,
    CANVAS_HEIGHT = 500;

// Scene
const scene = new THREE.Scene()


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, CANVAS_WIDTH / CANVAS_HEIGHT, 0.1, 400)
camera.position.x = 0
camera.position.y = -.1
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha : true
})
renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Objects
const saturn = new THREE.SphereBufferGeometry(1,32,16);
const asteroids = new THREE.RingBufferGeometry(1.1,1.8,128,32);
const planeShadow = new THREE.PlaneGeometry(3,3)

// Materials

const materialSaturn = new THREE.MeshStandardMaterial()
materialSaturn.roughness = .8
materialSaturn.map = saturnTexture
materialSaturn.color = new THREE.Color(0xffaa00)

const materialRing = new THREE.MeshStandardMaterial()
materialRing.side = 2
materialRing.map = ringTexture
materialRing.alphaMap = ringTexture
materialRing.alpha = 0.1
materialRing.color = new THREE.Color(0xffffff)

const materialShadow = new THREE.MeshStandardMaterial()
materialShadow.map = shadowTexture
materialShadow.roughness = 0
materialShadow.color = new THREE.Color(0xff0000)

// Mesh
const sphere = new THREE.Mesh(saturn,materialSaturn)
sphere.castShadow = true
sphere.receiveShadow = true
scene.add(sphere)

const ring = new THREE.Mesh(asteroids, materialRing)
ring.rotation.x=-1.4;
ring.rotation.y=0.5;
ring.castShadow = true
ring.receiveShadow = true
scene.add(ring)

const shadow = new THREE.Mesh(planeShadow, materialShadow)
shadow.position.y=-1.8
shadow.rotation.x = -1.5
scene.add(shadow)


// Lights

const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.x = 2
pointLight.position.y = 3.5
pointLight.position.z = 4
scene.add(pointLight)

const pointLight2 = new THREE.PointLight(0x5500ff, .8)
pointLight2.position.x = -5
pointLight2.position.y = -3.5
pointLight2.position.z = -4
scene.add(pointLight2)

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime

    ring.rotation.z = 1* elapsedTime

    // Update Orbital Controls
controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()