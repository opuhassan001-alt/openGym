import * as THREE from 'three'

/**
 * Procedural Anatomical Ecorche Geometry Synthesizer
 * Generates smooth, organic human muscle geometries with continuous normals
 * (NO primitive cylinders, spheres, or boxes).
 */

// Helper: Creates an organic lofted muscle belly along a curve
export function createLoftedMuscleGeo({
  height = 1.0,
  tubularSegments = 24,
  radialSegments = 20,
  profile = (t) => ({ rx: 0.2, rz: 0.2, cx: 0, cz: 0, flatten: 0 })
}) {
  const geom = new THREE.BufferGeometry()
  const positions = []
  const indices = []

  for (let i = 0; i <= tubularSegments; i++) {
    const t = i / tubularSegments
    const { rx, rz, cx = 0, cz = 0, flatten = 0, skewX = 0 } = profile(t)
    const y = (t - 0.5) * height

    for (let j = 0; j <= radialSegments; j++) {
      const u = (j / radialSegments) * Math.PI * 2
      let cosU = Math.cos(u)
      let sinU = Math.sin(u)

      // Apply flattening on anterior or posterior surface
      let radZ = rz
      if (flatten > 0 && sinU > 0) radZ *= 1 - flatten
      if (flatten < 0 && sinU < 0) radZ *= 1 + flatten

      const px = cx + cosU * rx + skewX * (1 - Math.abs(cosU))
      const py = y
      const pz = cz + sinU * radZ

      positions.push(px, py, pz)
    }
  }

  for (let i = 0; i < tubularSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * (radialSegments + 1) + j
      const b = (i + 1) * (radialSegments + 1) + j
      const c = (i + 1) * (radialSegments + 1) + (j + 1)
      const d = i * (radialSegments + 1) + (j + 1)

      indices.push(a, b, d)
      indices.push(b, c, d)
    }
  }

  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geom.setIndex(indices)
  geom.computeVertexNormals()
  return geom
}

// 1. Pectoralis Major (Chest Fan)
export function createPectoralMuscleGeo(isLeft = true) {
  const dir = isLeft ? -1 : 1
  return createLoftedMuscleGeo({
    height: 0.32,
    tubularSegments: 20,
    radialSegments: 20,
    profile: (t) => {
      // Sternal head tapers, belly swells, humeral insertion thins
      const swell = Math.sin(t * Math.PI)
      return {
        rx: 0.16 + swell * 0.1,
        rz: 0.08 + swell * 0.07,
        cx: dir * (0.02 + (1 - t) * 0.05),
        cz: 0.03 * swell,
        flatten: 0.25, // organic flat sternal plane
        skewX: dir * 0.03 * swell
      }
    }
  })
}

// 2. Rectus Abdominis Block (Single 6-Pack Cushion)
export function createAbdominalBlockGeo() {
  return createLoftedMuscleGeo({
    height: 0.11,
    tubularSegments: 14,
    radialSegments: 16,
    profile: (t) => {
      const swell = Math.sin(t * Math.PI)
      return {
        rx: 0.11 + swell * 0.03,
        rz: 0.06 + swell * 0.04,
        cx: 0,
        cz: 0.02 * swell,
        flatten: 0.2
      }
    }
  })
}

// 3. External Oblique Flank (Rib to Iliac Crest)
export function createObliqueFlankGeo(isLeft = true) {
  const dir = isLeft ? -1 : 1
  return createLoftedMuscleGeo({
    height: 0.38,
    tubularSegments: 20,
    radialSegments: 18,
    profile: (t) => {
      const swell = Math.sin(t * Math.PI)
      return {
        rx: 0.08 + swell * 0.05,
        rz: 0.12 + swell * 0.04,
        cx: dir * (0.01 + swell * 0.02),
        cz: 0,
        flatten: 0.15,
        skewX: dir * 0.02
      }
    }
  })
}

// 4. Deltoid Muscle Cap (3-Head Shoulder)
export function createDeltoidCapGeo(isLeft = true) {
  const dir = isLeft ? -1 : 1
  return createLoftedMuscleGeo({
    height: 0.30,
    tubularSegments: 20,
    radialSegments: 22,
    profile: (t) => {
      // Teardrop: broad at clavicle/acromion (t=1), swelling at belly, tapering to humerus (t=0)
      const swell = Math.sin(t * Math.PI * 0.85 + 0.15)
      return {
        rx: 0.12 + swell * 0.07,
        rz: 0.13 + swell * 0.06,
        cx: dir * (swell * 0.03),
        cz: 0,
        flatten: 0.1
      }
    }
  })
}

// 5. Biceps Brachii (Anterior Arm Peak)
export function createBicepsBellyGeo() {
  return createLoftedMuscleGeo({
    height: 0.28,
    tubularSegments: 18,
    radialSegments: 18,
    profile: (t) => {
      const swell = Math.sin(t * Math.PI)
      return {
        rx: 0.07 + swell * 0.045,
        rz: 0.07 + swell * 0.05,
        cx: 0,
        cz: swell * 0.02, // bicep peak anteriorly
        flatten: 0.1
      }
    }
  })
}

// 6. Forearm Muscle Mass (Brachioradialis & Flexors)
export function createForearmMassGeo() {
  return createLoftedMuscleGeo({
    height: 0.34,
    tubularSegments: 20,
    radialSegments: 18,
    profile: (t) => {
      // Thick proximal near elbow (t=1), tapered distal at wrist (t=0)
      const prox = t
      return {
        rx: 0.05 + prox * 0.045,
        rz: 0.05 + prox * 0.035,
        cx: 0,
        cz: 0,
        flatten: 0.1
      }
    }
  })
}

// 7. Quadriceps - Rectus Femoris (Central Thigh)
export function createRectusFemorisGeo() {
  return createLoftedMuscleGeo({
    height: 0.46,
    tubularSegments: 24,
    radialSegments: 20,
    profile: (t) => {
      const swell = Math.sin(t * Math.PI)
      return {
        rx: 0.07 + swell * 0.05,
        rz: 0.07 + swell * 0.06,
        cx: 0,
        cz: swell * 0.025,
        flatten: 0.15
      }
    }
  })
}

// 8. Quadriceps - Vastus Lateralis (Sweeping Outer Quad)
export function createVastusLateralisGeo(isLeft = true) {
  const dir = isLeft ? -1 : 1
  return createLoftedMuscleGeo({
    height: 0.44,
    tubularSegments: 22,
    radialSegments: 20,
    profile: (t) => {
      const swell = Math.sin(t * Math.PI * 0.9 + 0.1)
      return {
        rx: 0.08 + swell * 0.06,
        rz: 0.09 + swell * 0.05,
        cx: dir * (swell * 0.04), // sweeps laterally outwards
        cz: swell * 0.015,
        flatten: 0.1
      }
    }
  })
}

// 9. Quadriceps - Vastus Medialis (Teardrop Inner Quad)
export function createVastusMedialisGeo(isLeft = true) {
  const dir = isLeft ? -1 : 1
  return createLoftedMuscleGeo({
    height: 0.24,
    tubularSegments: 16,
    radialSegments: 16,
    profile: (t) => {
      const swell = Math.sin(t * Math.PI)
      return {
        rx: 0.06 + swell * 0.05,
        rz: 0.06 + swell * 0.04,
        cx: dir * (-swell * 0.03), // bulges medially
        cz: swell * 0.02,
        flatten: 0.1
      }
    }
  })
}

// 10. Gastrocnemius (Dual-Head Calf Belly)
export function createCalfMuscleGeo(isLeft = true) {
  const dir = isLeft ? -1 : 1
  return createLoftedMuscleGeo({
    height: 0.38,
    tubularSegments: 22,
    radialSegments: 20,
    profile: (t) => {
      // Swells prominently at upper posterior calf (t=0.6), tapers to Achilles tendon (t=0)
      const swell = Math.sin(Math.pow(t, 0.7) * Math.PI)
      return {
        rx: 0.06 + swell * 0.055,
        rz: 0.06 + swell * 0.07,
        cx: dir * (swell * 0.015),
        cz: -swell * 0.025, // projects posteriorly
        flatten: 0.15
      }
    }
  })
}

// 11. Latissimus Dorsi (V-Taper Back Wing)
export function createLatissimusWingGeo(isLeft = true) {
  const dir = isLeft ? -1 : 1
  return createLoftedMuscleGeo({
    height: 0.42,
    tubularSegments: 22,
    radialSegments: 20,
    profile: (t) => {
      // Wide flare at top under armpit (t=1), tapering to lumbar fascia (t=0)
      const flare = t
      return {
        rx: 0.09 + flare * 0.14,
        rz: 0.07 + flare * 0.04,
        cx: dir * (0.02 + flare * 0.06),
        cz: -0.04 - flare * 0.02, // posterior
        flatten: 0.25
      }
    }
  })
}

// 12. Trapezius (Diamond Upper Back)
export function createTrapeziusDiamondGeo() {
  return createLoftedMuscleGeo({
    height: 0.36,
    tubularSegments: 20,
    radialSegments: 20,
    profile: (t) => {
      // Broadest at mid-scapula (t=0.6), narrow at skull (t=1) and mid-spine (t=0)
      const swell = Math.sin(t * Math.PI)
      return {
        rx: 0.14 + swell * 0.12,
        rz: 0.07 + swell * 0.04,
        cx: 0,
        cz: -0.06 - swell * 0.02,
        flatten: 0.3
      }
    }
  })
}

// 13. Gluteus Maximus (Posterior Pelvis)
export function createGluteusMaximusGeo(isLeft = true) {
  const dir = isLeft ? -1 : 1
  return createLoftedMuscleGeo({
    height: 0.28,
    tubularSegments: 18,
    radialSegments: 20,
    profile: (t) => {
      const swell = Math.sin(t * Math.PI)
      return {
        rx: 0.12 + swell * 0.08,
        rz: 0.12 + swell * 0.10,
        cx: dir * (0.02 + swell * 0.03),
        cz: -0.04 - swell * 0.06, // large posterior protrusion
        flatten: 0.2
      }
    }
  })
}

// 14. Hamstrings (Posterior Thigh Column)
export function createHamstringColumnGeo() {
  return createLoftedMuscleGeo({
    height: 0.44,
    tubularSegments: 22,
    radialSegments: 18,
    profile: (t) => {
      const swell = Math.sin(t * Math.PI)
      return {
        rx: 0.09 + swell * 0.045,
        rz: 0.09 + swell * 0.055,
        cx: 0,
        cz: -swell * 0.03, // posterior swell
        flatten: 0.15
      }
    }
  })
}

// 15. Anatomical Skull & Jaw
export function createAnatomicalHeadGeo() {
  return createLoftedMuscleGeo({
    height: 0.32,
    tubularSegments: 22,
    radialSegments: 22,
    profile: (t) => {
      // Cranial dome at top (t=1), jaw/chin tapered at bottom (t=0)
      const cranial = Math.sin(Math.pow(t, 0.5) * Math.PI)
      return {
        rx: 0.11 + cranial * 0.06,
        rz: 0.12 + cranial * 0.07,
        cx: 0,
        cz: (1 - t) * 0.02, // slight chin protrusion forward
        flatten: 0.1
      }
    }
  })
}

// 16. Neck with Sternocleidomastoid Bands
export function createNeckAnatomyGeo() {
  return createLoftedMuscleGeo({
    height: 0.20,
    tubularSegments: 14,
    radialSegments: 18,
    profile: () => ({
      rx: 0.09,
      rz: 0.10,
      cx: 0,
      cz: 0,
      flatten: 0.1
    })
  })
}

