import { Canvas } from '@react-three/fiber'
import Can from './Can.jsx'
import Lights from './Lights.jsx'

export default function CanScene() {
  return (
    <div id="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 38 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#0a0a0a' }}
      >
        <Lights />
        <Can />
      </Canvas>
    </div>
  )
}
