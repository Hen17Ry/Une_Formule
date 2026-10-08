import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

/**
 * Scène WebGL du hero : le vrai modèle 3D du livre (UNE_FORMULE_BOOK_LOW.glb),
 * piloté par la progression du scroll (pose + animation d’ouverture « Book_Open »).
 */

interface Pose { rx: number, ry: number, rz: number, x: number, y: number, z: number, open: number }
type Layout = 'desktop' | 'mobile'

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const smooth = (t: number) => t * t * (3 - 2 * t)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/* Poses clés, en fonction de la progression du scroll (0 → 1). */
const KEYS: Record<Layout, { at: number, pose: Pose }[]> = {
  desktop: [
    { at: 0.0, pose: { rx: 0.06, ry: -0.62, rz: 0.04, x: 0.135, y: -0.005, z: 0, open: 0 } },
    { at: 0.3, pose: { rx: 0.02, ry: 0.22, rz: -0.03, x: -0.16, y: 0.0, z: 0.0, open: 0 } },
    { at: 0.58, pose: { rx: -0.95, ry: 0.0, rz: 0.0, x: 0.0, y: -0.075, z: 0.0, open: 0 } },
    { at: 0.92, pose: { rx: -1.02, ry: 0.0, rz: 0.0, x: 0.0, y: -0.085, z: 0.02, open: 1 } },
    { at: 1.0, pose: { rx: -1.02, ry: 0.0, rz: 0.0, x: 0.0, y: -0.085, z: 0.02, open: 1 } }
  ],
  mobile: [
    { at: 0.0, pose: { rx: 0.05, ry: -0.5, rz: 0.03, x: 0.0, y: 0.1, z: -0.08, open: 0 } },
    { at: 0.3, pose: { rx: 0.02, ry: 0.35, rz: -0.02, x: 0.0, y: 0.1, z: -0.08, open: 0 } },
    { at: 0.58, pose: { rx: -0.95, ry: 0.0, rz: 0.0, x: 0.0, y: -0.07, z: -0.1, open: 0 } },
    { at: 0.92, pose: { rx: -1.0, ry: 0.0, rz: 0.0, x: 0.0, y: -0.075, z: -0.26, open: 1 } },
    { at: 1.0, pose: { rx: -1.0, ry: 0.0, rz: 0.0, x: 0.0, y: -0.075, z: -0.26, open: 1 } }
  ]
}

function poseAt(layout: Layout, p: number): Pose {
  const keys = KEYS[layout]
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i]!, b = keys[i + 1]!
    if (p <= b.at) {
      const t = smooth(clamp((p - a.at) / (b.at - a.at)))
      const out = {} as Pose
      for (const k of Object.keys(a.pose) as (keyof Pose)[]) out[k] = lerp(a.pose[k], b.pose[k], t)
      return out
    }
  }
  return { ...keys[keys.length - 1]!.pose }
}

export class BookScene {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(30, 1, 0.01, 10)
  private pivot = new THREE.Group() // pose pilotée par le scroll
  private holder = new THREE.Group() // redresse le modèle (livre posé à plat dans le fichier)
  private shadow?: THREE.Mesh
  private mixer?: THREE.AnimationMixer
  private action?: THREE.AnimationAction
  private clipDuration = 1
  private raf = 0
  private running = false
  private target = 0
  private progress = 0
  private pointer = new THREE.Vector2()
  private pointerSmooth = new THREE.Vector2()
  private layout: Layout = 'desktop'
  private lastTime = performance.now()
  private elapsed = 0
  private bookWidth = 0.151
  private lowPower = false
  private lastKey = ''
  ready = false
  debugOpen: number | null = null

  constructor(private canvas: HTMLCanvasElement, private opts: { onReady?: () => void, onError?: (e: unknown) => void } = {}) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.08
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))

    // Rendu logiciel (SwiftShader, vieux GPU) : résolution réduite et rendu seulement quand la scène change.
    const gl = this.renderer.getContext()
    const dbg = gl.getExtension('WEBGL_debug_renderer_info')
    const gpu = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : ''
    this.lowPower = /swiftshader|llvmpipe|software|basic render/i.test(gpu) || (navigator.hardwareConcurrency || 8) <= 2
    if (this.lowPower) this.renderer.setPixelRatio(1)

    const pmrem = new THREE.PMREMGenerator(this.renderer)
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    this.scene.environmentIntensity = 0.62

    const key = new THREE.DirectionalLight(0xfff1df, 2.2)
    key.position.set(-0.6, 0.9, 1.2)
    this.scene.add(key)
    const rim = new THREE.DirectionalLight(0xffe2c2, 1.1)
    rim.position.set(0.9, 0.4, -0.6)
    this.scene.add(rim)
    this.scene.add(new THREE.HemisphereLight(0xfff8ee, 0xd9c2a5, 0.7))

    this.camera.position.set(0, 0, 0.78)
    this.pivot.add(this.holder)
    this.scene.add(this.pivot)
    this.addContactShadow()
    this.resize()
  }

  private addContactShadow() {
    const size = 256
    const c = document.createElement('canvas')
    c.width = c.height = size
    const ctx = c.getContext('2d')!
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    g.addColorStop(0, 'rgba(90,52,28,0.55)')
    g.addColorStop(0.45, 'rgba(90,52,28,0.22)')
    g.addColorStop(1, 'rgba(90,52,28,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
    const tex = new THREE.CanvasTexture(c)
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
    this.shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat)
    this.shadow.rotation.x = -Math.PI / 2
    this.scene.add(this.shadow)
  }

  async load(url: string) {
    try {
      const gltf = await new GLTFLoader().loadAsync(url)
      const model = gltf.scene
      model.traverse((o) => {
        const m = o as THREE.Mesh
        if (m.isMesh) {
          const mats = Array.isArray(m.material) ? m.material : [m.material]
          mats.forEach((mat) => {
            const std = mat as THREE.MeshStandardMaterial
            if (std.map) std.map.anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy())
            std.envMapIntensity = 0.9
          })
        }
      })
      // Le livre est modélisé à plat (épaisseur sur Y, dos sur l’axe Z en x = 0) : on le redresse face caméra.
      model.rotation.x = Math.PI / 2
      this.holder.add(model)

      if (gltf.animations.length) {
        this.mixer = new THREE.AnimationMixer(model)
        const clip = gltf.animations.find(a => /open/i.test(a.name)) ?? gltf.animations[0]!
        this.clipDuration = clip.duration
        // L’animation n’avance jamais seule : son temps est fixé par le scroll.
        this.action = this.mixer.clipAction(clip)
        this.action.setLoop(THREE.LoopRepeat, Infinity)
        this.action.timeScale = 0
        this.action.play()
        this.action.time = 0
        this.mixer.update(0)
      }

      this.ready = true
      this.update(true)
      this.render()
      this.opts.onReady?.()
    } catch (e) {
      this.opts.onError?.(e)
    }
  }

  setLayout(layout: Layout) {
    this.layout = layout
    this.resize()
  }

  setProgress(p: number) { this.target = clamp(p) }
  setPointer(x: number, y: number) { this.pointer.set(clamp(x, -1, 1), clamp(y, -1, 1)) }

  resize() {
    const { clientWidth: w, clientHeight: h } = this.canvas
    if (!w || !h) return
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    // Recul de la caméra pour que le livre garde une taille lisible quel que soit le format d’écran.
    const portrait = w / h < 0.85
    this.camera.position.z = portrait ? 0.98 + (0.85 - w / h) * 0.35 : 0.78
    this.camera.updateProjectionMatrix()
  }

  private update(force = false) {
    const nowMs = performance.now()
    const dt = Math.min((nowMs - this.lastTime) / 1000, 0.05)
    this.lastTime = nowMs
    this.elapsed += dt
    const t = this.elapsed
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    this.progress = force ? this.target : lerp(this.progress, this.target, 1 - Math.pow(0.0008, dt))
    this.pointerSmooth.lerp(this.pointer, 1 - Math.pow(0.002, dt))

    const pose = poseAt(this.layout, this.progress)
    if (this.debugOpen !== null) pose.open = this.debugOpen
    const still = reduce || this.lowPower
    const float = still ? 0 : Math.sin(t * 0.9) * 0.006 * (1 - pose.open)
    const sway = still ? 0 : Math.sin(t * 0.5) * 0.035 * (1 - pose.open)

    // À l’ouverture, le centre visuel passe du milieu de la couverture au dos du livre.
    this.holder.position.x = -this.bookWidth / 2 * (1 - pose.open)
    this.pivot.position.set(pose.x, pose.y + float, pose.z)
    this.pivot.rotation.set(
      pose.rx + this.pointerSmooth.y * 0.09,
      pose.ry + sway + this.pointerSmooth.x * 0.16,
      pose.rz
    )

    if (this.mixer && this.action) {
      this.action.time = pose.open * this.clipDuration * 0.995
      this.mixer.update(0)
    }

    if (this.shadow) {
      const lying = clamp(-pose.rx / 1.0)
      this.shadow.position.set(pose.x, pose.y - lerp(0.135, 0.05, lying), pose.z - 0.02)
      const w = lerp(0.2, 0.24 + pose.open * 0.2, lying)
      this.shadow.scale.set(w, lerp(0.05, 0.2, lying), 1)
      ;(this.shadow.material as THREE.MeshBasicMaterial).opacity = lerp(0.7, 0.55, lying) - float * 20
    }
  }

  private render() { this.renderer.render(this.scene, this.camera) }

  private loop = () => {
    if (!this.running) return
    this.update()
    if (this.lowPower) {
      const key = [this.progress.toFixed(4), this.pointerSmooth.x.toFixed(3), this.pointerSmooth.y.toFixed(3)].join('|')
      if (key !== this.lastKey) { this.lastKey = key; this.render() }
    } else {
      this.render()
    }
    this.raf = requestAnimationFrame(this.loop)
  }

  start() {
    if (this.running) return
    this.running = true
    this.lastTime = performance.now()
    this.raf = requestAnimationFrame(this.loop)
  }

  stop() {
    this.running = false
    cancelAnimationFrame(this.raf)
  }

  dispose() {
    this.stop()
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.isMesh) {
        m.geometry.dispose()
        const mats = Array.isArray(m.material) ? m.material : [m.material]
        mats.forEach((mat: any) => {
          Object.values(mat).forEach((v: any) => v?.isTexture && v.dispose())
          mat.dispose()
        })
      }
    })
    this.scene.environment?.dispose()
    this.renderer.dispose()
  }
}
