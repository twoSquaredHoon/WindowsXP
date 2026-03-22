function getSkyColor(hour) {
  const keyframes = [
    { h: 0,  top: [10, 10, 46],    bot: [26, 26, 78] },
    { h: 5,  top: [244, 164, 96],  bot: [255, 203, 164] },
    { h: 7,  top: [135, 206, 235], bot: [224, 240, 255] },
    { h: 12, top: [74, 144, 217],  bot: [135, 206, 235] },
    { h: 17, top: [255, 112, 67],  bot: [171, 71, 188] },
    { h: 20, top: [10, 10, 46],    bot: [26, 26, 78] },
    { h: 24, top: [10, 10, 46],    bot: [26, 26, 78] },
  ]

  let from = keyframes[0]
  let to = keyframes[1]

  for (let i = 0; i < keyframes.length - 1; i++) {
    if (hour >= keyframes[i].h && hour < keyframes[i + 1].h) {
      from = keyframes[i]
      to = keyframes[i + 1]
      break
    }
  }

  const t = (hour - from.h) / (to.h - from.h)
  const lerp = (a, b) => Math.round(a + (b - a) * t)
  const mix = (a, b) => `rgb(${lerp(a[0], b[0])}, ${lerp(a[1], b[1])}, ${lerp(a[2], b[2])})`
  return `linear-gradient(to bottom, ${mix(from.top, to.top)}, ${mix(from.bot, to.bot)})`
}

let skyDiv = null
let animating = false
let currentHour = 0

export function applySkyTheme(targetHour = new Date().getHours()) {
  if (!skyDiv) {
    skyDiv = document.createElement('div')
    skyDiv.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 0;
    `
    document.body.appendChild(skyDiv)
  }

  animateToHour(currentHour, targetHour)
}

function animateToHour(fromHour, targetHour) {
  if (animating) {
    currentHour = fromHour
  }
  animating = true

  const duration = 500
  const start = performance.now()

  function tick(now) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const h = fromHour + (targetHour - fromHour) * progress
    skyDiv.style.background = getSkyColor(h)

    if (progress < 1) {
      requestAnimationFrame(tick)
    } else {
      currentHour = targetHour
      animating = false
    }
  }

  requestAnimationFrame(tick)
}