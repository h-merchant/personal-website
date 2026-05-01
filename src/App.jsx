import { useScrollRig } from './hooks/useScrollRig.js'
import MockupStage from './components/MockupStage.jsx'

export default function App() {
  // Lenis smooth scroll + shared scrollState
  useScrollRig()

  return (
    <>
      {/* Full-screen mockup crossfade stage */}
      <MockupStage />

      {/* Scrollable spacer — three "screens" of height drive the crossfade.
          Each section is transparent: the mockup IS the visual. */}
      <main>
        <section id="section-hero" />
        <section id="section-about" />
        <section id="section-experience" />
      </main>
    </>
  )
}
