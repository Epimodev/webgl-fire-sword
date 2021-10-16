import Stats from "stats.js"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"

const MAX_PIXEL_RATIO = 2

const main = () => {
  const scene = new THREE.Scene()

  // Setup camera
  const fov = 50 // degres
  const aspect = window.innerWidth / window.innerHeight
  const near = 0.1
  const far = 100
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.z = 0
  camera.position.x = 2
  camera.position.y = 0
  camera.lookAt(new THREE.Vector3(0, 0, 0))

  const loader = getLoaderControls()

  loadAssets(
    progress => {
      loader.setPercentage(progress)
    },
    ({ sword, environment }) => {
      scene.environment = environment

      scene.add(sword)

      // Add tweakpane only during development
      if (process.env.NODE_ENV === "development") {
        // import tweakpane here
      }

      scene.traverse(child => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.material.envMapIntensity = 1
          child.material.needsUpdate = true
        }
      })

      const clock = new THREE.Clock()
      clock.start()

      createPlayground({
        scene,
        camera,
        onTick: () => {
          const elapsedTime = clock.getElapsedTime()
        },
      })

      loader.hide()
    },
    () => {
      loader.displayError()
    },
  )
}

const getLoaderControls = () => {
  const overlay = document.getElementById("loader-overlay") as HTMLDivElement
  const percentage = overlay.querySelector(
    ".loading-percentage",
  ) as HTMLSpanElement
  const progressBar = overlay.querySelector(
    ".progress-bar-loaded",
  ) as HTMLDivElement

  // Remove loading end animation during development
  if (process.env.NODE_ENV === "development") {
    overlay.classList.add("overlay-hidden")
    return {
      setPercentage: (_value: number) => {
        return
      },
      hide: () => {
        return
      },
      displayError: () => {
        return
      },
    }
  }

  return {
    setPercentage: (value: number) => {
      const percentageLoaded = value * 100
      percentage.innerHTML = percentageLoaded.toString()
      progressBar.style.transform = `scaleX(${value})`
    },
    hide: () => {
      overlay.classList.add("overlay-fadeout")

      const overlayStyle = getComputedStyle(overlay)
      const transitionDuration =
        parseFloat(overlayStyle.transitionDuration) * 1000
      const transitionDelay = parseFloat(overlayStyle.transitionDelay) * 1000
      const hideTimeout = transitionDuration + transitionDelay

      setTimeout(() => {
        overlay.classList.add("overlay-hidden")
      }, hideTimeout)
    },
    displayError: () => {
      const title = overlay.querySelector(".overlay-title") as HTMLDivElement
      title.innerHTML =
        "Failed to load assets, please retry by reloading the page."
    },
  }
}

type SceneAssets = {
  sword: THREE.Group
  environment: THREE.CubeTexture
}

const loadAssets = (
  onProgress: (progress: number) => void,
  onSuccess: (assets: SceneAssets) => void,
  onError: () => void,
) => {
  let failed = false

  // use let for textures for consistency
  let sword: THREE.Group
  let environment: THREE.CubeTexture // eslint-disable-line prefer-const

  const handleLoad = () => {
    if (!failed) {
      // We are sure assets are loaded and assigned here thanks to loading manager
      onSuccess({
        sword,
        environment,
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
}

// Playground implementation
type PlaygroundParams = {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  onTick?: () => void
  onResize?: (size: Size) => void
}

const createPlayground = ({
  scene,
  camera,
  onTick,
  onResize,
}: PlaygroundParams) => {
  // Canvas
  const canvas = document.getElementById("webgl") as HTMLCanvasElement
  if (!canvas) {
    throw new Error('canvas element with "webgl" id is missing in "index.html"')
  }

  // Stats
  const stats = new Stats()
  stats.showPanel(0)
  document.body.appendChild(stats.dom)

  // Create size object, which is initialized later by `updateSize()`
  const size = { width: 0, height: 0 }

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  })
  renderer.setClearColor(0x000000)
  renderer.physicallyCorrectLights = true
  renderer.toneMapping = THREE.ReinhardToneMapping
  renderer.toneMappingExposure = 3

  const effectComposer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  const bloomRadius = 0
  const bloomThreshold = 0.65
  const bloomStrength = 0.8
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    bloomStrength,
    bloomRadius,
    bloomThreshold,
  )
  effectComposer.addPass(renderPass)
  // effectComposer.addPass(bloomPass)

  // Controls
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.dampingFactor = 0.1
  controls.rotateSpeed = 2
  controls.enablePan = false
  controls.enableZoom = false

  const updateSize = () => {
    // Update size
    size.width = window.innerWidth
    size.height = window.innerHeight

    // Set pixel ratio to 2 maximum
    const pixelRatio = Math.min(devicePixelRatio, MAX_PIXEL_RATIO)

    // Update camera
    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix()
    // Update renderer and effect composer size and pixel ratio
    renderer.setSize(size.width, size.height)
    renderer.setPixelRatio(pixelRatio)
    effectComposer.setSize(size.width, size.height)
    effectComposer.setPixelRatio(pixelRatio)
    bloomPass.setSize(size.width, size.height)

    // Create a new instance because `size` object is changed on resize
    onResize?.({ width: size.width, height: size.height })
  }

  // Init size
  updateSize()
  // Listen window to resize the canvas
  window.addEventListener("resize", updateSize)

  const tick = () => {
    stats.begin()
    onTick?.()

    // Update controls for damping
    controls.update()

    // Render
    effectComposer.render()

    stats.end()
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
  }
  tick()
}

// Start program
main()
