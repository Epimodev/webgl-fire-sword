import * as Tweakpane from "tweakpane"
import type { FireUniforms } from "./fire"

const addColorInput = (
  pane: Tweakpane.Pane | Tweakpane.TabPageApi,
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

export const createTweakpane = (
  sword: THREE.Group,
  fireUniforms: FireUniforms,
): void => {
  const pane = new Tweakpane.Pane()

  const tabs = pane.addTab({
    pages: [{ title: "Sword" }, { title: "Fire" }],
  })
  const swordTab = tabs.pages[0]
  const fireTab = tabs.pages[1]

  /* ========================== */
  /* ========== SWORD ========= */
  /* ========================== */
  const handle = sword.children[0]
  swordTab.addInput(handle.position, "z", {
    label: "z position",
    min: -2,
    max: 2,
    step: 0.01,
  })
  swordTab.addInput(handle.position, "y", {
    label: "y position",
    min: -1,
    max: 1,
    step: 0.01,
  })
  swordTab.addInput(handle.position, "x", {
    label: "x position",
    min: -1,
    max: 1,
    step: 0.01,
  })
  swordTab.addInput(sword.rotation, "z", {
    label: "z rotation",
    min: -Math.PI,
    max: Math.PI,
    step: 0.01,
  })
  swordTab.addInput(sword.rotation, "y", {
    label: "y rotation",
    min: -Math.PI,
    max: Math.PI,
    step: 0.01,
  })
  swordTab.addInput(handle.rotation, "x", {
    label: "x rotation",
    min: -2 * Math.PI,
    max: 2 * Math.PI,
    step: 0.01,
  })

  /* ========================== */
  /* ========== FIRE ========== */
  /* ========================== */
  fireTab.addInput(fireUniforms.u_rotationVelocity.value, "x", {
    label: "Handle velocity",
    min: 0,
    max: 20,
    step: 0.01,
  })
  fireTab.addInput(fireUniforms.u_rotationVelocity.value, "z", {
    label: "Sword z velocity",
    min: -10,
    max: 10,
    step: 0.01,
  })
  fireTab.addInput(fireUniforms.u_patternScale, "value", {
    label: "Pattern scale",
    min: 0.5,
    max: 3,
    step: 0.01,
  })
  fireTab.addInput(fireUniforms.u_patternSpeed, "value", {
    label: "Pattern speed",
    min: 0,
    max: 60,
    step: 0.01,
  })
  fireTab.addInput(fireUniforms.u_patternDeform, "value", {
    label: "Pattern deform",
    min: 0,
    max: 0.25,
    step: 0.001,
  })
  fireTab.addInput(fireUniforms.u_bendScale, "value", {
    label: "Bend scale",
    min: 0,
    max: 1,
    step: 0.01,
  })
  fireTab.addInput(fireUniforms.u_bendOrigin.value, "y", {
    label: "Bend origin",
    min: -1,
    max: 1,
    step: 0.01,
  })
  fireTab.addInput(fireUniforms.u_bendOrigin.value, "x", {
    label: "Horizontal bend origin",
    min: -1,
    max: 1,
    step: 0.01,
  })
  addColorInput(fireTab, "Color 1", fireUniforms.u_color1.value)
  addColorInput(fireTab, "Color 2", fireUniforms.u_color2.value)
  addColorInput(fireTab, "Color 3", fireUniforms.u_color3.value)
  addColorInput(fireTab, "Color 4", fireUniforms.u_color4.value)
}
