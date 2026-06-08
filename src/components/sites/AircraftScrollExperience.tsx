"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

const chapters = [
  {
    eyebrow: "ShaBest 01",
    title: "A quieter kind of takeoff.",
    body: "Cabin, wing and service details move as one polished experience from gate to climb.",
  },
  {
    eyebrow: "Skyline Cruise",
    title: "Built around the passenger.",
    body: "A real aircraft model moves through a wide-body flyby above layered cloud banks.",
  },
  {
    eyebrow: "Next Route",
    title: "Designed to feel effortless.",
    body: "Scroll through a smooth cross-screen climb as ShaBest clears the horizon.",
  },
]

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function makeFallbackPlane() {
  const group = new THREE.Group()
  const white = new THREE.MeshStandardMaterial({ color: "#f6f1e8", metalness: 0.1, roughness: 0.35 })
  const navy = new THREE.MeshStandardMaterial({ color: "#092b63", metalness: 0.2, roughness: 0.38 })

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 3.4, 10, 24), white)
  body.rotation.z = Math.PI / 2
  group.add(body)

  const wing = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 1.15), navy)
  wing.position.set(-0.2, -0.05, 0)
  group.add(wing)

  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.9, 0.55), navy)
  tail.position.set(-1.75, 0.42, 0)
  tail.rotation.z = -0.18
  group.add(tail)

  const engine = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.45, 24), navy)
  engine.rotation.z = Math.PI / 2
  engine.position.set(0.25, -0.38, 0.55)
  group.add(engine)

  group.rotation.set(0.05, -0.18, -0.02)
  return group
}

export function AircraftScrollExperience() {
  const rootRef = useRef<HTMLElement | null>(null)
  const mountRef = useRef<HTMLDivElement | null>(null)
  const [activeChapter, setActiveChapter] = useState(0)

  useEffect(() => {
    const mount = mountRef.current
    const root = rootRef.current
    if (!mount || !root) return

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog("#061d4f", 11, 30)

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
    camera.position.set(0, 0.55, 12)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.domElement.dataset.aviationScene = "true"
    renderer.domElement.dataset.model = "loading"
    renderer.domElement.dataset.progress = "0"
    mount.appendChild(renderer.domElement)

    const ambient = new THREE.HemisphereLight("#d9eeff", "#061d4f", 3.1)
    scene.add(ambient)

    const key = new THREE.DirectionalLight("#fff2d5", 5.2)
    key.position.set(3.8, 5, 6)
    scene.add(key)

    const rim = new THREE.DirectionalLight("#7abfff", 2.8)
    rim.position.set(-5, 2, -4)
    scene.add(rim)

    const aircraft = new THREE.Group()
    const fallback = makeFallbackPlane()
    aircraft.add(fallback)
    scene.add(aircraft)

    const loader = new GLTFLoader()
    loader.load(
      "/assets/pixabay-passenger-plane.glb",
      (gltf) => {
        const model = gltf.scene
        const bounds = new THREE.Box3().setFromObject(model)
        const size = bounds.getSize(new THREE.Vector3())
        const center = bounds.getCenter(new THREE.Vector3())
        const maxAxis = Math.max(size.x, size.y, size.z)

        const normalizedModel = new THREE.Group()
        model.position.copy(center).multiplyScalar(-1)
        normalizedModel.scale.setScalar(5.2 / Math.max(maxAxis, 0.001))
        normalizedModel.rotation.set(0, Math.PI / 2, 0)
        normalizedModel.add(model)
        normalizedModel.traverse((object) => {
          const mesh = object as THREE.Mesh
          if (!mesh.isMesh) return
          mesh.castShadow = true
          mesh.receiveShadow = true
        })

        fallback.visible = false
        aircraft.add(normalizedModel)
        renderer.domElement.dataset.model = "pixabay-passenger-plane"
      },
      undefined,
      () => {
        renderer.domElement.dataset.model = "procedural-fallback"
      }
    )

    let frame = 0
    let viewWidth = 10
    let viewHeight = 6
    let scrollProgress = 0
    let lastChapter = -1
    let pointerX = 0
    let pointerY = 0

    const resize = () => {
      const width = mount.clientWidth
      const height = mount.clientHeight
      const aspect = width / Math.max(height, 1)
      viewHeight = width < 700 ? 6.7 : 5.35
      viewWidth = viewHeight * aspect
      camera.left = -viewWidth / 2
      camera.right = viewWidth / 2
      camera.top = viewHeight / 2
      camera.bottom = -viewHeight / 2
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    const updateProgress = () => {
      const rect = root.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      scrollProgress = clamp(-rect.top / Math.max(total, 1))
      renderer.domElement.dataset.progress = scrollProgress.toFixed(3)

      const nextChapter = Math.min(chapters.length - 1, Math.floor(scrollProgress * chapters.length))
      if (nextChapter !== lastChapter) {
        lastChapter = nextChapter
        setActiveChapter(nextChapter)
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 2
      pointerY = (event.clientY / window.innerHeight - 0.5) * -2
    }

    const animate = () => {
      frame = requestAnimationFrame(animate)
      const p = clamp(scrollProgress)
      const startX = viewWidth * -0.1
      const endX = viewWidth * 0.45

      aircraft.position.x = THREE.MathUtils.lerp(startX, endX, p)
      aircraft.position.y = THREE.MathUtils.lerp(0.08, 1.18, p)
      aircraft.position.y += Math.sin(performance.now() * 0.001) * 0.025
      aircraft.position.z = -1.4
      aircraft.rotation.x = 0.02 + pointerY * 0.025 - 0.16 + p * 0.16
      aircraft.rotation.y = THREE.MathUtils.lerp(-0.12, 0.12, p) + pointerX * 0.025
      aircraft.rotation.z = THREE.MathUtils.lerp(0.02, 0.24, p)

      renderer.render(scene, camera)
      renderer.domElement.dataset.rendered = "true"
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)
    window.addEventListener("scroll", updateProgress, { passive: true })
    window.addEventListener("pointermove", onPointerMove, { passive: true })

    resize()
    updateProgress()
    animate()

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener("scroll", updateProgress)
      window.removeEventListener("pointermove", onPointerMove)
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh
        if (mesh.geometry) mesh.geometry.dispose()
        const material = mesh.material
        if (Array.isArray(material)) {
          material.forEach((item) => item.dispose())
        } else if (material) {
          material.dispose()
        }
      })
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <section
      ref={rootRef}
      data-aircraft-scroll-section="true"
      className="relative min-h-[225svh] bg-[#061d4f] text-white"
    >
      <div className="sticky top-0 min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/cloudscape-pixabay-8771179.jpg')] bg-cover bg-center" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,28,73,0.18)_0%,rgba(5,28,73,0.5)_42%,rgba(3,18,44,0.66)_100%)]" />
        <svg
          className="pointer-events-none absolute left-0 top-[8%] z-[1] h-40 w-full text-[#f6a915] opacity-70"
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 72 C190 2 330 6 455 46 C580 86 720 86 870 46 C1030 8 1190 12 1440 48"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="5"
          />
        </svg>
        <div ref={mountRef} className="absolute inset-0 h-screen w-full" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(3,18,44,0.76)_0%,rgba(3,18,44,0.32)_32%,rgba(3,18,44,0.04)_100%)]" />
        <div className="pointer-events-none relative z-10 mx-auto grid min-h-screen max-w-7xl items-end px-5 pb-12 pt-24 sm:px-8 lg:grid-cols-[390px_1fr] lg:items-center lg:pb-24">
          <div className="relative min-h-72 max-w-[390px]">
            {chapters.map((chapter, index) => (
              <article
                key={chapter.eyebrow}
                className={`absolute inset-x-0 bottom-0 border-l-2 border-[#f6a915] bg-[#03122c]/42 py-5 pl-5 pr-4 backdrop-blur-sm transition-all duration-500 lg:bottom-auto lg:top-0 ${
                  activeChapter === index ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#f6a915]">
                  {chapter.eyebrow}
                </p>
                <h2 className="mt-4 text-balance text-4xl font-bold leading-[1.04] sm:text-[2.75rem]">
                  {chapter.title}
                </h2>
                <p className="mt-5 max-w-sm text-[15px] leading-7 text-white/76">{chapter.body}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#061d4f] to-transparent" />
      </div>
    </section>
  )
}
