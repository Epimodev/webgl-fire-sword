type Loader = {
  setPercentage: (value: number) => void
  hide: () => void
  displayError: () => void
}

export const getLoader = (): Loader => {
  const overlay = document.getElementById("loader-overlay") as HTMLDivElement
  const percentage = overlay.querySelector(
    ".loading-percentage",
  ) as HTMLSpanElement
  const progressBar = overlay.querySelector(
    ".progress-bar-loaded",
  ) as HTMLDivElement

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

  return {
    setPercentage: (value: number) => {
      const percentageLoaded = Math.round(value * 100)
      percentage.innerHTML = percentageLoaded.toString()
      progressBar.style.transform = `scaleX(${value})`
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
      const title = overlay.querySelector(".overlay-title") as HTMLDivElement
      title.innerHTML =
        "Failed to load assets, please retry by reloading the page."
    },
  }
}
