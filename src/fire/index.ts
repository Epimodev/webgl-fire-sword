import * as THREE from "three"
import type { SceneAssets } from "../utils/assets"
import { fireFragment, fireVertex } from "./shaders.glslx"

export type FireUniforms = {
  bendScale: THREE.IUniform<number>
  bendOrigin: THREE.IUniform<THREE.Vector2>
  verticalBend: THREE.IUniform<number>
  horizontalBend: THREE.IUniform<number>
  trailPattern: THREE.IUniform<THREE.Texture>
  trailMask: THREE.IUniform<THREE.Texture>
  trailNoise: THREE.IUniform<THREE.Texture>
  patternScale: THREE.IUniform<number>
  patternOffset: THREE.IUniform<number>
  patternDeform: THREE.IUniform<number>
  maskOffset: THREE.IUniform<number>
  color1: THREE.IUniform<THREE.Color>
  color2: THREE.IUniform<THREE.Color>
  color3: THREE.IUniform<THREE.Color>
  color4: THREE.IUniform<THREE.Color>
}

export const createFire = ({
  swordTrail,
  swordTrailMask,
  swordTrailNoise,
}: SceneAssets): THREE.Mesh<THREE.PlaneGeometry, THREE.RawShaderMaterial> => {
  const fireSize = 0.75
  const fireDivisions = 10
  const fireUniforms: FireUniforms = {
    bendScale: { value: 0.5 },
    bendOrigin: { value: new THREE.Vector2(-fireSize / 2, 0) },
    verticalBend: { value: 0 },
    horizontalBend: { value: 0 },
    trailPattern: { value: swordTrail },
    trailMask: { value: swordTrailMask },
    trailNoise: { value: swordTrailNoise },
    patternScale: { value: 2 },
    patternOffset: { value: 0 },
    patternDeform: { value: 0.133 },
    maskOffset: { value: 0 },
    color1: { value: new THREE.Color(0xe74c3c) },
    color2: { value: new THREE.Color(0xe67e22) },
    color3: { value: new THREE.Color(0xf1c40f) },
    color4: { value: new THREE.Color(0xffffff) },
  }
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(fireSize, fireSize, fireDivisions),
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
