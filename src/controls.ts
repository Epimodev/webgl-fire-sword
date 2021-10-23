type ButtonEventType =
  | "toggle-color"
  | "animation-1"
  | "animation-2"
  | "animation-3"

type ControlEvent = {
  type: ButtonEventType
}

const COLOR_CHANGE_DURATION = 500
const ANIMATION_DURATION = 3000

const createButton = (label: string): HTMLButtonElement => {
  const button = document.createElement("button")
  button.className = "animation-button"
  button.innerHTML = label

  // Be carreful, changing this will impact buttons listener which get this HTML element
  // lile this: `const progress = button.children[0] as HTMLSpanElement`
  const progress = document.createElement("span")
  progress.className = "animation-button-progress"

  button.appendChild(progress)
  return button
}

const disableButtons = (...buttons: HTMLButtonElement[]) => {
  for (const button of buttons) {
    button.disabled = true
  }
}

const enableButtons = (...buttons: HTMLButtonElement[]) => {
  for (const button of buttons) {
    button.disabled = false
  }
}

export const createControls = (
  onEvent: (event: ControlEvent) => void,
): void => {
  const controls = document.createElement("div")
  controls.className = "controls"
  const toggleColorButton = createButton("Change fire color")
  const animation1Button = createButton("Animation 1")
  const animation2Button = createButton("Animation 2")
  const animation3Button = createButton("Animation 3")

  toggleColorButton.addEventListener("click", () => {
    disableButtons(toggleColorButton)

    const progress = toggleColorButton.children[0] as HTMLSpanElement
    progress.style.transitionDuration = `${COLOR_CHANGE_DURATION}ms`
    progress.classList.add("animation-button-progress_processing")

    onEvent({ type: "toggle-color" })

    setTimeout(() => {
      progress.style.transitionDuration = "0ms"
      progress.classList.remove("animation-button-progress_processing")
      enableButtons(toggleColorButton)
    }, COLOR_CHANGE_DURATION)
  })

  const animationClickListener =
    (button: HTMLButtonElement, type: ButtonEventType) => () => {
      disableButtons(animation1Button, animation2Button, animation3Button)

      const progress = button.children[0] as HTMLSpanElement
      progress.style.transitionDuration = `${ANIMATION_DURATION}ms`
      progress.classList.add("animation-button-progress_processing")

      onEvent({ type })

      setTimeout(() => {
        progress.style.transitionDuration = "0ms"
        progress.classList.remove("animation-button-progress_processing")

        enableButtons(animation1Button, animation2Button, animation3Button)
      }, ANIMATION_DURATION)
    }
  animation1Button.addEventListener(
    "click",
    animationClickListener(animation1Button, "animation-1"),
  )
  animation2Button.addEventListener(
    "click",
    animationClickListener(animation2Button, "animation-2"),
  )
  animation3Button.addEventListener(
    "click",
    animationClickListener(animation3Button, "animation-3"),
  )

  controls.appendChild(toggleColorButton)
  controls.appendChild(animation1Button)
  controls.appendChild(animation2Button)
  controls.appendChild(animation3Button)
  document.body.appendChild(controls)
}
