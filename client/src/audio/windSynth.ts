// Wind synthesizer using Web Audio API - no external audio files needed
export class WindSynthesizer {
  private ctx: AudioContext | null = null
  private gainNode: GainNode | null = null
  private noiseNode: AudioBufferSourceNode | null = null
  private filterNode: BiquadFilterNode | null = null
  private isPlaying = false
  private mode: 'calm' | 'blizzard' = 'calm'

  init() {
    if (this.ctx) return
    this.ctx = new AudioContext()
    this.gainNode = this.ctx.createGain()
    this.gainNode.gain.value = 0
    this.filterNode = this.ctx.createBiquadFilter()
    this.filterNode.type = 'lowpass'
    this.filterNode.frequency.value = 400
    this.filterNode.Q.value = 1
    this.gainNode.connect(this.ctx.destination)
    this.filterNode.connect(this.gainNode)
  }

  private createNoiseBuffer(): AudioBuffer {
    const ctx = this.ctx!
    const bufferSize = ctx.sampleRate * 4 // 4 second buffer
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5
    }
    return buffer
  }

  play() {
    if (!this.ctx || this.isPlaying) return
    if (this.ctx.state === 'suspended') this.ctx.resume()

    const buffer = this.createNoiseBuffer()
    this.noiseNode = this.ctx.createBufferSource()
    this.noiseNode.buffer = buffer
    this.noiseNode.loop = true
    this.noiseNode.connect(this.filterNode!)
    this.noiseNode.start()
    this.isPlaying = true
    this.applyMode(this.mode)
  }

  stop() {
    if (this.noiseNode) {
      this.noiseNode.stop()
      this.noiseNode.disconnect()
      this.noiseNode = null
    }
    this.isPlaying = false
  }

  setMode(mode: 'calm' | 'blizzard') {
    this.mode = mode
    if (this.isPlaying) this.applyMode(mode)
  }

  private applyMode(mode: 'calm' | 'blizzard') {
    if (!this.ctx || !this.gainNode || !this.filterNode) return
    const now = this.ctx.currentTime
    if (mode === 'calm') {
      this.gainNode.gain.linearRampToValueAtTime(0.08, now + 1.5)
      this.filterNode.frequency.linearRampToValueAtTime(400, now + 1.5)
    } else {
      this.gainNode.gain.linearRampToValueAtTime(0.25, now + 1.5)
      this.filterNode.frequency.linearRampToValueAtTime(1200, now + 1.5)
    }
  }

  setMuted(muted: boolean) {
    if (muted) {
      this.stop()
    } else if (!this.isPlaying) {
      this.play()
    }
  }
}
