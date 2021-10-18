import * as Tweakpane from "tweakpane"
import type { FireUniforms } from "./index"

export const createFirePane = (uniforms: FireUniforms): void => {
  const pane = new Tweakpane.Pane()

  pane.addInput(uniforms.u_patternScale, "value", {
    label: "Pattern scale",
    min: 0.5,
    max: 3,
    step: 0.01,
  })
  pane.addInput(uniforms.u_patternOffset, "value", {
    label: "Pattern offset",
    min: 0,
    max: 100,
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
}
