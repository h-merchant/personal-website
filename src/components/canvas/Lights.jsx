// Dramatic studio lighting — boosted so metallic material is visible without HDR env map
export default function Lights() {
  return (
    <>
      {/* Ambient — raised enough to prevent total black on metallic surfaces */}
      <ambientLight intensity={0.6} />

      {/* Key light — strong front-top fill */}
      <directionalLight
        position={[2, 4, 5]}
        intensity={4}
        color="#ffffff"
      />

      {/* Secondary front light — ensures label texture is readable */}
      <directionalLight
        position={[-2, 1, 4]}
        intensity={2}
        color="#e8f0ff"
      />

      {/* Rim light — teal, from behind for the glow edge effect */}
      <pointLight
        position={[-3, 2, -3]}
        intensity={8}
        color="#00D4C8"
        distance={14}
        decay={2}
      />

      {/* Top highlight — simulates studio overhead */}
      <pointLight
        position={[0, 6, 2]}
        intensity={3}
        color="#ffffff"
        distance={10}
        decay={2}
      />

      {/* Fill from right — cold blue tone */}
      <pointLight
        position={[5, -1, 2]}
        intensity={1.5}
        color="#aaddff"
        distance={10}
        decay={2}
      />
    </>
  )
}
