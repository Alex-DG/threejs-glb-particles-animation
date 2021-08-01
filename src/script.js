import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

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
  placeOnLoad: true,
  scene,
})

const horse = new Model({
  name: 'horse',
  file: './models/horse.glb',
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
Loop
------------------------------*/
const animate = function () {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
animate()

/*------------------------------
Resize
------------------------------*/
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
window.addEventListener('resize', onWindowResize, false)
