import * as Tweakpane from "tweakpane"
import type { FireUniforms } from "./index"

const addColorInput = (
  pane: Tweakpane.Pane,
  label: string,
  color: THREE.Color,
) => {
  const object = {
    color: `#${color.getHexString()}`,
  }
  pane
    .addInput(object, "color", { label })
    .on("change", ({ value }) => color.set(value))
}

export const createFirePane = (uniforms: FireUniforms): void => {
  const pane = new Tweakpane.Pane()

  pane.addInput(uniforms.u_patternScale, "value", {
    label: "Pattern scale",
    min: 0.5,
    max: 3,
    step: 0.01,
  })
  pane.addInput(uniforms.u_patternSpeed, "value", {
    label: "Pattern speed",
    min: 0,
    max: 60,
    step: 0.01,
  })
  pane.addInput(uniforms.u_patternDeform, "value", {
    label: "Pattern deform",
    min: 0,
    max: 0.25,
    step: 0.001,
  })
  pane.addInput(uniforms.u_maskOffset, "value", {
    label: "Mask offset",
    min: 0,
    max: 1,
    step: 0.01,
  })
  pane.addInput(uniforms.u_bendScale, "value", {
    label: "Bend scale",
    min: 0,
    max: 1,
    step: 0.01,
  })
  pane.addInput(uniforms.u_bendOrigin.value, "y", {
    label: "Bend origin",
    min: -1,
    max: 1,
    step: 0.01,
  })
  pane.addInput(uniforms.u_verticalBend, "value", {
    label: "Vertical bend",
    min: -Math.PI,
    max: Math.PI,
    step: 0.01,
  })
  pane.addInput(uniforms.u_bendOrigin.value, "x", {
    label: "Horizontal bend origin",
    min: -1,
    max: 1,
    step: 0.01,
  })
  pane.addInput(uniforms.u_horizontalBend, "value", {
    label: "Horizontal bend",
    min: -Math.PI,
    max: Math.PI,
    step: 0.01,
  })
  addColorInput(pane, "Color 1", uniforms.u_color1.value)
  addColorInput(pane, "Color 2", uniforms.u_color2.value)
  addColorInput(pane, "Color 3", uniforms.u_color3.value)
  addColorInput(pane, "Color 4", uniforms.u_color4.value)
}
