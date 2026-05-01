import { useScrollRig } from './hooks/useScrollRig.js'
import CanScene from './components/canvas/CanScene.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/sections/Hero.jsx'
import About from './components/sections/About.jsx'
import Experience from './components/sections/Experience.jsx'

export default function App() {
  // Initializes Lenis smooth scroll + GSAP ticker integration
  useScrollRig()

  return (
    <>
      {/* Fixed 3D canvas — lives behind everything */}
      <CanScene />

      {/* Fixed top nav */}
      <Nav />

      {/* Scrollable content */}
      <main>
        <Hero />
        <About />
        <Experience />
      </main>
    </>
  )
}
