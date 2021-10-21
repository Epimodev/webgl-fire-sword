import * as Easings from "./animation/easing"
import type { TimelineDefinition } from "./animation/timeline"
import { degToRad } from "./utils/math"

export const swordVariables = {
  rotation: {
    x: degToRad(15),
    z: 0,
  },
}

export const swordAnimation1Def: TimelineDefinition<typeof swordVariables> = {
  rotation: {
    x: [
      {
        duration: 2000,
        value: degToRad(1815),
        easing: Easings.easeOutSine,
      },
    ],
    z: [
      {
        duration: 283,
        value: degToRad(40),
        easing: Easings.easeOutQuad,
      },
      {
        duration: 283,
        value: degToRad(-60),
        easing: Easings.easeInOutQuad,
      },
      {
        duration: 283,
        value: degToRad(50),
        easing: Easings.easeInOutQuad,
      },
      {
        duration: 283,
        value: degToRad(-40),
        easing: Easings.easeInOutQuad,
      },
      {
        duration: 283,
        value: degToRad(40),
        easing: Easings.easeInOutQuad,
      },
      {
        duration: 283,
        value: 0,
        easing: Easings.easeInOutQuad,
      },
    ],
  },
}
export const swordAnimation2Def: TimelineDefinition<typeof swordVariables> = {
  rotation: {
    x: [
      {
        duration: 2000,
        value: degToRad(1815),
        easing: Easings.easeOutSine,
      },
    ],
    z: [
      {
        duration: 333,
        value: degToRad(-80),
        easing: Easings.easeOutQuad,
      },
      {
        duration: 333,
        value: degToRad(-70),
        easing: Easings.easeInOutQuad,
      },
      {
        duration: 333,
        value: degToRad(-100),
        easing: Easings.easeInOutQuad,
      },
      {
        duration: 1000,
        value: 0,
        easing: Easings.easeInOutQuad,
      },
    ],
  },
}
export const swordAnimation3Def: TimelineDefinition<typeof swordVariables> = {
  rotation: {
    x: [
      {
        duration: 333,
        value: degToRad(-70),
        easing: Easings.easeOutCubic,
      },
      {
        duration: 1667,
        value: degToRad(1815),
        easing: Easings.easeInOutSine,
      },
    ],
    z: [
      {
        duration: 167,
        value: 0,
        easing: Easings.linear,
      },
      {
        duration: 383,
        value: degToRad(150),
        easing: Easings.easeOutQuad,
      },
      {
        duration: 350,
        value: degToRad(85),
        easing: Easings.easeInOutQuad,
      },
      {
        duration: 233,
        value: degToRad(30),
        easing: Easings.easeInOutQuad,
      },
      {
        duration: 250,
        value: degToRad(-60),
        easing: Easings.easeInOutQuad,
      },
      {
        duration: 617,
        value: 0,
        easing: Easings.easeInOutQuad,
      },
    ],
  },
}

export const fireVariables = {
  color1: {
    // #ff3e00
    r: 1,
    g: 0.24313725490196078,
    b: 0,
  },
  color2: {
    // #ff7500
    r: 1,
    g: 0.4588235294117647,
    b: 0,
  },
  color3: {
    // #ffd600
    r: 1,
    g: 0.8392156862745098,
    b: 0,
  },
  color4: {
    // #fff5a8
    r: 1,
    g: 0.9607843137254902,
    b: 0.6588235294117647,
  },
}

export const fireAnimationDef: TimelineDefinition<typeof fireVariables> = {
  color1: {
    // #1800ff
    r: [{ duration: 500, easing: Easings.linear, value: 0.09411764705882353 }],
    g: [{ duration: 500, easing: Easings.linear, value: 0 }],
    b: [{ duration: 500, easing: Easings.linear, value: 1 }],
  },
  color2: {
    // #0059ff
    r: [{ duration: 500, easing: Easings.linear, value: 0 }],
    g: [{ duration: 500, easing: Easings.linear, value: 0.34901960784313724 }],
    b: [{ duration: 500, easing: Easings.linear, value: 1 }],
  },
  color3: {
    // #00acff
    r: [{ duration: 500, easing: Easings.linear, value: 0 }],
    g: [{ duration: 500, easing: Easings.linear, value: 0.6745098039215687 }],
    b: [{ duration: 500, easing: Easings.linear, value: 1 }],
  },
  color4: {
    // #a8e9ff
    r: [{ duration: 500, easing: Easings.linear, value: 0.6588235294117647 }],
    g: [{ duration: 500, easing: Easings.linear, value: 0.9137254901960784 }],
    b: [{ duration: 500, easing: Easings.linear, value: 1 }],
  },
}
