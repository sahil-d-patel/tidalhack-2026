import { useEffect, useMemo, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSnowPreset } from '@tsparticles/preset-snow'
import type { Engine, ISourceOptions } from '@tsparticles/engine'

type SnowParticlesProps = {
  intensity: 'calm' | 'blizzard'
}

export function SnowParticles({ intensity }: SnowParticlesProps) {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSnowPreset(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  const particleOptions: ISourceOptions = useMemo(() => {
    const isBlizzard = intensity === 'blizzard'

    return {
      preset: 'snow',
      particles: {
        number: {
          value: isBlizzard ? 150 : 30,
        },
        size: {
          value: { min: isBlizzard ? 2 : 1, max: isBlizzard ? 5 : 3 },
        },
        opacity: {
          value: { min: isBlizzard ? 0.6 : 0.4, max: isBlizzard ? 1.0 : 0.7 },
        },
        move: {
          enable: true,
          speed: { min: isBlizzard ? 5 : 1, max: isBlizzard ? 10 : 2 },
          direction: 'bottom',
          straight: false,
          random: true,
          outModes: {
            default: 'out',
          },
        },
        wobble: {
          enable: true,
          distance: isBlizzard ? 20 : 10,
          speed: { min: isBlizzard ? 10 : 5, max: isBlizzard ? 20 : 10 },
        },
      },
      background: {
        opacity: 0,
      },
    }
  }, [intensity])

  if (!init) {
    return null
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 'var(--z-particles)' }}
    >
      <Particles
        id={`snow-${intensity}`}
        key={intensity}
        options={particleOptions}
      />
    </div>
  )
}
