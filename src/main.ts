import Stats from "stats.js"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { createTimeline, Timeline } from "./animation/timeline"
import { assets } from "./assets"
import { createFire, FireUniforms, swordMovement } from "./fire"
import {
  fireAnimationDef,
  fireVariables,
  swordAnimation1Def,
  swordAnimation2Def,
  swordAnimation3Def,
  swordVariables,
} from "./timelines"
import { loadAssets } from "./utils/assetsLoader"
import { getLoader } from "./utils/loader"
import { lerpVec3 } from "./utils/math"

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

      const fire = createFire(sceneAssets, time)
      fire.rotation.y = Math.PI / 2
      fire.position.y = 0.41
      fire.position.z = -0.401
      const handle = sword.children[0]
      const blade = handle.children[0]
      blade.add(fire)

      const handleSwordFrame = ({ rotation }: typeof swordVariables) => {
        handle.rotation.x = rotation.x
        sword.rotation.z = rotation.z
      }
      const handleSwordAnimCompleted = ({ seek }: Timeline<any>) => {
        // reset timeline with a delay to avoid breaking fire animation
        // because reset without delay implies a negative speed by `swordMovement` which controls fire trail
        // and we have to reset before next animation play to avoid starting the animation with a negative speed
        setTimeout(() => {
          seek(0)
        }, 1000)
      }

      let fireColor: "red" | "blue" = "red"
      const fireAnimation = createTimeline(
        fireVariables,
        fireAnimationDef,
        ({ color1, color2, color3, color4 }) => {
          fireUniform.u_color1.value.setRGB(color1.r, color1.g, color1.b)
          fireUniform.u_color2.value.setRGB(color2.r, color2.g, color2.b)
          fireUniform.u_color3.value.setRGB(color3.r, color3.g, color3.b)
          fireUniform.u_color4.value.setRGB(color4.r, color4.g, color4.b)
        },
        () => {
          // toggle color
          fireColor === "red" ? (fireColor = "blue") : (fireColor = "red")
        },
      )
      const toogleColor = () => {
        fireColor === "red" ? fireAnimation.play() : fireAnimation.reverse()
      }

      const animation1 = createTimeline(
        swordVariables,
        swordAnimation1Def,
        handleSwordFrame,
        handleSwordAnimCompleted,
      )
      const animation2 = createTimeline(
        swordVariables,
        swordAnimation2Def,
        handleSwordFrame,
        handleSwordAnimCompleted,
      )
      const animation3 = createTimeline(
        swordVariables,
        swordAnimation3Def,
        handleSwordFrame,
        handleSwordAnimCompleted,
      )

      // @ts-expect-error
      const fireUniform: FireUniforms = fire.material.uniforms

      const swordVelocity = { x: 0, y: 0, z: 0 }
      const interpolateSwordVelocity = lerpVec3(swordVelocity)
      const handleVelocity = { x: 0, y: 0, z: 0 }
      const interpolateHandleVelocity = lerpVec3(handleVelocity)

      swordMovement(sword, ({ swordRotation, handleRotation }) => {
        interpolateSwordVelocity(swordVelocity, swordRotation.velocity, 0.1)
        interpolateHandleVelocity(handleVelocity, handleRotation.velocity, 0.1)

        // use handle rotation for trail length and vertical bend
        // use sword rotation for horizontal bend
        fireUniform.u_rotationVelocity.value.set(
          handleVelocity.x,
          swordVelocity.y,
          swordVelocity.z,
        )
      })

      const clock = new THREE.Clock()
      clock.start()

      // const axes = new THREE.AxesHelper()
      // scene.add(axes)

      // Add tweakpane only during development
      if (process.env.NODE_ENV === "development") {
        import("./tweakpane").then(({ createTweakpane }) => {
          createTweakpane(
            sword,
            fire.material.uniforms as FireUniforms,
            animation1,
            toogleColor,
          )
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
