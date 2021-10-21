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
