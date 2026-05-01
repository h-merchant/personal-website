import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createFrontTexture, createBackTexture } from '../../textures/canTexture.js'
import { scrollState } from '../../hooks/scrollState.js'

// ── Easing ────────────────────────────────────────────────────────────────
function lerp(a, b, t) { return a + (b - a) * t }

// ── Custom can geometry (cylinder with tapered ends) ─────────────────────
function buildCanGeometry() {
  const geo = new THREE.CylinderGeometry(0.52, 0.52, 2.2, 64, 4, false)
  const pos = geo.attributes.position
  const topY = 1.1, botY = -1.1, taper = 0.92
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i)
    if (Math.abs(y - topY) < 0.01 || Math.abs(y - botY) < 0.01) {
      pos.setX(i, pos.getX(i) * taper)
      pos.setZ(i, pos.getZ(i) * taper)
    }
  }
  pos.needsUpdate = true
  geo.computeVertexNormals()
  return geo
}

// ── Animation targets (smooth lerp state) ────────────────────────────────
const TARGET = { x: 0, rotY: 0, floatY: 0, scale: 1 }
const CURRENT = { x: 0, rotY: 0, floatY: 0, scale: 1 }

export default function Can() {
  const groupRef  = useRef()
  const frontTex  = useMemo(() => createFrontTexture(), [])
  const backTex   = useMemo(() => createBackTexture(),  [])
  const material  = useMemo(() => new THREE.MeshStandardMaterial({
    map: frontTex,
    metalness: 0.5,
    roughness: 0.35,
  }), [frontTex])

  const floatClock = useRef(0)

  useFrame((_, delta) => {
    if (!groupRef.current) return

    const p = scrollState.progress   // 0–1 across entire page
    // Assume 3 equal-height sections, so each covers 1/3 of scroll
    const heroEnd     = 1 / 3
    const aboutEnd    = 2 / 3

    // ── Hero (0 → 1/3): spin 360°, stay centred ─────────────────────────
    if (p <= heroEnd) {
      const t = p / heroEnd
      TARGET.rotY  = t * Math.PI * 2
      TARGET.x     = 0
      TARGET.scale = 1
    }
    // ── About (1/3 → 2/3): slide left, hold front face (2π = 0 = front) ─
    else if (p <= aboutEnd) {
      const t = (p - heroEnd) / (aboutEnd - heroEnd)
      TARGET.rotY  = Math.PI * 2           // locked front
      TARGET.x     = lerp(0, -2.4, t)
      TARGET.scale = lerp(1, 0.88, t)
    }
    // ── Experience (2/3 → 1): rotate to back face (3π normalises to π) ──
    else {
      const t = (p - aboutEnd) / (1 - aboutEnd)
      TARGET.rotY  = lerp(Math.PI * 2, Math.PI * 3, t)   // 2π → 3π → back
      TARGET.x     = lerp(-2.4, -2.2, t)
      TARGET.scale = 0.88
    }

    // ── Float bob ────────────────────────────────────────────────────────
    floatClock.current += delta
    TARGET.floatY = Math.sin(floatClock.current * 0.9) * 0.1

    // ── Smooth interpolation (spring feel) ───────────────────────────────
    const lerpSpeed = 1 - Math.pow(0.02, delta)   // frame-rate independent
    CURRENT.rotY  = lerp(CURRENT.rotY,  TARGET.rotY,  lerpSpeed)
    CURRENT.x     = lerp(CURRENT.x,     TARGET.x,     lerpSpeed)
    CURRENT.scale = lerp(CURRENT.scale, TARGET.scale, lerpSpeed)
    CURRENT.floatY = lerp(CURRENT.floatY, TARGET.floatY, lerpSpeed)

    groupRef.current.rotation.y = CURRENT.rotY
    groupRef.current.position.x = CURRENT.x
    groupRef.current.position.y = CURRENT.floatY
    groupRef.current.scale.setScalar(CURRENT.scale)

    // ── Texture swap: show back when rotY ≈ π ───────────────────────────
    const normRot = ((CURRENT.rotY % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
    const showBack = normRot > Math.PI * 0.7 && normRot < Math.PI * 1.3
    const wantedMap = showBack ? backTex : frontTex
    if (material.map !== wantedMap) {
      material.map = wantedMap
      material.needsUpdate = true
    }
  })

  const geometry = useMemo(() => buildCanGeometry(), [])

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh geometry={geometry} material={material} castShadow />

      {/* Top cap */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.48, 0.48, 0.08, 64]} />
        <meshStandardMaterial color="#c8c8c8" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Neck taper */}
      <mesh position={[0, 1.18, 0]}>
        <cylinderGeometry args={[0.28, 0.48, 0.16, 64]} />
        <meshStandardMaterial color="#b0b0b0" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Rim */}
      <mesh position={[0, 1.28, 0]}>
        <cylinderGeometry args={[0.30, 0.30, 0.08, 64]} />
        <meshStandardMaterial color="#999" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Pull tab */}
      <mesh position={[0.1, 1.34, 0]} rotation={[0, 0, -0.3]}>
        <torusGeometry args={[0.09, 0.015, 8, 24, Math.PI * 1.5]} />
        <meshStandardMaterial color="#bbb" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Bottom cap */}
      <mesh position={[0, -1.1, 0]}>
        <cylinderGeometry args={[0.46, 0.46, 0.06, 64]} />
        <meshStandardMaterial color="#c8c8c8" metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  )
}
