import { useCanvasStore } from '../../state/canvasStore'

export const FrostOverlay = () => {
  const warmth = useCanvasStore((state) => state.warmth)
  const gameMode = useCanvasStore((state) => state.gameMode)

  if (gameMode !== 'blizzard') return null

  // Calculate frost intensity based on warmth (inverted)
  // At warmth 50: subtle frost
  // At warmth 0: heavy frost
  const frostIntensity = 100 - warmth

  // Scale spread, blur, and opacity
  const spread = 40 + frostIntensity * 1.4 // 40 at warmth=50, 180 at warmth=0
  const blur = 20 + frostIntensity * 0.8 // 20 at warmth=50, 100 at warmth=0
  const opacity = 0.15 + frostIntensity * 0.0045 // 0.15 at warmth=50, 0.6 at warmth=0

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 'var(--z-overlay)',
        boxShadow: `inset 0 0 ${spread}px ${blur}px rgba(147, 197, 253, ${opacity})`,
        transition: 'box-shadow 0.8s ease-in-out',
      }}
    />
  )
}
