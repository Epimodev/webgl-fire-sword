import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

export type SceneAssets = {
  sword: THREE.Group
  swordTrail: THREE.Texture
  swordTrailMask: THREE.Texture
  swordTrailNoise: THREE.Texture
  environment: THREE.CubeTexture
}

export const loadAssets = (
  onProgress: (progress: number) => void,
  onSuccess: (assets: SceneAssets) => void,
  onError: () => void,
): void => {
  let failed = false

  // use let for textures for consistency
  let sword: THREE.Group
  let environment: THREE.CubeTexture // eslint-disable-line prefer-const
  let swordTrail: THREE.Texture // eslint-disable-line prefer-const
  let swordTrailMask: THREE.Texture // eslint-disable-line prefer-const
  let swordTrailNoise: THREE.Texture // eslint-disable-line prefer-const

  const handleLoad = () => {
    if (!failed) {
      // We are sure assets are loaded and assigned here thanks to loading manager
      onSuccess({
        sword,
        environment,
        swordTrail,
        swordTrailMask,
        swordTrailNoise,
      })
    }
  }
  const handleProgress = (_url: string, loaded: number, total: number) => {
    if (!failed) {
      onProgress(loaded / total)
    }
  }
  const handleError = () => {
    failed = true
    onError()
  }
  const manager = new THREE.LoadingManager(
    handleLoad,
    handleProgress,
    handleError,
  )
  const gltfLoader = new GLTFLoader(manager)
  const cubeTextureLoader = new THREE.CubeTextureLoader(manager)
  const textureLoader = new THREE.TextureLoader(manager)

  gltfLoader.load("/objects/sword/sword.gltf", gltf => {
    sword = gltf.scenes[0]
  })
  environment = cubeTextureLoader.load([
    "/environment/px.png",
    "/environment/nx.png",
    "/environment/py.png",
    "/environment/ny.png",
    "/environment/pz.png",
    "/environment/nz.png",
  ])
  swordTrail = textureLoader.load("/textures/sword/sword-trail.png")
  swordTrailMask = textureLoader.load("/textures/sword/sword-trail-mask.png")
  swordTrailNoise = textureLoader.load("/textures/sword/sword-trail-noise.png")

  swordTrail.wrapS = THREE.RepeatWrapping
  swordTrail.wrapT = THREE.RepeatWrapping
}
