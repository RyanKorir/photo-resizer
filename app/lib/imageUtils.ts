export interface ImageState {
  brightness: number   // -100 to 100
  contrast: number     // -100 to 100
  saturation: number   // -100 to 100
  hue: number          // -180 to 180
  sharpness: number    // 0 to 100
  blur: number         // 0 to 20
  sepia: number        // 0 to 100
  grayscale: number    // 0 to 100
  vignette: number     // 0 to 100
  temperature: number  // -100 to 100 (warm/cool)
  highlights: number   // -100 to 100
  shadows: number      // -100 to 100
}

export interface TransformState {
  rotation: number     // 0, 90, 180, 270
  flipH: boolean
  flipV: boolean
  scale: number        // 0.1 to 4
}

export interface CropState {
  x: number
  y: number
  width: number
  height: number
  active: boolean
}

export interface ResizeState {
  width: number
  height: number
  lockAspect: boolean
}

export const defaultImageState: ImageState = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  hue: 0,
  sharpness: 0,
  blur: 0,
  sepia: 0,
  grayscale: 0,
  vignette: 0,
  temperature: 0,
  highlights: 0,
  shadows: 0,
}

export const defaultTransform: TransformState = {
  rotation: 0,
  flipH: false,
  flipV: false,
  scale: 1,
}

export function buildCSSFilter(state: ImageState): string {
  const parts: string[] = []

  // brightness: CSS 0-2 where 1 is normal; our -100 to 100
  parts.push(`brightness(${1 + state.brightness / 100})`)
  // contrast: CSS 0-2 where 1 is normal
  parts.push(`contrast(${1 + state.contrast / 100})`)
  // saturate: CSS 0-3 where 1 is normal
  parts.push(`saturate(${1 + state.saturation / 100})`)
  // hue-rotate
  if (state.hue !== 0) parts.push(`hue-rotate(${state.hue}deg)`)
  // blur
  if (state.blur > 0) parts.push(`blur(${state.blur * 0.5}px)`)
  // sepia
  if (state.sepia > 0) parts.push(`sepia(${state.sepia / 100})`)
  // grayscale
  if (state.grayscale > 0) parts.push(`grayscale(${state.grayscale / 100})`)

  return parts.join(' ')
}

export interface FilterPreset {
  name: string
  state: Partial<ImageState>
}

export const FILTER_PRESETS: FilterPreset[] = [
  { name: 'Original', state: {} },
  { name: 'Vivid', state: { brightness: 10, contrast: 20, saturation: 40 } },
  { name: 'Warm', state: { temperature: 40, brightness: 5, saturation: 10 } },
  { name: 'Cool', state: { temperature: -40, contrast: 10, saturation: -10 } },
  { name: 'B&W', state: { grayscale: 100, contrast: 15 } },
  { name: 'Sepia', state: { sepia: 80, brightness: 5 } },
  { name: 'Fade', state: { brightness: 10, contrast: -20, saturation: -30 } },
  { name: 'Dramatic', state: { contrast: 50, saturation: -20, brightness: -10 } },
  { name: 'Matte', state: { contrast: -15, brightness: 10, saturation: -15 } },
  { name: 'Vintage', state: { sepia: 30, contrast: -10, saturation: -20, brightness: 5 } },
  { name: 'Lush', state: { saturation: 60, brightness: 5, contrast: 10 } },
  { name: 'Cinematic', state: { contrast: 30, saturation: -20, shadows: -20, highlights: -10 } },
]

export const ASPECT_RATIOS = [
  { label: 'Free', value: null },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '16:9', value: 16 / 9 },
  { label: '3:2', value: 3 / 2 },
  { label: '2:3', value: 2 / 3 },
  { label: '9:16', value: 9 / 16 },
]

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string, format: 'png' | 'jpeg' | 'webp', quality: number) {
  const mime = `image/${format}`
  const dataURL = canvas.toDataURL(mime, quality)
  const a = document.createElement('a')
  a.href = dataURL
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export function applyAllFiltersToCanvas(
  ctx: CanvasRenderingContext2D,
  source: HTMLImageElement | HTMLCanvasElement,
  imgState: ImageState,
  transform: TransformState,
  outputWidth: number,
  outputHeight: number,
  srcX = 0,
  srcY = 0,
  srcW?: number,
  srcH?: number
) {
  const canvas = ctx.canvas
  canvas.width = outputWidth
  canvas.height = outputHeight

  ctx.save()

  // Build CSS filter string
  const filterStr = buildCSSFilter(imgState)
  ctx.filter = filterStr

  // Apply transforms
  ctx.translate(outputWidth / 2, outputHeight / 2)
  ctx.rotate((transform.rotation * Math.PI) / 180)
  ctx.scale(transform.flipH ? -1 : 1, transform.flipV ? -1 : 1)
  ctx.translate(-outputWidth / 2, -outputHeight / 2)

  const sw = srcW ?? source.width
  const sh = srcH ?? source.height

  ctx.drawImage(source, srcX, srcY, sw, sh, 0, 0, outputWidth, outputHeight)

  ctx.restore()
  ctx.filter = 'none'

  // Vignette overlay
  if (imgState.vignette > 0) {
    const gradient = ctx.createRadialGradient(
      outputWidth / 2, outputHeight / 2, Math.min(outputWidth, outputHeight) * 0.3,
      outputWidth / 2, outputHeight / 2, Math.max(outputWidth, outputHeight) * 0.8
    )
    gradient.addColorStop(0, 'transparent')
    gradient.addColorStop(1, `rgba(0,0,0,${imgState.vignette / 100 * 0.85})`)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, outputWidth, outputHeight)
  }

  // Temperature overlay (warm/cool tint)
  if (imgState.temperature !== 0) {
    const t = imgState.temperature
    if (t > 0) {
      ctx.fillStyle = `rgba(255, 140, 0, ${t / 100 * 0.15})`
    } else {
      ctx.fillStyle = `rgba(100, 160, 255, ${Math.abs(t) / 100 * 0.15})`
    }
    ctx.globalCompositeOperation = 'multiply'
    ctx.fillRect(0, 0, outputWidth, outputHeight)
    ctx.globalCompositeOperation = 'source-over'
  }

  // Highlights/shadows (simplified overlay)
  if (imgState.highlights !== 0 || imgState.shadows !== 0) {
    const imageData = ctx.getImageData(0, 0, outputWidth, outputHeight)
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      const lum = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255
      if (lum > 0.5 && imgState.highlights !== 0) {
        const factor = (lum - 0.5) * 2 * (imgState.highlights / 100)
        data[i] = Math.min(255, Math.max(0, data[i] + factor * 30))
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + factor * 30))
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + factor * 30))
      } else if (lum <= 0.5 && imgState.shadows !== 0) {
        const factor = (0.5 - lum) * 2 * (imgState.shadows / 100)
        data[i] = Math.min(255, Math.max(0, data[i] + factor * 30))
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + factor * 30))
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + factor * 30))
      }
    }
    ctx.putImageData(imageData, 0, 0)
  }
}
