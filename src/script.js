import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import gsap from 'gsap'

import Model from './model'

/*------------------------------
Renderer
------------------------------*/
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

/*------------------------------
Scene & Camera
------------------------------*/
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  100
)
camera.position.z = 5
camera.position.y = 1

/*------------------------------
Mesh
------------------------------*/
const geometry = new THREE.BoxGeometry(2, 2, 2)
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
})
const cube = new THREE.Mesh(geometry, material)
// scene.add(cube)

/*------------------------------
OrbitControls
------------------------------*/
const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableDamping = true

/*------------------------------
Helpers
------------------------------*/
const gridHelper = new THREE.GridHelper(10, 10)
const axesHelper = new THREE.AxesHelper(5)

let helpersShowing = false

/*------------------------------
Models
------------------------------*/
const skull = new Model({
  name: 'skull',
  file: './models/skull.glb',
  colors: ['red', 'yellow'],
  background: '#47001b',
  placeOnLoad: true,
  scene,
})

const horse = new Model({
  name: 'horse',
  file: './models/horse.glb',
  colors: ['blue', 'pink'],
  background: '#110047',
  scene,
})

/*------------------------------
Controllers
------------------------------*/
const buttons = document.querySelectorAll('.button')
buttons[0].addEventListener('click', () => {
  skull.add()
  horse.remove()
})
buttons[1].addEventListener('click', () => {
  horse.add()
  skull.remove()
})
buttons[2].addEventListener('click', () => {
  if (helpersShowing) {
    scene.remove(axesHelper)
    scene.remove(gridHelper)
  } else {
    scene.add(axesHelper)
    scene.add(gridHelper)
  }

  helpersShowing = !helpersShowing
})

/*------------------------------
Clock
------------------------------*/
const clock = new THREE.Clock()

/*------------------------------
Loop
------------------------------*/
const animate = function () {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)

  if (skull.isActive) {
    skull.particlesMaterial.uniforms.uTime.value = clock.getElapsedTime()
  }

  if (horse.isActive) {
    horse.particlesMaterial.uniforms.uTime.value = clock.getElapsedTime()
  }
}
animate()

/*------------------------------
Resize
------------------------------*/
const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
window.addEventListener('resize', onWindowResize, false)

/*------------------------------
Mouse move
------------------------------*/
const onMouseMove = ({ clientX, clientY }) => {
  const x = clientX
  const y = clientY

  gsap.to(scene.rotation, {
    y: -gsap.utils.mapRange(0, window.innerWidth, 0.2, -0.2, x),
    x: -gsap.utils.mapRange(0, window.innerHeight, 0.2, -0.2, y),
  })
}
window.addEventListener('mousemove', onMouseMove)
