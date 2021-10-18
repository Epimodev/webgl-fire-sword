import Stats from "stats.js"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { assets } from "./assets"
import { bladeVelocity, createFire, FireUniforms } from "./fire"
import { loadAssets } from "./utils/assetsLoader"
import { getLoader } from "./utils/loader"

const MAX_PIXEL_RATIO = 2

const main = () => {
  const loader = getLoader()

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

  loadAssets(
    assets,
    progress => {
      loader.setPercentage(progress)
    },
    sceneAssets => {
      const { sword, environment } = sceneAssets
      scene.environment = environment

      scene.add(sword)
      scene.traverse(child => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.material.envMapIntensity = 1
          child.material.needsUpdate = true
        }
      })

      const time: THREE.IUniform<number> = { value: 0 }

      // create empty group to compute speed from blade center
      const bladeCenter = new THREE.Group()
      bladeCenter.position.y = 0.35

      const fire = createFire(sceneAssets, time)
      fire.rotation.y = Math.PI / 2
      fire.position.y = 0.41
      fire.position.z = -0.397
      sword.add(fire)
      sword.add(bladeCenter)
      // @ts-expect-error
      const fireUniform: FireUniforms = fire.material.uniforms

      bladeVelocity(bladeCenter, velocity => {
        fireUniform.u_verticalBend.value = -velocity.position.y * 0.1
        // console.log(velocity.position)
      })

      const clock = new THREE.Clock()
      clock.start()

      // const axes = new THREE.AxesHelper()
      // scene.add(axes)

      // Add tweakpane only during development
      if (process.env.NODE_ENV === "development") {
        import("./tweakpane").then(({ createTweakpane }) => {
          createTweakpane(sword, fire.material.uniforms as FireUniforms)
        })
      }

      createPlayground({
        scene,
        camera,
        onTick: () => {
          const elapsedTime = clock.getElapsedTime()
          time.value = elapsedTime
        },
      })

      loader.hide()
    },
    () => {
      loader.displayError()
    },
  )
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
  renderer.setClearColor(0x333333)
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
