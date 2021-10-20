import type { EasingFunction } from "../animation/easing"
import { lerp } from "./math"

export const drawCurve = (easing: EasingFunction): void => {
  const width = 500
  const height = 500
  const padding = 50

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svg.setAttribute("width", width.toString())
  svg.setAttribute("height", height.toString())
  svg.style.position = "absolute"
  svg.style.zIndex = "100000"
  svg.style.backgroundColor = "white"

  const nbPoints = 100
  const points: string[] = []
  for (let i = 0; i < nbPoints; i += 1) {
    const x = i / (nbPoints - 1)
    const y = easing(x)

    const canvasX = lerp(padding, width - padding, x)
    const canvasY = lerp(height - padding, padding, y)
    const action = i === 0 ? "M" : "L"
    points.push(`${action}${canvasX} ${canvasY}`)
  }

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
  path.style.fill = "none"
  path.style.stroke = "black"
  const d = points.join(" ")
  path.setAttribute("d", d)
  svg.appendChild(path)

  document.body.appendChild(svg)
}
