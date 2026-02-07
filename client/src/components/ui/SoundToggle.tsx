import { useCanvasStore } from '../../state/canvasStore'

export function SoundToggle() {
  const soundMuted = useCanvasStore((state) => state.soundMuted)
  const toggleSound = useCanvasStore((state) => state.toggleSound)

  return (
    <button
      onClick={toggleSound}
      className="frosted-glass rounded-lg px-3 py-1.5 text-frost/60 hover:text-frost transition-colors text-sm font-body flex items-center gap-1.5"
      aria-label={soundMuted ? 'Unmute sound' : 'Mute sound'}
      title={soundMuted ? 'Unmute sound' : 'Mute sound'}
    >
      {soundMuted ? (
        // Muted icon - speaker with X (inline SVG, no external dep)
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        // Unmuted icon - speaker with waves
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
      <span className="text-xs">{soundMuted ? 'OFF' : 'ON'}</span>
    </button>
  )
}
