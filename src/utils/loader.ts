type Loader = {
  setPercentage: (value: number) => void
  hide: () => void
  displayError: () => void
}

export const getLoader = (): Loader => {
  const overlay = document.getElementById("loader-overlay") as HTMLDivElement
  const percentage = overlay.querySelector(
    ".loader-percentage",
  ) as HTMLSpanElement
  const loaderCircle = overlay.querySelector(
    ".loader-circle",
  ) as SVGCircleElement

  // Remove loading end animation during development
  if (process.env.NODE_ENV === "development") {
    overlay.classList.add("overlay-hidden")
    return {
      setPercentage: () => {
        return
      },
      hide: () => {
        return
      },
      displayError: () => {
        return
      },
    }
  }

  const circleRadius = 95
  const circlePerimeter = Math.round(circleRadius * 2 * Math.PI)

  return {
    setPercentage: (value: number) => {
      const percentageLoaded = Math.round(value * 100)
      percentage.innerHTML = `${percentageLoaded}%`
      const offset = (1 - value) * circlePerimeter
      loaderCircle.style.strokeDashoffset = `${offset}px`
    },
    hide: () => {
      overlay.classList.add("overlay-fadeout")

      const overlayStyle = getComputedStyle(overlay)
      const transitionDuration =
        parseFloat(overlayStyle.transitionDuration) * 1000
      const transitionDelay = parseFloat(overlayStyle.transitionDelay) * 1000
      const hideTimeout = transitionDuration + transitionDelay

      setTimeout(() => {
        overlay.classList.add("overlay-hidden")
      }, hideTimeout)
    },
    displayError: () => {
      const text = overlay.querySelector(".loader-text") as HTMLDivElement
      text.innerHTML =
        "Failed to load assets, please retry by reloading the page."
    },
  }
}
