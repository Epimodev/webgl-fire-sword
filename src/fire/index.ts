import * as THREE from "three"
import type { SceneAssets } from "../assets"
import type { Vector3 } from "../utils/math"
import { fireFragment, fireVertex } from "./shaders.glslx"

export type VectorMovement = {
  position: Vector3
  velocity: Vector3
}

export type SwordVelocity = {
  swordRotation: VectorMovement
  handleRotation: VectorMovement
}

export type FireUniforms = {
  u_time: THREE.IUniform<number>
  u_rotationVelocity: THREE.IUniform<THREE.Vector3>
  u_bendScale: THREE.IUniform<number>
  u_bendOrigin: THREE.IUniform<THREE.Vector2>
  u_trailPattern: THREE.IUniform<THREE.Texture>
  u_trailMask: THREE.IUniform<THREE.Texture>
  u_trailNoise: THREE.IUniform<THREE.Texture>
  u_patternScale: THREE.IUniform<number>
  u_patternSpeed: THREE.IUniform<number>
  u_patternDeform: THREE.IUniform<number>
  u_color1: THREE.IUniform<THREE.Color>
  u_color2: THREE.IUniform<THREE.Color>
  u_color3: THREE.IUniform<THREE.Color>
  u_color4: THREE.IUniform<THREE.Color>
}

export const createFire = (
  { swordTrail, swordTrailMask, swordTrailNoise }: SceneAssets,
  time: THREE.IUniform<number>,
): THREE.Mesh<THREE.PlaneGeometry, THREE.RawShaderMaterial> => {
  const fireWidth = 0.76
  const fireHeight = 0.8
  const fireDivisions = 100
  const fireUniforms: FireUniforms = {
    u_time: time,
    u_rotationVelocity: { value: new THREE.Vector3() },
    u_bendScale: { value: 0.5 },
    u_bendOrigin: { value: new THREE.Vector2(-fireWidth / 2, 0) },
    u_trailPattern: { value: swordTrail },
    u_trailMask: { value: swordTrailMask },
    u_trailNoise: { value: swordTrailNoise },
    u_patternScale: { value: 2 },
    u_patternSpeed: { value: 30 },
    u_patternDeform: { value: 0.133 },
    u_color1: { value: new THREE.Color(0xff3e00) },
    u_color2: { value: new THREE.Color(0xff7500) },
    u_color3: { value: new THREE.Color(0xffd600) },
    u_color4: { value: new THREE.Color(0xfff5a8) },
  }

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(fireWidth, fireHeight, fireDivisions),
    new THREE.RawShaderMaterial({
      vertexShader: fireVertex,
      fragmentShader: fireFragment,
      transparent: true,
      side: THREE.DoubleSide,
      uniforms: fireUniforms,
      depthTest: false,
    }),
  )

  return plane
}

const getVelocity =
  (target: Vector3, previous: Vector3, current: Vector3) =>
  (deltaTime: number): void => {
    target.x = (current.x - previous.x) / deltaTime
    target.y = (current.y - previous.y) / deltaTime
    target.z = (current.z - previous.z) / deltaTime
  }

/**
 * @param position input
 * @param velocity updated by the function over time
 */
const vectorVelocity = ({ position, velocity }: VectorMovement) => {
  const clock = new THREE.Clock()
  clock.start()
  let lastTime = clock.getElapsedTime()

  const previousPosition = { x: position.x, y: position.y, z: position.z }
  const updateVelocity = getVelocity(velocity, previousPosition, position)

  const tick = () => {
    const time = clock.getElapsedTime()
    const deltaTime = time - lastTime
    lastTime = time

    updateVelocity(deltaTime)
    previousPosition.x = position.x
    previousPosition.y = position.y
    previousPosition.z = position.z

    window.requestAnimationFrame(tick)
  }

  window.requestAnimationFrame(tick)
}

export const swordMovement = (
  sword: THREE.Group,
  onFrame: (movement: SwordVelocity) => void,
): void => {
  const handle = sword.children[0]
  const swordRotation = sword.rotation
  const handleRotation = handle.rotation

  const bladeMovement: SwordVelocity = {
    swordRotation: {
      position: swordRotation,
      velocity: { x: 0, y: 0, z: 0 },
    },
    handleRotation: {
      position: handleRotation,
      velocity: { x: 0, y: 0, z: 0 },
    },
  }

  vectorVelocity(bladeMovement.swordRotation)
  vectorVelocity(bladeMovement.handleRotation)

  const tick = () => {
    onFrame(bladeMovement)

    window.requestAnimationFrame(tick)
  }

  window.requestAnimationFrame(tick)
}
