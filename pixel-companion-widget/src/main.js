import { startStudyAnimation } from './animations/studyFocus.js'
import { applySkyTheme } from './theme.js'
import studyImg from './assets/study.png'

const img = new Image()
applySkyTheme()
img.src = studyImg

img.onload = () => {
  const canvas = document.getElementById('companion')
  startStudyAnimation(canvas, img)
}