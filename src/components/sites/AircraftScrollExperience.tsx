"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

const copy = [
  {
    kicker: "Fleet DNA",
    title: "Engineering the calm before takeoff.",
    body: "A closer look at the aircraft systems that make every ShaBest journey feel smooth from gate to sky.",
  },
  {
    kicker: "Cabin Comfort",
    title: "Every layer has a job.",
    body: "Wing balance, engine flow, cabin detail and service rhythm come together around the passenger.",
  },
  {
    kicker: "ShaBest Standard",
    title: "Ready for the next route.",
    body: "From the first safety check to the final climb, the aircraft is tuned for comfort and confidence.",
  },
]

type Part = {
  mesh: THREE.Object3D
  base: THREE.Vector3
  exploded: THREE.Vector3
  baseRotation: THREE.Euler
  explodedRotation: THREE.Euler
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function easeInOut(value: number) {
  return value * value * (3 - 2 * value)
}

function makeMaterial(color: string, roughness = 0.42, metalness = 0.18) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness,
  })
}

export function AircraftScrollExperience() {
  const rootRef = useRef<HTMLElement | null>(null)
  const mountRef = useRef<HTMLDivElement | null>(null)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const mount = mountRef.current
    const root = rootRef.current
    let lastStep = -1

    if (!mount || !root) return
    const mountElement = mount
    const rootElement = root

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog("#06255b", 8, 22)

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.set(0, 1.4, 10)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.dataset.aviationScene = "true"
    renderer.domElement.dataset.progress = "0"
    renderer.domElement.dataset.parts = "0"
    mountElement.appendChild(renderer.domElement)

    const group = new THREE.Group()
    group.rotation.set(0.12, -0.28, -0.05)
    scene.add(group)

    const white = makeMaterial("#f7f4ed", 0.34, 0.2)
    const navy = makeMaterial("#092b63", 0.38, 0.32)
    const gold = makeMaterial("#f6a915", 0.36, 0.18)
    const glass = new THREE.MeshPhysicalMaterial({
      color: "#9ed5ff",
      roughness: 0.12,
      metalness: 0,
      transmission: 0.25,
      transparent: true,
      opacity: 0.58,
    })

    const parts: Part[] = []

    function addPart(
      mesh: THREE.Object3D,
      position: [number, number, number],
      exploded: [number, number, number],
      rotation: [number, number, number] = [0, 0, 0],
      explodedRotation: [number, number, number] = rotation
    ) {
      mesh.position.set(...position)
      mesh.rotation.set(...rotation)
      group.add(mesh)
      parts.push({
        mesh,
        base: mesh.position.clone(),
        exploded: new THREE.Vector3(...exploded),
        baseRotation: mesh.rotation.clone(),
        explodedRotation: new THREE.Euler(...explodedRotation),
      })
    }

    const fuselage = new THREE.Mesh(new THREE.CapsuleGeometry(0.56, 4.8, 12, 32), white)
    addPart(fuselage, [0, 0, 0], [0, 0, 0], [0, 0, Math.PI / 2])

    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.57, 0.92, 32), white)
    addPart(nose, [2.9, 0, 0], [3.4, 0.18, 0.12], [0, 0, -Math.PI / 2], [0.14, -0.16, -Math.PI / 2])

    const tailCone = new THREE.Mesh(new THREE.ConeGeometry(0.48, 0.88, 32), navy)
    addPart(tailCone, [-2.9, 0, 0], [-3.5, 0.42, -0.18], [0, 0, Math.PI / 2], [-0.12, 0.18, Math.PI / 2])

    const wingGeometry = new THREE.BoxGeometry(3.8, 0.1, 1.22)
    const leftWing = new THREE.Mesh(wingGeometry, navy)
    addPart(leftWing, [0, -0.08, 0.84], [-0.62, -0.36, 2.82], [0, -0.2, -0.03], [0.08, -0.42, -0.12])
    const rightWing = new THREE.Mesh(wingGeometry, navy)
    addPart(rightWing, [0, -0.08, -0.84], [-0.62, -0.36, -2.82], [0, 0.2, 0.03], [-0.08, 0.42, 0.12])

    const tailWingGeometry = new THREE.BoxGeometry(1.55, 0.08, 0.55)
    const leftTailWing = new THREE.Mesh(tailWingGeometry, navy)
    addPart(leftTailWing, [-2.15, 0.16, 0.5], [-2.84, 0.9, 1.55], [0, -0.3, 0.08], [0.25, -0.55, 0.18])
    const rightTailWing = new THREE.Mesh(tailWingGeometry, navy)
    addPart(rightTailWing, [-2.15, 0.16, -0.5], [-2.84, 0.9, -1.55], [0, 0.3, -0.08], [-0.25, 0.55, -0.18])

    const tailFin = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.15, 0.54), navy)
    addPart(tailFin, [-2.35, 0.78, 0], [-3.02, 1.78, 0.1], [0, 0, -0.18], [0.24, -0.12, -0.44])

    const engineGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.68, 32)
    const leftEngine = new THREE.Mesh(engineGeometry, navy)
    addPart(leftEngine, [0.55, -0.54, 1.04], [1.24, -1.14, 2.22], [Math.PI / 2, 0, 0], [Math.PI / 2, 0.35, -0.2])
    const rightEngine = new THREE.Mesh(engineGeometry, navy)
    addPart(rightEngine, [0.55, -0.54, -1.04], [1.24, -1.14, -2.22], [Math.PI / 2, 0, 0], [Math.PI / 2, -0.35, 0.2])

    const windowGroup = new THREE.Group()
    for (let i = 0; i < 9; i += 1) {
      const windowMesh = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.06, 0.04), glass)
      windowMesh.position.set(1.56 - i * 0.34, 0.24, 0.55)
      windowGroup.add(windowMesh)
    }
    addPart(windowGroup, [0, 0, 0], [0.12, 0.58, 1.2], [0, 0, 0], [0.16, -0.16, 0.04])

    const stripe = new THREE.Mesh(new THREE.BoxGeometry(3.85, 0.07, 0.045), gold)
    addPart(stripe, [0.15, -0.04, 0.56], [0.34, -0.88, 1.48], [0, 0, 0], [0.18, -0.1, -0.08])

    const ambient = new THREE.HemisphereLight("#d7ecff", "#092b63", 2.2)
    scene.add(ambient)

    const key = new THREE.DirectionalLight("#fff2d2", 4.5)
    key.position.set(4, 5, 6)
    scene.add(key)

    const rim = new THREE.DirectionalLight("#6db5ff", 2.8)
    rim.position.set(-6, 1, -4)
    scene.add(rim)

    const starGeometry = new THREE.BufferGeometry()
    const starPositions = new Float32Array(160 * 3)
    for (let i = 0; i < 160; i += 1) {
      starPositions[i * 3] = (Math.random() - 0.5) * 22
      starPositions[i * 3 + 1] = (Math.random() - 0.2) * 12
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 14
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3))
    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({ color: "#f6a915", size: 0.025, transparent: true, opacity: 0.55 })
    )
    scene.add(stars)

    let frame = 0
    let scrollProgress = 0
    let pointerX = 0
    let pointerY = 0

    function resize() {
      const width = mountElement.clientWidth
      const height = mountElement.clientHeight
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    function updateProgress() {
      const rect = rootElement.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      scrollProgress = clamp(-rect.top / Math.max(total, 1))
      renderer.domElement.dataset.progress = scrollProgress.toFixed(3)

      const nextStep = Math.min(copy.length - 1, Math.floor(scrollProgress * copy.length))
      if (nextStep !== lastStep) {
        lastStep = nextStep
        setActiveStep(nextStep)
      }
    }

    function animate() {
      frame = requestAnimationFrame(animate)
      const progress = easeInOut(scrollProgress)
      const explode = easeInOut(clamp((scrollProgress - 0.12) / 0.34))
      const assemble = easeInOut(clamp((scrollProgress - 0.62) / 0.3))
      const reveal = clamp(explode * (1 - assemble))

      for (const part of parts) {
        part.mesh.position.lerpVectors(part.base, part.exploded, reveal)
        part.mesh.rotation.x = THREE.MathUtils.lerp(part.baseRotation.x, part.explodedRotation.x, reveal)
        part.mesh.rotation.y = THREE.MathUtils.lerp(part.baseRotation.y, part.explodedRotation.y, reveal)
        part.mesh.rotation.z = THREE.MathUtils.lerp(part.baseRotation.z, part.explodedRotation.z, reveal)
      }

      group.rotation.y = -0.28 + Math.sin(progress * Math.PI) * 0.72 + pointerX * 0.08
      group.rotation.x = 0.12 + progress * 0.22 + pointerY * 0.06
      group.rotation.z = -0.05 + progress * 0.18
      group.position.y = -0.15 + Math.sin(progress * Math.PI) * 0.18
      group.position.x = THREE.MathUtils.lerp(0.1, 1.2, assemble) - reveal * 0.12
      stars.rotation.y += 0.0008
      stars.rotation.x = progress * 0.12
      camera.position.z = 9.4 - progress * 1.4
      renderer.render(scene, camera)
      renderer.domElement.dataset.rendered = "true"
    }

    const onPointerMove = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 2
      pointerY = (event.clientY / window.innerHeight - 0.5) * -2
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mountElement)
    window.addEventListener("scroll", updateProgress, { passive: true })
    window.addEventListener("pointermove", onPointerMove, { passive: true })

    resize()
    updateProgress()
    renderer.domElement.dataset.parts = String(parts.length)
    animate()

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener("scroll", updateProgress)
      window.removeEventListener("pointermove", onPointerMove)
      renderer.dispose()
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
      mountElement.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <section ref={rootRef} className="relative min-h-[310svh] bg-[#06255b] text-white">
      <div className="sticky top-0 min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#06255b_0%,#041b42_100%)]" />
        <div
          ref={mountRef}
          className="absolute inset-0 h-screen w-full"
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(4,27,66,0.82)_0%,rgba(4,27,66,0.34)_36%,rgba(4,27,66,0.1)_100%)]" />
        <div className="pointer-events-none relative z-10 mx-auto grid min-h-screen max-w-7xl items-end gap-10 px-5 pb-16 pt-24 sm:px-8 lg:grid-cols-[410px_1fr] lg:items-center lg:pb-24">
          <div className="relative min-h-64">
            {copy.map((item, index) => (
              <article
                key={item.kicker}
                className={`absolute inset-x-0 bottom-0 rounded-lg border border-white/12 bg-[#041b42]/76 p-5 shadow-2xl shadow-black/20 backdrop-blur-md transition-all duration-500 lg:bottom-auto lg:top-0 ${
                  activeStep === index
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f6a915]">
                  {item.kicker}
                </p>
                <h2 className="mt-3 text-balance text-3xl font-bold leading-tight sm:text-4xl">
                  {item.title}
                </h2>
                <p className="mt-4 text-sm leading-6 text-white/78">{item.body}</p>
              </article>
            ))}
          </div>
          <div className="hidden lg:block" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#06255b] to-transparent" />
      </div>
    </section>
  )
}
