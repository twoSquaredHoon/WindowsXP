export function startJumpAnimation(canvas, img) {
  const frameW = img.width / 2
  const frameH = img.height

  canvas.width = frameW
  canvas.height = frameH

  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false

  let frameIndex = 0

  ctx.drawImage(img, 0, 0, frameW, frameH, 0, 0, frameW, frameH)

  const interval = setInterval(() => {
    ctx.clearRect(0, 0, frameW, frameH)
    ctx.drawImage(img, frameIndex * frameW, 0, frameW, frameH, 0, 0, frameW, frameH)
    frameIndex = (frameIndex + 1) % 2
  }, 500)

  return function stop() {
    clearInterval(interval)
  }
}