import * as THREE from "three"
import { Vector3 } from "three"
import type { SceneAssets } from "../assets"
import { fireFragment, fireVertex } from "./shaders.glslx"

export type BladeVelocity = {
  position: THREE.Vector3
  direction: THREE.Vector3
}

export type FireUniforms = {
  u_time: THREE.IUniform<number>
  u_bendScale: THREE.IUniform<number>
  u_bendOrigin: THREE.IUniform<THREE.Vector2>
  u_verticalBend: THREE.IUniform<number>
  u_horizontalBend: THREE.IUniform<number>
  u_trailPattern: THREE.IUniform<THREE.Texture>
  u_trailMask: THREE.IUniform<THREE.Texture>
  u_trailNoise: THREE.IUniform<THREE.Texture>
  u_patternScale: THREE.IUniform<number>
  u_patternSpeed: THREE.IUniform<number>
  u_patternDeform: THREE.IUniform<number>
  u_maskOffset: THREE.IUniform<number>
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
    u_bendScale: { value: 0.5 },
    u_bendOrigin: { value: new THREE.Vector2(-fireWidth / 2, 0) },
    u_verticalBend: { value: 0 },
    u_horizontalBend: { value: 0 },
    u_trailPattern: { value: swordTrail },
    u_trailMask: { value: swordTrailMask },
    u_trailNoise: { value: swordTrailNoise },
    u_patternScale: { value: 2 },
    u_patternSpeed: { value: 30 },
    u_patternDeform: { value: 0.133 },
    u_maskOffset: { value: 0 },
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
    }),
  )

  return plane
}

const getVectorVelocity = (
  target: Vector3,
  previous: Vector3,
  current: Vector3,
  deltaTime: number,
): void => {
  target.x = (current.x - previous.x) / deltaTime
  target.y = (current.y - previous.y) / deltaTime
  target.z = (current.z - previous.z) / deltaTime
}

export const bladeVelocity = (
  point: THREE.Group,
  onFrame: (velocity: BladeVelocity) => void,
): void => {
  const clock = new THREE.Clock()
  clock.start()

  let lastTime = clock.getElapsedTime()
  const lastPosition = point.getWorldPosition(new Vector3())
  const position = lastPosition.clone()
  const lastDirection = point.getWorldDirection(new Vector3())
  const direction = lastDirection.clone()

  const velocity = {
    position: new Vector3(),
    direction: new Vector3(),
  }

  const updateSpeed = () => {
    const time = clock.getElapsedTime()
    const deltaTime = time - lastTime
    lastTime = time

    // update position
    point.getWorldPosition(position)
    // update position speed
    getVectorVelocity(velocity.position, lastPosition, position, deltaTime)
    // update last position for next compute
    lastPosition.copy(position)

    // update direction
    point.getWorldDirection(direction)
    // update direction speed
    getVectorVelocity(velocity.direction, lastDirection, direction, deltaTime)
    // update last direction for next compute
    lastDirection.copy(direction)

    onFrame(velocity)
    window.requestAnimationFrame(updateSpeed)
  }

  window.requestAnimationFrame(updateSpeed)
}
