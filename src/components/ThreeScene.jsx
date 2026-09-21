import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ── StarField (280 particles, star-like) ── */
function StarField() {
  const pointsRef = useRef()

  const { positions, velocities, COUNT } = useMemo(() => {
    const COUNT = 280
    const positions = new Float32Array(COUNT * 3)
    const velocities = []
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 24   // x spread
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14   // y spread
      positions[i * 3 + 2] = -8 + Math.random() * 10       // z: -8 to +2
      velocities.push({
        x: (Math.random() - 0.5) * 0.0056,   // 60% slower
        y: (Math.random() - 0.5) * 0.0048,
        z: (Math.random() - 0.5) * 0.0028,
      })
    }
    return { positions, velocities, COUNT }
  }, [])

  useFrame(() => {
    if (!pointsRef.current) return
    const attr = pointsRef.current.geometry.attributes.position
    for (let i = 0; i < COUNT; i++) {
      attr.array[i * 3]     += velocities[i].x
      attr.array[i * 3 + 1] += velocities[i].y
      attr.array[i * 3 + 2] += velocities[i].z
      if (Math.abs(attr.array[i * 3])     > 12) velocities[i].x *= -1
      if (Math.abs(attr.array[i * 3 + 1]) > 7)  velocities[i].y *= -1
      if (attr.array[i * 3 + 2] < -8 || attr.array[i * 3 + 2] > 2) velocities[i].z *= -1
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute args={[positions, 3]} attach="attributes-position" />
      </bufferGeometry>
      <pointsMaterial
        color="#9A9A96"
        size={0.028}
        transparent
        opacity={0.6}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

/* ── Exported canvas component ── */
export default function ThreeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 60 }}
      gl={{ alpha: true, antialias: true }}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <StarField />
    </Canvas>
  )
}
