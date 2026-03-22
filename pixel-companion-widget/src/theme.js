export function applySkyTheme() {
  const hour = new Date().getHours()
  let gradient

  if (hour >= 5 && hour < 7) {
    gradient = 'linear-gradient(to bottom, #f4a460, #ffcba4)'
  } else if (hour >= 7 && hour < 12) {
    gradient = 'linear-gradient(to bottom, #87ceeb, #e0f0ff)'
  } else if (hour >= 12 && hour < 17) {
    gradient = 'linear-gradient(to bottom, #4a90d9, #87ceeb)'
  } else if (hour >= 17 && hour < 20) {
    gradient = 'linear-gradient(to bottom, #ff7043, #ab47bc)'
  } else {
    gradient = 'linear-gradient(to bottom, #0a0a2e, #1a1a4e)'
  }

  document.body.style.background = gradient
}