import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { assertNever } from "./types"

type GltfAsset = {
  type: "gltf"
  url: string
}

type TextureAsset = {
  type: "texture"
  url: string
  wrapS?: THREE.Wrapping
  wrapT?: THREE.Wrapping
}

type CubeTextureAsset = {
  type: "cube-texture"
  pxUrl: string
  nxUrl: string
  pyUrl: string
  nyUrl: string
  pzUrl: string
  nzUrl: string
}

type AssetsInput<T extends string = string> = Record<
  T,
  GltfAsset | TextureAsset | CubeTextureAsset
>

export type LoadedAssets<Assets extends AssetsInput> = {
  [N in keyof Assets]: Assets[N] extends GltfAsset
    ? THREE.Group
    : Assets[N] extends TextureAsset
    ? THREE.Texture
    : THREE.CubeTexture
}

export const loadAssets = <Assets extends AssetsInput>(
  assets: Assets,
  onProgress: (progress: number) => void,
  onSuccess: (assets: LoadedAssets<Assets>) => void,
  onError: () => void,
): void => {
  let failed = false

  // @ts-expect-error keys are filled in a loop after loader creation
  const result: LoadedAssets<Assets> = {}

  const handleLoad = () => {
    onSuccess(result)
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

  for (const key in assets) {
    const asset = assets[key]
    switch (asset.type) {
      case "gltf": {
        gltfLoader.load(asset.url, gltf => {
          // @ts-expect-error
          result[key] = gltf.scenes[0]
        })
        break
      }
      case "cube-texture": {
        // @ts-expect-error
        result[key] = cubeTextureLoader.load([
          asset.pxUrl,
          asset.nxUrl,
          asset.pyUrl,
          asset.nyUrl,
          asset.pzUrl,
          asset.nzUrl,
        ])
        break
      }
      case "texture": {
        const texture = textureLoader.load(asset.url)
        if (asset.wrapS) {
          texture.wrapS = asset.wrapS
        }
        if (asset.wrapT) {
          texture.wrapT = asset.wrapT
        }
        // @ts-expect-error
        result[key] = texture
        break
      }
      default:
        assertNever(asset)
    }
  }
}
