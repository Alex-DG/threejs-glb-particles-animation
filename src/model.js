import * as THREE from 'three'

import gsap from 'gsap'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'

// Shaders
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

class Model {
  constructor(object) {
    const { name, file, scene, placeOnLoad, colors } = object
    this.name = name
    this.file = file
    this.scene = scene
    this.placeOnLoad = placeOnLoad

    this.isActive = false

    this.color1 = colors[0]
    this.color2 = colors[1]

    this.loader = new GLTFLoader() // Instantiate a loader
    this.dracoLoader = new DRACOLoader() // DRACOLoader instance to decode compressed mesh data

    this.dracoLoader.setDecoderPath('./draco/')
    this.loader.setDRACOLoader(this.dracoLoader)

    this.init()
  }

  init() {
    this.loader.load(this.file, (response) => {
      /**
       * Mesh
       */
      this.mesh = response.scene.children[0]

      /**
       * Material
       */
      this.material = new THREE.MeshBasicMaterial({
        color: 'red',
        wireframe: true,
      })
      this.mesh.material = this.material

      /**
       * Geometry
       */
      this.geometry = this.mesh.geometry

      /**
       * Particles material
       */
      //   this.particlesMaterial = new THREE.PointsMaterial({
      //     color: 'red',
      //     size: 0.02,
      //   })
      this.particlesMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uColor1: { value: new THREE.Color(this.color1) },
          uColor2: { value: new THREE.Color(this.color2) },
          uTime: { value: 0 },
          uScale: { value: 0 },
        },
      })

      /**
       * Particles geometry
       */
      // Create a sampler for a Mesh surface.
      const sampler = new MeshSurfaceSampler(this.mesh)
        .setWeightAttribute('color')
        .build()

      const numberParticles = 20000

      this.particlesGeometry = new THREE.BufferGeometry()

      const particlesPosition = new Float32Array(numberParticles * 3) // x,y,z
      const particlesRandomness = new Float32Array(numberParticles * 3)

      for (let i = 0; i < numberParticles; i++) {
        const newPosition = new THREE.Vector3()
        sampler.sample(newPosition)

        particlesPosition.set(
          [newPosition.x, newPosition.y, newPosition.z],
          i * 3
        )

        particlesRandomness.set(
          [
            Math.random() * 2 - 1, // -1 to 1
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
          ],
          i * 3
        )
      }

      this.particlesGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(particlesPosition, 3)
      )
      this.particlesGeometry.setAttribute(
        'aRandom',
        new THREE.BufferAttribute(particlesRandomness, 3)
      )

      console.log(this.particlesGeometry)

      /**
       * Particles
       */
      this.particles = new THREE.Points(
        this.particlesGeometry,
        this.particlesMaterial
      )

      if (this.placeOnLoad) this.add()
    })
  }

  add() {
    this.scene.add(this.particles)
    this.isActive = true

    gsap.to(this.particlesMaterial.uniforms.uScale, {
      value: 1,
      duration: 0.8,
      delay: 0.3,
      ease: 'power3.out',
    })
  }

  remove() {
    gsap.to(this.particlesMaterial.uniforms.uScale, {
      value: 0,
      duration: 0.8,
      ease: 'power3.out',
      onComplete: () => {
        this.scene.remove(this.particles)
        this.isActive = false
      },
    })
  }
}

export default Model
