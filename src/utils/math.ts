// create custom Vector3 type to be able to use same functions to compute position and rotation velocity
export type Vector3 = {
  x: number
  y: number
  z: number
}

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

export const remap = (
  inputMin: number,
  inputMax: number,
  outputMin: number,
  outputMax: number,
  value: number,
): number => {
  const t = invLerp(inputMin, inputMax, value)
  return lerp(outputMin, outputMax, t)
}

export const clamp = (min: number, max: number, value: number): number => {
  return Math.min(max, Math.max(min, value))
}

export const degToRad = (value: number) => remap(0, 180, 0, Math.PI, value)
