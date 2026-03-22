import { applySkyTheme } from './theme.js'
import { applyGrain } from './grain.js'
import animationsImg from './assets/animations.png'

const CELL = 128

const sheet = new Image()
sheet.src = animationsImg

const canvas = document.getElementById('companion')
canvas.width = CELL
canvas.height = CELL
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false

let intervalId = null
let frameCallback = null

function drawCell(col, row) {
  ctx.clearRect(0, 0, CELL, CELL)
  ctx.drawImage(sheet, col * CELL, row * CELL, CELL, CELL, 0, 0, CELL, CELL)
}

function startLoop() {
  if (intervalId) clearInterval(intervalId)
  intervalId = setInterval(() => {
    if (frameCallback) frameCallback()
  }, 200)
}

function runJump() {
  let i = 0
  frameCallback = () => {
    drawCell(i % 2, 0)
    i++
  }
}

function runFocus() {
  let count = 0
  let bounces = Math.floor(Math.random() * 4) + 3
  let idle = 0
  let idleTarget = 0

  frameCallback = () => {
    if (idle > 0) {
      idle--
      drawCell(0, 1)
      if (idle === 0) {
        count = 0
        bounces = Math.floor(Math.random() * 4) + 3
      }
      return
    }
    if (count >= bounces * 2) {
      idleTarget = Math.floor(((Math.random() * 2 + 1) * 1000 + 3000) / 200)
      idle = idleTarget
      drawCell(0, 1)
      return
    }
    const col = count % 2 === 0 ? 1 : 2
    drawCell(col, 1)
    count++
  }
}

function setState(state) {
  frameCallback = null
  if (state === 1) runJump()
  else if (state === 2) runFocus()
}

applySkyTheme()
applyGrain()
startLoop()

const slider = document.createElement('input')
slider.type = 'range'
slider.min = 0
slider.max = 23
slider.value = new Date().getHours()
slider.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);width:300px;z-index:999'
slider.addEventListener('input', () => applySkyTheme(Number(slider.value)))
document.body.appendChild(slider)

const btnContainer = document.createElement('div')
btnContainer.style.cssText = 'position:fixed;bottom:20px;left:20px;z-index:999;display:flex;gap:8px;'

for (let i = 1; i <= 5; i++) {
  const btn = document.createElement('button')
  btn.textContent = i
  btn.style.cssText = `
    width: 36px;
    height: 36px;
    background: rgba(0,0,0,0.4);
    color: white;
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
  `
  btn.addEventListener('click', () => setState(i))
  btnContainer.appendChild(btn)
}

document.body.appendChild(btnContainer)

sheet.onload = () => setState(1)