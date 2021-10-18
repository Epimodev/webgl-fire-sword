import * as THREE from "three"
import type { SceneAssets } from "../utils/assets"
import { fireFragment, fireVertex } from "./shaders.glslx"

export type FireUniforms = {
  u_bendScale: THREE.IUniform<number>
  u_bendOrigin: THREE.IUniform<THREE.Vector2>
  u_verticalBend: THREE.IUniform<number>
  u_horizontalBend: THREE.IUniform<number>
  u_trailPattern: THREE.IUniform<THREE.Texture>
  u_trailMask: THREE.IUniform<THREE.Texture>
  u_trailNoise: THREE.IUniform<THREE.Texture>
  u_patternScale: THREE.IUniform<number>
  u_patternOffset: THREE.IUniform<number>
  u_patternDeform: THREE.IUniform<number>
  u_maskOffset: THREE.IUniform<number>
  u_color1: THREE.IUniform<THREE.Color>
  u_color2: THREE.IUniform<THREE.Color>
  u_color3: THREE.IUniform<THREE.Color>
  u_color4: THREE.IUniform<THREE.Color>
}

export const createFire = ({
  swordTrail,
  swordTrailMask,
  swordTrailNoise,
}: SceneAssets): THREE.Mesh<THREE.PlaneGeometry, THREE.RawShaderMaterial> => {
  const fireSize = 0.75
  const fireDivisions = 10
  const fireUniforms: FireUniforms = {
    u_bendScale: { value: 0.5 },
    u_bendOrigin: { value: new THREE.Vector2(-fireSize / 2, 0) },
    u_verticalBend: { value: 0 },
    u_horizontalBend: { value: 0 },
    u_trailPattern: { value: swordTrail },
    u_trailMask: { value: swordTrailMask },
    u_trailNoise: { value: swordTrailNoise },
    u_patternScale: { value: 2 },
    u_patternOffset: { value: 0 },
    u_patternDeform: { value: 0.133 },
    u_maskOffset: { value: 0 },
    u_color1: { value: new THREE.Color(0xe74c3c) },
    u_color2: { value: new THREE.Color(0xe67e22) },
    u_color3: { value: new THREE.Color(0xf1c40f) },
    u_color4: { value: new THREE.Color(0xffffff) },
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
