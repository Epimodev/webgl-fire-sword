import type { Vector3 } from "three"

export const lerp = (min: number, max: number, value: number): number => {
  return (max - min) * value + min
}

export const lerpVec3 =
  (target: Vector3) =>
  (min: Vector3, max: Vector3, value: number): void => {
    target.x = lerp(min.x, max.x, value)
    target.y = lerp(min.y, max.y, value)
    target.z = lerp(min.z, max.z, value)
  }

export const invLerp = (min: number, max: number, value: number): number => {
  return (value - min) / (max - min)
}

export const clamp = (min: number, max: number, value: number): number => {
  return Math.min(max, Math.max(min, value))
}
