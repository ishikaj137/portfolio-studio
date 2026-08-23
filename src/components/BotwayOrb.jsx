import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function ParticleOrb() {
  const pointsRef = useRef()
  const meshRef = useRef()
  const innerSphereRef = useRef()

  // Generate particle cloud on sphere surface with slight radial dispersion
  const { positions, colors, count } = useMemo(() => {
    const count = 1200
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    const color1 = new THREE.Color('#38bdf8') // cyan / electric sky
    const color2 = new THREE.Color('#818cf8') // indigo / violet
    const color3 = new THREE.Color('#c084fc') // purple / fuchsia

    for (let i = 0; i < count; i++) {
      // Golden spiral distribution on sphere
      const phi = Math.acos(1 - 2 * (i + 0.5) / count)
      const theta = Math.PI * (1 + 5 ** 0.5) * i

      // Slight natural noise variation
      const r = 2.1 + (Math.sin(i * 0.3) * 0.08)

      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      // Interpolate colors based on coordinates
      const t = (Math.sin(phi * 2 + theta) + 1) / 2
      const mixed = new THREE.Color()
      if (t < 0.5) {
        mixed.lerpColors(color1, color2, t * 2)
      } else {
        mixed.lerpColors(color2, color3, (t - 0.5) * 2)
      }

      colors[i * 3] = mixed.r
      colors[i * 3 + 1] = mixed.g
      colors[i * 3 + 2] = mixed.b
    }

    return { positions, colors, count }
  }, [])

  useFrame(({ clock, mouse }) => {
    const t = clock.getElapsedTime()

    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.12 + mouse.x * 0.3
      pointsRef.current.rotation.x = Math.sin(t * 0.08) * 0.15 + mouse.y * 0.2
      // Subtle organic breathing pulse
      const scale = 1 + Math.sin(t * 1.5) * 0.025
      pointsRef.current.scale.set(scale, scale, scale)
    }

    if (meshRef.current) {
      meshRef.current.rotation.y = -t * 0.08
      meshRef.current.rotation.z = t * 0.05
      const wireScale = 1 + Math.sin(t * 1.5 + 0.5) * 0.02
      meshRef.current.scale.set(wireScale, wireScale, wireScale)
    }

    if (innerSphereRef.current) {
      innerSphereRef.current.rotation.y = t * 0.06
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* 3D Particle Cloud */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.055}
          vertexColors
          transparent
          opacity={0.88}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* Outer Wireframe Icosahedron */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2.3, 2]} />
        <meshBasicMaterial
          wireframe
          color="#818cf8"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner Glowing Core */}
      <mesh ref={innerSphereRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

export default function BotwayOrb() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#38bdf8" />
        <directionalLight position={[-5, -5, -5]} intensity={0.9} color="#c084fc" />
        <ParticleOrb />
      </Canvas>
    </div>
  )
}
