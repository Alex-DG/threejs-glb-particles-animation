import * as THREE from 'three'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

class Model {
  constructor(object) {
    const { name, file, scene, placeOnLoad } = object
    this.name = name
    this.file = file
    this.scene = scene
    this.placeOnLoad = placeOnLoad

    this.loader = new GLTFLoader() // Instantiate a loader
    this.dracoLoader = new DRACOLoader() // DRACOLoader instance to decode compressed mesh data

    this.dracoLoader.setDecoderPath('./draco/')
    this.loader.setDRACOLoader(this.dracoLoader)

    this.init()
  }

  init() {
    this.loader.load(this.file, (response) => {
      console.log({ response })

      this.mesh = response.scene.children[0]
      this.material = new THREE.MeshBasicMaterial({
        color: 'orange',
        wireframe: true,
      })
      this.mesh.material = this.material

      if (this.placeOnLoad) this.add()
    })
  }

  add() {
    this.scene.add(this.mesh)
  }

  remove() {
    this.scene.remove(this.mesh)
  }
}

export default Model
