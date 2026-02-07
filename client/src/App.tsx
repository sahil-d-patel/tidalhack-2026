import { useEffect, useRef } from 'react'
import { ParallaxBackground } from './components/background/ParallaxBackground'
import { SnowParticles } from './components/background/SnowParticles'
import InfiniteCanvas from './components/canvas/InfiniteCanvas'
import { DemoToggle } from './components/ui/DemoToggle'
import { SoundToggle } from './components/ui/SoundToggle'
import { ThermometerHUD } from './components/ui/ThermometerHUD'
import { QuizCard } from './components/ui/QuizCard'
import { FrostOverlay } from './components/ui/FrostOverlay'
import { useCanvasStore } from './state/canvasStore'
import { WindSynthesizer } from './audio/windSynth'

function App() {
  const gameMode = useCanvasStore((state) => state.gameMode)
  const soundMuted = useCanvasStore((state) => state.soundMuted)
  const windRef = useRef<WindSynthesizer | null>(null)

  // Initialize wind synth on first user interaction
  useEffect(() => {
    const wind = new WindSynthesizer()
    windRef.current = wind

    const initAudio = () => {
      wind.init()
      if (!soundMuted) wind.play()
      // Remove listener after first interaction
      document.removeEventListener('click', initAudio)
    }
    document.addEventListener('click', initAudio)

    return () => {
      document.removeEventListener('click', initAudio)
      wind.stop()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync mute state
  useEffect(() => {
    windRef.current?.setMuted(soundMuted)
  }, [soundMuted])

  // Sync game mode to wind intensity
  useEffect(() => {
    windRef.current?.setMode(gameMode === 'peace' ? 'calm' : 'blizzard')
  }, [gameMode])

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background-dark">
      {/* Layer 0: Background */}
      <ParallaxBackground />

      {/* Layer 20: Snow Particles */}
      <SnowParticles intensity={gameMode === 'blizzard' ? 'blizzard' : 'calm'} />

      {/* Layer 30: Vignette Overlay */}
      <div
        className={`fixed inset-0 pointer-events-none ${
          gameMode === 'blizzard' ? 'blizzard-vignette' : ''
        }`}
        style={{ zIndex: 'var(--z-overlay)' }}
      />

      {/* Layer 10: Canvas */}
      <InfiniteCanvas />

      {/* Layer 30: Frost Overlay */}
      <FrostOverlay />

      {/* Layer 40: Quiz Card */}
      <QuizCard />

      {/* Layer 40: Thermometer HUD */}
      <ThermometerHUD />

      {/* Layer 40: HUD overlay */}
      <div
        className="fixed top-8 left-8 pointer-events-none"
        style={{ zIndex: 'var(--z-hud)' }}
      >
        <h1 className="text-2xl font-heading font-bold text-accent-warm/80 drop-shadow-lg">
          FRACTAL
        </h1>
        <p className="text-xs font-body text-frost/40">
          Interactive Knowledge Explorer
        </p>
      </div>

      {/* Demo Mode Toggle + Sound Toggle */}
      <div
        className="fixed top-8 right-8 pointer-events-auto flex items-center gap-2"
        style={{ zIndex: 'var(--z-hud)' }}
      >
        <SoundToggle />
        <DemoToggle />
      </div>
    </div>
  )
}

export default App
