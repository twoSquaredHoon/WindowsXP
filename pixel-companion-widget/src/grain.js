let grainCanvas = null
let grainInterval = null
let grainOn = false

function generateGrain() {
  const ctx = grainCanvas.getContext('2d')
  const imageData = ctx.createImageData(grainCanvas.width, grainCanvas.height)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const val = Math.random() * 255
    imageData.data[i] = val
    imageData.data[i + 1] = val
    imageData.data[i + 2] = val
    imageData.data[i + 3] = 255
  }
  ctx.putImageData(imageData, 0, 0)
}

function startGrain() {
  grainCanvas.style.display = 'block'
  grainInterval = setInterval(generateGrain, 50)
  grainOn = true
}

function stopGrain() {
  grainCanvas.style.display = 'none'
  clearInterval(grainInterval)
  grainOn = false
}

export function applyGrain() {
  grainCanvas = document.createElement('canvas')
  grainCanvas.width = Math.floor(window.innerWidth / 2)
  grainCanvas.height = Math.floor(window.innerHeight / 2)
  grainCanvas.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    opacity: 0.08;
    z-index: 1;
    display: none;
  `
  document.body.appendChild(grainCanvas)

  const btn = document.createElement('button')
  btn.textContent = 'grain: off'
  btn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 999;
    padding: 6px 12px;
    background: rgba(0,0,0,0.4);
    color: white;
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
  `
  btn.addEventListener('click', () => {
    if (grainOn) {
      stopGrain()
      btn.textContent = 'grain: off'
    } else {
      startGrain()
      btn.textContent = 'grain: on'
    }
  })
  document.body.appendChild(btn)
}