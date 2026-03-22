export function startStudyAnimation(canvas, img) {
  const frameW = img.width / 2
  const frameH = img.height / 2

  canvas.width = frameW
  canvas.height = frameH

  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false

  function drawFrame(col, row) {
    ctx.clearRect(0, 0, frameW, frameH)
    ctx.drawImage(img, col * frameW, row * frameH, frameW, frameH, 0, 0, frameW, frameH)
  }

  function runCycle() {
    const bounces = Math.floor(Math.random() * 4) + 3
    let count = 0

    function bounce() {
      if (count >= bounces * 2) {
        drawFrame(0, 0)
        const idleTime = (Math.random() * 2 + 1) * 1000
        setTimeout(runCycle, idleTime)
        return
      }
      const col = count % 2 === 0 ? 1 : 0
      const row = count % 2 === 0 ? 0 : 1
      drawFrame(col, row)
      count++
      setTimeout(bounce, 200)
    }

    bounce()
  }

  drawFrame(0, 0)
  runCycle()
}