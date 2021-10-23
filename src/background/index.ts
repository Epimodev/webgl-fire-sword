import * as THREE from "three"
import { backgroundFragment, backgroundVertex } from "./shaders.glslx"

export const createBackground = (
  time: THREE.IUniform<number>,
): THREE.Mesh<THREE.PlaneGeometry, THREE.RawShaderMaterial> => {
  return new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.RawShaderMaterial({
      vertexShader: backgroundVertex,
      fragmentShader: backgroundFragment,
      uniforms: {
        u_time: time,
      },
    }),
  )
}
