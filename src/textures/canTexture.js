import * as THREE from 'three'
import { nutritionFacts } from '../data/experience.js'

// ─── Dimensions ────────────────────────────────────────────────────────────
const W = 1024
const H = 1024

// ─── Helpers ───────────────────────────────────────────────────────────────
function makeCanvas() {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  return canvas
}

// Draw the Monster claw-like mark using paths
function drawClawMark(ctx, cx, cy, size) {
  ctx.save()
  ctx.strokeStyle = '#1a1a1a'
  ctx.lineWidth = size * 0.08
  ctx.lineCap = 'round'

  const claws = [
    // Each claw: [startX, startY, cp1x, cp1y, cp2x, cp2y, endX, endY]
    [-0.38, 0.5, -0.42, -0.1, -0.15, -0.4, 0.05, -0.5],
    [-0.12, 0.5, -0.08, -0.05,  0.05, -0.38, 0.15, -0.5],
    [ 0.14, 0.5,  0.18, -0.05,  0.25, -0.35, 0.25, -0.5],
  ]

  claws.forEach(([sx, sy, c1x, c1y, c2x, c2y, ex, ey]) => {
    ctx.beginPath()
    ctx.moveTo(cx + sx * size, cy + sy * size)
    ctx.bezierCurveTo(
      cx + c1x * size, cy + c1y * size,
      cx + c2x * size, cy + c2y * size,
      cx + ex * size,  cy + ey * size,
    )
    ctx.stroke()
  })
  ctx.restore()
}

// ─── Front texture ─────────────────────────────────────────────────────────
export function createFrontTexture() {
  const canvas = makeCanvas()
  const ctx = canvas.getContext('2d')

  // Background gradient — dark silver/gray like the can
  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0,   '#2a2a2a')
  bg.addColorStop(0.3, '#3e3e3e')
  bg.addColorStop(0.5, '#d0d0d0')
  bg.addColorStop(0.7, '#3e3e3e')
  bg.addColorStop(1,   '#1a1a1a')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // Subtle vertical brushed-metal lines
  ctx.save()
  ctx.globalAlpha = 0.06
  for (let x = 0; x < W; x += 4) {
    ctx.strokeStyle = x % 8 === 0 ? '#fff' : '#000'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, H)
    ctx.stroke()
  }
  ctx.restore()

  // "ZERO ◆ SUGAR" top band
  ctx.fillStyle = '#111'
  ctx.fillRect(0, 0, W, 80)
  ctx.fillStyle = '#ccc'
  ctx.font = 'bold 26px "Space Grotesk", sans-serif'
  ctx.letterSpacing = '12px'
  ctx.textAlign = 'center'
  ctx.fillText('ZERO  ◆  SUGAR', W / 2, 50)

  // Claw mark
  drawClawMark(ctx, W / 2, H * 0.38, 280)

  // "HUR ABBAS" flanking text (subtle, mirroring mockup)
  ctx.font = '900 64px "Creepster", cursive'
  ctx.fillStyle = 'rgba(255,255,255,0.08)'
  ctx.textAlign = 'left'
  ctx.fillText('HUR', 40, H * 0.52)
  ctx.textAlign = 'right'
  ctx.fillText('ABBAS', W - 40, H * 0.52)

  // "MERCHANT" large
  ctx.fillStyle = '#111'
  ctx.font = 'bold 52px "Space Grotesk", sans-serif'
  ctx.letterSpacing = '6px'
  ctx.textAlign = 'center'
  ctx.fillText('MERCHANT', W / 2, H * 0.72)

  // "TINKERER" teal
  ctx.fillStyle = '#00D4C8'
  ctx.font = 'bold 36px "Space Grotesk", sans-serif'
  ctx.letterSpacing = '8px'
  ctx.fillText('TINKERER', W / 2, H * 0.80)

  // "BUILDER" dark
  ctx.fillStyle = '#111'
  ctx.font = 'bold 40px "Space Grotesk", sans-serif'
  ctx.letterSpacing = '8px'
  ctx.fillText('BUILDER', W / 2, H * 0.88)

  // Bottom band
  ctx.fillStyle = '#111'
  ctx.fillRect(0, H - 60, W, 60)

  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

// ─── Back / Experience Facts texture ───────────────────────────────────────
export function createBackTexture() {
  const canvas = makeCanvas()
  const ctx = canvas.getContext('2d')

  // Same metal background
  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0,   '#1a1a1a')
  bg.addColorStop(0.3, '#3e3e3e')
  bg.addColorStop(0.5, '#d0d0d0')
  bg.addColorStop(0.7, '#3e3e3e')
  bg.addColorStop(1,   '#1a1a1a')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // Nutrition label box
  const lx = 80, ly = 60, lw = W - 160, lh = H - 120
  ctx.fillStyle = 'rgba(240,240,240,0.92)'
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 6
  ctx.fillRect(lx, ly, lw, lh)
  ctx.strokeRect(lx, ly, lw, lh)

  let y = ly + 48

  // Header
  ctx.fillStyle = '#000'
  ctx.font = 'bold 52px "Space Grotesk", sans-serif'
  ctx.letterSpacing = '2px'
  ctx.textAlign = 'center'
  ctx.fillText('Experience Facts', W / 2, y)
  y += 14

  ctx.fillStyle = '#000'
  ctx.fillRect(lx, y, lw, 6)
  y += 24

  ctx.font = '18px "Space Grotesk"'
  ctx.letterSpacing = '0px'
  ctx.fillStyle = '#222'
  ctx.textAlign = 'left'
  ctx.fillText(`Serving Size: ${nutritionFacts.servingSize}`, lx + 16, y)
  y += 28
  ctx.fillText(`Servings Per Can: ${nutritionFacts.servingsPerCan}`, lx + 16, y)
  y += 10

  ctx.fillRect(lx, y, lw, 14)
  y += 32

  // Ingredients
  ctx.fillStyle = '#000'
  ctx.font = 'bold 28px "Space Grotesk"'
  ctx.fillText('INGREDIENTS', lx + 16, y)
  ctx.textAlign = 'right'
  ctx.fillText('% DAILY VALUE*', lx + lw - 16, y)
  y += 10

  ctx.fillStyle = '#000'
  ctx.fillRect(lx, y, lw, 3)
  y += 22

  ctx.font = '18px "Space Grotesk"'
  ctx.fillStyle = '#222'
  nutritionFacts.ingredients.forEach(({ name, value }) => {
    ctx.textAlign = 'left'
    ctx.fillText(name, lx + 16, y)
    ctx.textAlign = 'right'
    ctx.fillText(value, lx + lw - 16, y)
    ctx.fillStyle = '#ccc'
    ctx.fillRect(lx + 16, y + 6, lw - 32, 1)
    ctx.fillStyle = '#222'
    y += 30
  })

  y += 4
  ctx.fillStyle = '#000'
  ctx.fillRect(lx, y, lw, 8)
  y += 24

  // Daily Values
  ctx.font = 'bold 26px "Space Grotesk"'
  ctx.textAlign = 'left'
  ctx.fillText('DAILY VALUE', lx + 16, y)
  y += 8

  ctx.fillRect(lx, y, lw, 3)
  y += 22

  ctx.font = '18px "Space Grotesk"'
  nutritionFacts.dailyValues.forEach(({ name, value }) => {
    ctx.fillStyle = '#222'
    ctx.textAlign = 'left'
    ctx.fillText(name, lx + 16, y)
    ctx.fillStyle = value === '4%' ? '#cc0000' : '#000'
    ctx.textAlign = 'right'
    ctx.fillText(value, lx + lw - 16, y)
    ctx.fillStyle = '#ccc'
    ctx.fillRect(lx + 16, y + 6, lw - 32, 1)
    y += 30
  })

  y += 8
  ctx.fillStyle = '#000'
  ctx.fillRect(lx, y, lw, 3)
  y += 22

  // Warning
  ctx.fillStyle = '#000'
  ctx.font = 'bold 20px "Space Grotesk"'
  ctx.textAlign = 'left'
  ctx.fillText('⚠ WARNING:', lx + 16, y)
  y += 26

  ctx.font = '15px "Space Grotesk"'
  ctx.fillStyle = '#333'
  const warnLines = nutritionFacts.warning.split(', ')
  warnLines.forEach(line => {
    ctx.fillText(`- ${line}`, lx + 24, y)
    y += 22
  })

  y += 12
  ctx.fillStyle = '#000'
  ctx.font = 'bold 22px "Space Grotesk"'
  ctx.textAlign = 'center'
  ctx.fillText(nutritionFacts.tagline, W / 2, y)

  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}
