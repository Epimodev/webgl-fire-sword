import * as THREE from "three"
import { LoadedAssets } from "./utils/assetsLoader"

export const assets = {
  sword: {
    type: "gltf" as const,
    url: "/objects/sword/sword.gltf",
  },
  environment: {
    type: "cube-texture" as const,
    pxUrl: "/environment/px.png",
    nxUrl: "/environment/nx.png",
    pyUrl: "/environment/py.png",
    nyUrl: "/environment/ny.png",
    pzUrl: "/environment/pz.png",
    nzUrl: "/environment/nz.png",
  },
  swordTrail: {
    type: "texture" as const,
    url: "/textures/sword/sword-trail.png",
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping,
  },
  swordTrailMask: {
    type: "texture" as const,
    url: "/textures/sword/sword-trail-mask.png",
  },
  swordTrailNoise: {
    type: "texture" as const,
    url: "/textures/sword/sword-trail-noise.png",
  },
}

export type SceneAssets = LoadedAssets<typeof assets>
