import React, { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import {
  createPectoralMuscleGeo,
  createAbdominalBlockGeo,
  createObliqueFlankGeo,
  createDeltoidCapGeo,
  createBicepsBellyGeo,
  createForearmMassGeo,
  createRectusFemorisGeo,
  createVastusLateralisGeo,
  createVastusMedialisGeo,
  createCalfMuscleGeo,
  createLatissimusWingGeo,
  createTrapeziusDiamondGeo,
  createGluteusMaximusGeo,
  createHamstringColumnGeo,
  createAnatomicalHeadGeo,
  createNeckAnatomyGeo,
} from './anatomicalMeshGenerator'

// Muscle groups and their authentic reference color palette (matching user's reference image)
const MUSCLE_REFERENCE_COLORS = {
  chest: 0xF87171,          // Coral / Salmon Pink (#F87171)
  deltoids: 0xC084FC,       // Lilac Purple (#C084FC)
  biceps: 0xA78BFA,         // Lavender Violet (#A78BFA)
  forearms: 0x4ADE80,       // Mint Green (#4ADE80)
  abs: 0xF472B6,            // Rose Pink 6-Pack (#F472B6)
  obliques: 0x6366F1,       // Slate Indigo (#6366F1)
  pelvis: 0x475569,         // Deep Slate Blue (#475569)
  'quad-rectus': 0x84CC16,  // Lime Green (#84CC16)
  'quad-lateral': 0x38BDF8, // Sky Blue (#38BDF8)
  'quad-medial': 0xFB7185,  // Soft Rose (#FB7185)
  'upper-back': 0xBE185D,   // Ruby Plum Trapezius (#BE185D)
  lats: 0x0EA5E9,           // Cyan/Teal Lat Wings (#0EA5E9)
  glutes: 0x9D174D,         // Deep Plum (#9D174D)
  hamstring: 0xE11D48,      // Deep Rose Hamstrings (#E11D48)
  calves: 0xA855F7,         // Royal Violet Gastrocnemius (#A855F7)
  shins: 0x22C55E,          // Mint Green Tibialis (#22C55E)
  bone: 0xE2E8F0,           // Alabaster Bone / Tendon (#E2E8F0)
}

// Interactive 3D Annotation Pins matching the user's reference screenshot
const ANNOTATION_PINS = [
  // Anterior (Front View)
  { id: '9', muscle: 'chest', label: 'Chest (Pectoralis)', pos: [0, 1.20, 0.17], isFront: true },
  { id: '7', muscle: 'deltoids', label: 'Deltoid (Shoulder)', pos: [0.46, 1.30, 0.08], isFront: true },
  { id: '8', muscle: 'biceps', label: 'Arm & Forearm', pos: [-0.56, 0.82, 0.10], isFront: true },
  { id: '6', muscle: 'abs', label: 'Oblique & Core', pos: [0.26, 0.76, 0.13], isFront: true },
  { id: '5', muscle: 'abs', label: 'Pelvis / Base', pos: [0, 0.46, 0.14], isFront: true },
  { id: '4', muscle: 'quadriceps', label: 'Quadriceps', pos: [-0.18, 0.18, 0.16], isFront: true },
  // Posterior (Back View)
  { id: '1', muscle: 'upper-back', label: 'Trapezius', pos: [0, 1.36, -0.14], isFront: false },
  { id: '2', muscle: 'upper-back', label: 'Latissimus Dorsi', pos: [0.24, 1.04, -0.14], isFront: false },
  { id: '3', muscle: 'hamstring', label: 'Gluteus Maximus', pos: [-0.16, 0.52, -0.16], isFront: false },
  { id: '10', muscle: 'hamstring', label: 'Hamstrings', pos: [-0.18, 0.16, -0.15], isFront: false },
  { id: '11', muscle: 'calves', label: 'Calves (Gastrocnemius)', pos: [-0.18, -0.42, -0.14], isFront: false },
]

export default function ThreeBodyMuscleViewer({
  selectedMuscle = 'chest',
  onSelectMuscle,
  recoveryData = {}
}) {
  const containerRef = useRef(null)
  const [viewMode, setViewMode] = useState('ecorche') // 'ecorche' | 'sketchfab'
  const [calloutCoords, setCalloutCoords] = useState(null)
  const [pinScreenCoords, setPinScreenCoords] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const isDraggingRef = useRef(false)
  const prevMouseRef = useRef({ x: 0, y: 0 })
  const rotationRef = useRef({ x: 0.05, y: 0 })
  const targetRotationRef = useRef({ x: 0.05, y: 0 })
  const zoomRef = useRef(5.2)

  const selectedMuscleRef = useRef(selectedMuscle)
  selectedMuscleRef.current = selectedMuscle

  const onSelectMuscleRef = useRef(onSelectMuscle)
  onSelectMuscleRef.current = onSelectMuscle

  // Camera target angles for each muscle
  const getTargetRotationForMuscle = useCallback((muscle) => {
    switch (muscle) {
      case 'upper-back':
      case 'hamstring':
      case 'calves':
        return { x: 0.05, y: Math.PI } // 180° posterior view
      case 'deltoids':
        return { x: 0.05, y: Math.PI * 0.28 } // 50° angle
      case 'biceps':
        return { x: 0.05, y: -Math.PI * 0.28 } // -50° angle
      case 'chest':
      case 'abs':
      case 'quadriceps':
      default:
        return { x: 0.05, y: 0 } // 0° anterior view
    }
  }, [])

  // When selectedMuscle changes, update target rotation
  useEffect(() => {
    const target = getTargetRotationForMuscle(selectedMuscle)
    targetRotationRef.current = target
  }, [selectedMuscle, getTargetRotationForMuscle])

  // Single mount effect for Three.js engine
  useEffect(() => {
    if (viewMode !== 'ecorche') return

    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 400
    const height = container.clientHeight || 460

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
    camera.position.set(0, 0.12, zoomRef.current)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    // Lights for sculpted anatomical rendering
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.25)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.45)
    keyLight.position.set(2.5, 4, 4)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xcfd8dc, 0.85)
    fillLight.position.set(-3, 2, 3)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(0x60a5fa, 1.2)
    rimLight.position.set(0, 3, -4.5)
    scene.add(rimLight)

    // Body Root Group
    const bodyGroup = new THREE.Group()
    bodyGroup.position.set(0, -0.05, 0)
    scene.add(bodyGroup)

    // Collection of all muscle meshes with their color keys and group associations
    const muscleEntries = []

    const addMuscle = (geo, muscleSlug, colorKey, pos, rot = [0, 0, 0], scale = [1, 1, 1]) => {
      const defaultHex = MUSCLE_REFERENCE_COLORS[colorKey] || 0xCBD5E1
      const mat = new THREE.MeshStandardMaterial({
        color: defaultHex,
        roughness: 0.38,
        metalness: 0.08,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(pos[0], pos[1], pos[2])
      mesh.rotation.set(rot[0], rot[1], rot[2])
      mesh.scale.set(scale[0], scale[1], scale[2])
      mesh.userData = {
        muscle: muscleSlug,
        defaultHex: defaultHex,
      }
      bodyGroup.add(mesh)
      muscleEntries.push({ mesh, muscleSlug, defaultHex })
      return mesh
    }

    // ========================================================
    // BUILD REALISTIC ANATOMICAL ECORCHE HUMAN BODY (NO ROBOT DUMMIES)
    // ========================================================

    // 1. Anatomical Head & Neck
    addMuscle(createAnatomicalHeadGeo(), 'head', 'bone', [0, 1.62, 0])
    addMuscle(createNeckAnatomyGeo(), 'neck', 'deltoids', [0, 1.42, 0])

    // 2. Trapezius / Upper Back (Diamond anatomical back)
    addMuscle(createTrapeziusDiamondGeo(), 'upper-back', 'upper-back', [0, 1.34, -0.04])

    // 3. Pectoralis Major (Chest Fan Left & Right)
    addMuscle(createPectoralMuscleGeo(true), 'chest', 'chest', [-0.14, 1.18, 0.11], [0.05, 0.12, -0.05])
    addMuscle(createPectoralMuscleGeo(false), 'chest', 'chest', [0.14, 1.18, 0.11], [0.05, -0.12, 0.05])

    // 4. Latissimus Dorsi (V-Taper Wings Left & Right)
    addMuscle(createLatissimusWingGeo(true), 'upper-back', 'lats', [-0.22, 1.05, -0.06], [0, 0, -0.1])
    addMuscle(createLatissimusWingGeo(false), 'upper-back', 'lats', [0.22, 1.05, -0.06], [0, 0, 0.1])

    // 5. Rectus Abdominis (Anatomical 6-Pack Segmented Blocks)
    const absYOffsets = [1.02, 0.90, 0.78]
    absYOffsets.forEach((y, idx) => {
      addMuscle(createAbdominalBlockGeo(), 'abs', 'abs', [-0.07, y, 0.11], [0, 0, 0], [0.95, 0.95, 0.95])
      addMuscle(createAbdominalBlockGeo(), 'abs', 'abs', [0.07, y, 0.11], [0, 0, 0], [0.95, 0.95, 0.95])
    })

    // External Obliques (Rib Huggers Left & Right)
    addMuscle(createObliqueFlankGeo(true), 'abs', 'obliques', [-0.24, 0.86, 0.04], [0, 0, -0.12])
    addMuscle(createObliqueFlankGeo(false), 'abs', 'obliques', [0.24, 0.86, 0.04], [0, 0, 0.12])

    // 6. Shoulders (Deltoids 3-Head Caps Left & Right)
    addMuscle(createDeltoidCapGeo(true), 'deltoids', 'deltoids', [-0.40, 1.28, 0], [0.05, 0, 0.22])
    addMuscle(createDeltoidCapGeo(false), 'deltoids', 'deltoids', [0.40, 1.28, 0], [0.05, 0, -0.22])

    // 7. Arms - Biceps (Anterior Arms Left & Right)
    addMuscle(createBicepsBellyGeo(), 'biceps', 'biceps', [-0.46, 1.02, 0.03], [0.08, 0, -0.12])
    addMuscle(createBicepsBellyGeo(), 'biceps', 'biceps', [0.46, 1.02, 0.03], [0.08, 0, 0.12])

    // Arms - Triceps (Posterior Arms Left & Right)
    addMuscle(createBicepsBellyGeo(), 'biceps', 'biceps', [-0.46, 1.02, -0.04], [-0.08, 0, -0.12])
    addMuscle(createBicepsBellyGeo(), 'biceps', 'biceps', [0.46, 1.02, -0.04], [-0.08, 0, 0.12])

    // Arms - Forearms (Mint Anatomical Forearms Left & Right)
    addMuscle(createForearmMassGeo(), 'biceps', 'forearms', [-0.52, 0.68, 0.02], [0, 0, -0.1])
    addMuscle(createForearmMassGeo(), 'biceps', 'forearms', [0.52, 0.68, 0.02], [0, 0, 0.1])

    // 8. Pelvis & Gluteus
    addMuscle(createAbdominalBlockGeo(), 'abs', 'pelvis', [0, 0.58, 0.06], [0, 0, 0], [1.4, 1.1, 1.1])
    addMuscle(createGluteusMaximusGeo(true), 'hamstring', 'glutes', [-0.14, 0.52, -0.09], [0, 0, 0])
    addMuscle(createGluteusMaximusGeo(false), 'hamstring', 'glutes', [0.14, 0.52, -0.09], [0, 0, 0])

    // 9. Quadriceps (Multi-Part Sculpted Thighs)
    // Rectus Femoris (Lime Central)
    addMuscle(createRectusFemorisGeo(), 'quadriceps', 'quad-rectus', [-0.18, 0.18, 0.06], [-0.04, 0, -0.04])
    addMuscle(createRectusFemorisGeo(), 'quadriceps', 'quad-rectus', [0.18, 0.18, 0.06], [-0.04, 0, 0.04])

    // Vastus Lateralis (Sky Blue Outer)
    addMuscle(createVastusLateralisGeo(true), 'quadriceps', 'quad-lateral', [-0.22, 0.20, 0.04], [-0.03, 0, -0.05])
    addMuscle(createVastusLateralisGeo(false), 'quadriceps', 'quad-lateral', [0.22, 0.20, 0.04], [-0.03, 0, 0.05])

    // Vastus Medialis (Teardrop Inner)
    addMuscle(createVastusMedialisGeo(true), 'quadriceps', 'quad-medial', [-0.14, 0.02, 0.07], [-0.02, 0, -0.02])
    addMuscle(createVastusMedialisGeo(false), 'quadriceps', 'quad-medial', [0.14, 0.02, 0.07], [-0.02, 0, 0.02])

    // 10. Hamstrings (Posterior Thigh Columns Left & Right)
    addMuscle(createHamstringColumnGeo(), 'hamstring', 'hamstring', [-0.18, 0.18, -0.06], [0.04, 0, -0.04])
    addMuscle(createHamstringColumnGeo(), 'hamstring', 'hamstring', [0.18, 0.18, -0.06], [0.04, 0, 0.04])

    // Knees (Patellar Landmark)
    addMuscle(createAbdominalBlockGeo(), 'quadriceps', 'bone', [-0.18, -0.12, 0.04], [0, 0, 0], [0.55, 0.55, 0.55])
    addMuscle(createAbdominalBlockGeo(), 'quadriceps', 'bone', [0.18, -0.12, 0.04], [0, 0, 0], [0.55, 0.55, 0.55])

    // 11. Calves & Shins (Gastrocnemius Purple & Tibialis Mint)
    addMuscle(createCalfMuscleGeo(true), 'calves', 'calves', [-0.18, -0.42, -0.04], [0.04, 0, 0])
    addMuscle(createCalfMuscleGeo(false), 'calves', 'calves', [0.18, -0.42, -0.04], [0.04, 0, 0])

    addMuscle(createForearmMassGeo(), 'calves', 'shins', [-0.18, -0.42, 0.04], [-0.04, 0, 0], [0.85, 1, 0.85])
    addMuscle(createForearmMassGeo(), 'calves', 'shins', [0.18, -0.42, 0.04], [-0.04, 0, 0], [0.85, 1, 0.85])

    // Raycaster for 3D Mesh Click Picking
    const raycaster = new THREE.Raycaster()
    const mouseVector = new THREE.Vector2()

    const onPointerClick = (e) => {
      if (isDraggingRef.current) return
      const rect = renderer.domElement.getBoundingClientRect()
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouseVector, camera)
      const meshes = muscleEntries.map(entry => entry.mesh)
      const hits = raycaster.intersectObjects(meshes, false)
      if (hits.length > 0 && hits[0].object.userData.muscle) {
        const hitSlug = hits[0].object.userData.muscle
        if (hitSlug !== 'head' && hitSlug !== 'neck') {
          if (onSelectMuscleRef.current) onSelectMuscleRef.current(hitSlug)
        }
      }
    }

    renderer.domElement.addEventListener('click', onPointerClick)

    const handleResize = () => {
      if (!container || !renderer || !camera) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    // Animation Loop
    let animId = null
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()

      // Smooth Rotation Lerp towards target
      if (!isDraggingRef.current) {
        rotationRef.current.y += (targetRotationRef.current.y - rotationRef.current.y) * 0.1
        rotationRef.current.x += (targetRotationRef.current.x - rotationRef.current.x) * 0.1
      }

      bodyGroup.rotation.y = rotationRef.current.y
      bodyGroup.rotation.x = rotationRef.current.x
      camera.position.z = zoomRef.current

      // SELECTED MUSCLE HIGHLIGHTING RULE:
      // Active muscle turns Obsidian Black (#09090b) with subtle glowing edge pulse
      // ALL other muscles stay in their authentic reference color palette!
      const pulseIntensity = 0.8 + Math.sin(time * 4) * 0.3
      const currentActiveSlug = selectedMuscleRef.current

      let selectedAnchorWorldPos = null

      muscleEntries.forEach(({ mesh, muscleSlug, defaultHex }) => {
        const isSelected = muscleSlug === currentActiveSlug
        if (isSelected) {
          // USER'S INSTRUCTION: Selected muscle turns black with glowing contrast
          mesh.material.color.setHex(0x111827) // Obsidian Sleek Black
          mesh.material.emissive.setHex(0x2563EB) // Electric Cyan/Blue Edge Pulse
          mesh.material.emissiveIntensity = pulseIntensity * 0.8
          mesh.material.roughness = 0.22
          mesh.material.metalness = 0.15

          if (!selectedAnchorWorldPos) {
            const worldVec = new THREE.Vector3()
            mesh.getWorldPosition(worldVec)
            selectedAnchorWorldPos = worldVec
          }
        } else {
          // Authentic reference colors preserved across all other muscles
          mesh.material.color.setHex(defaultHex)
          mesh.material.emissive.setHex(0x000000)
          mesh.material.emissiveIntensity = 0
          mesh.material.roughness = 0.38
          mesh.material.metalness = 0.08
        }
      })

      // Project 3D Annotation Pins to 2D Screen Space
      const rect = renderer.domElement.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        const projectedPins = ANNOTATION_PINS.map(pin => {
          const pinPos = new THREE.Vector3(pin.pos[0], pin.pos[1], pin.pos[2])
          pinPos.applyEuler(bodyGroup.rotation)
          pinPos.add(bodyGroup.position)

          // Check if pin is facing camera or occluded
          const toCamera = camera.position.clone().sub(pinPos).normalize()
          const localNormal = new THREE.Vector3(0, 0, pin.isFront ? 1 : -1).applyEuler(bodyGroup.rotation)
          const dot = localNormal.dot(toCamera)
          const isVisible = dot > -0.25 // visible with slight margin

          const proj = pinPos.clone().project(camera)
          const screenX = ((proj.x + 1) / 2) * rect.width
          const screenY = ((-proj.y + 1) / 2) * rect.height

          return {
            ...pin,
            screenX,
            screenY,
            isVisible,
            isActive: pin.muscle === currentActiveSlug
          }
        })
        setPinScreenCoords(projectedPins)
      }

      // Project 3D muscle position to 2D screen coordinates for callout pointer line
      if (selectedAnchorWorldPos) {
        const projected = selectedAnchorWorldPos.clone().project(camera)
        const screenX = ((projected.x + 1) / 2) * rect.width
        const screenY = ((-projected.y + 1) / 2) * rect.height
        setCalloutCoords({ x: screenX, y: screenY })
      }

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      if (animId) cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      renderer.domElement.removeEventListener('click', onPointerClick)
      renderer.dispose()
    }
  }, [viewMode])

  // Mouse & Touch Orbit Controls (360-Degree Dragging)
  const handlePointerDown = (e) => {
    isDraggingRef.current = false
    prevMouseRef.current = { x: e.clientX, y: e.clientY }
  }

  const handlePointerMove = (e) => {
    if (e.buttons !== 1 && e.type !== 'touchmove') return
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0

    const dx = clientX - prevMouseRef.current.x
    const dy = clientY - prevMouseRef.current.y

    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      isDraggingRef.current = true
      setIsDragging(true)
    }

    rotationRef.current.y += dx * 0.012
    rotationRef.current.x = Math.max(-0.45, Math.min(0.45, rotationRef.current.x + dy * 0.008))
    targetRotationRef.current.y = rotationRef.current.y
    targetRotationRef.current.x = rotationRef.current.x

    prevMouseRef.current = { x: clientX, y: clientY }
  }

  const handlePointerUp = () => {
    setTimeout(() => {
      isDraggingRef.current = false
      setIsDragging(false)
    }, 50)
  }

  const handleWheel = (e) => {
    zoomRef.current = Math.max(3.8, Math.min(6.8, zoomRef.current + e.deltaY * 0.003))
  }

  // Quick Rotate Controls
  const rotateLeft = (e) => {
    e.stopPropagation()
    targetRotationRef.current.y -= Math.PI * 0.5
  }
  const rotateRight = (e) => {
    e.stopPropagation()
    targetRotationRef.current.y += Math.PI * 0.5
  }
  const resetOrientation = (e) => {
    e.stopPropagation()
    const target = getTargetRotationForMuscle(selectedMuscle)
    targetRotationRef.current = target
    zoomRef.current = 5.2
  }

  const activeDetail = recoveryData[selectedMuscle] || {
    name: 'Chest',
    recovery: 94,
    topEx: 'Incline Barbell Bench Press'
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '470px',
        userSelect: 'none',
        overflow: 'hidden',
        borderRadius: '20px',
        background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
    >
      {/* View Mode Toggle: Interactive 3D Anatomy vs Sketchfab Model */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid #CBD5E1',
          padding: '3px',
          borderRadius: '9999px',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.06)',
          zIndex: 20,
        }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); setViewMode('ecorche') }}
          style={{
            padding: '5px 14px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '11px',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: viewMode === 'ecorche' ? '#2563EB' : 'transparent',
            color: viewMode === 'ecorche' ? '#FFFFFF' : '#64748B',
            boxShadow: viewMode === 'ecorche' ? '0 2px 8px rgba(37,99,235,0.35)' : 'none',
          }}
        >
          3D Anatomy Map
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setViewMode('sketchfab') }}
          style={{
            padding: '5px 14px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '11px',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: viewMode === 'sketchfab' ? '#2563EB' : 'transparent',
            color: viewMode === 'sketchfab' ? '#FFFFFF' : '#64748B',
            boxShadow: viewMode === 'sketchfab' ? '0 2px 8px rgba(37,99,235,0.35)' : 'none',
          }}
        >
          Sketchfab Ecorche 3D
        </button>
      </div>

      {/* Top Left: 360° Drag Indicator Badge */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #CBD5E1',
          padding: '6px 12px',
          borderRadius: '9999px',
          fontSize: '11px',
          fontWeight: 700,
          color: '#334155',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
        </svg>
        <span>Drag to Rotate 360°</span>
      </div>

      {/* Top Right: Rotation & Zoom Reset Controls */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          right: 14,
          display: 'flex',
          gap: 6,
          zIndex: 20,
        }}
      >
        <button
          onClick={rotateLeft}
          title="Rotate Left 90°"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'rgba(255, 255, 255, 0.92)',
            border: '1px solid #CBD5E1',
            color: '#0F172A',
            fontSize: 14,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
          }}
        >
          ↺
        </button>
        <button
          onClick={rotateRight}
          title="Rotate Right 90°"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'rgba(255, 255, 255, 0.92)',
            border: '1px solid #CBD5E1',
            color: '#0F172A',
            fontSize: 14,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
          }}
        >
          ↻
        </button>
        <button
          onClick={resetOrientation}
          title="Reset Zoom & View"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'rgba(255, 255, 255, 0.92)',
            border: '1px solid #CBD5E1',
            color: '#2563EB',
            fontSize: 14,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
          }}
        >
          ⌕
        </button>
      </div>

      {/* Main Viewport Content */}
      {viewMode === 'ecorche' ? (
        <>
          {/* Three.js Canvas Container */}
          <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

          {/* Interactive 3D Annotation Number Pins (Matching 2nd Reference Image) */}
          {pinScreenCoords.map((pin) => {
            if (!pin.isVisible) return null
            return (
              <div
                key={pin.id}
                onClick={(e) => {
                  e.stopPropagation()
                  if (onSelectMuscleRef.current) {
                    onSelectMuscleRef.current(pin.muscle)
                  }
                }}
                title={pin.label}
                style={{
                  position: 'absolute',
                  left: `${pin.screenX}px`,
                  top: `${pin.screenY}px`,
                  transform: 'translate(-50%, -50%)',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: pin.isActive ? '#09090B' : '#1E293B',
                  border: pin.isActive ? '2.5px solid #38BDF8' : '2.5px solid #FFFFFF',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: pin.isActive
                    ? '0 0 12px rgba(56, 189, 248, 0.8), 0 3px 8px rgba(0,0,0,0.4)'
                    : '0 3px 8px rgba(0,0,0,0.3)',
                  transition: 'transform 0.15s ease, background 0.2s',
                  zIndex: pin.isActive ? 15 : 12,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.0)'
                }}
              >
                {pin.id}
              </div>
            )
          })}

          {/* Dynamic 3D-to-2D Callout Pointer Line & Floating Badge */}
          {calloutCoords && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 14,
              }}
            >
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                {/* Glowing Anchor Point at 3D Muscle */}
                <circle
                  cx={calloutCoords.x}
                  cy={calloutCoords.y}
                  r="4.5"
                  fill="#2563EB"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                {/* Callout Indicator Line */}
                <line
                  x1={calloutCoords.x}
                  y1={calloutCoords.y}
                  x2={Math.min(calloutCoords.x + 50, 310)}
                  y2={Math.max(calloutCoords.y - 35, 60)}
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                />
              </svg>

              {/* Floating Callout Glass Card */}
              <div
                style={{
                  position: 'absolute',
                  left: `${Math.min(calloutCoords.x + 55, 315)}px`,
                  top: `${Math.max(calloutCoords.y - 55, 45)}px`,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1.5px solid #2563EB',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  boxShadow: '0 8px 24px rgba(37, 99, 235, 0.18)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  minWidth: '130px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase' }}>
                    {activeDetail.name}
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#16A34A', background: '#DCFCE7', padding: '1px 5px', borderRadius: 4 }}>
                    {activeDetail.recovery}%
                  </span>
                </div>
                <span style={{ fontSize: '10px', color: '#64748B' }}>
                  {activeDetail.topEx}
                </span>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Sketchfab Official 3D Anatomy Model Viewer (Original Ecorche Model) */
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <iframe
            title="Écorché Male Musclenames Anatomy"
            src="https://sketchfab.com/models/33162ec759e04d2985dbbdf4ec908d66/embed?autostart=1&ui_controls=1&ui_infos=0&ui_watermark=0&annotations_visible=1"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            style={{
              width: '100%',
              height: '100%',
              border: 0,
              borderRadius: '20px',
            }}
          />
        </div>
      )}
    </div>
  )
}
