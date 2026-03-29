'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Single chess square ─── */
function Square({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
    </mesh>
  );
}

/* ─── 8×8 chessboard ─── */
function Chessboard() {
  const squares = useMemo(() => {
    const s: { pos: [number, number, number]; color: string }[] = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isLight = (row + col) % 2 === 0;
        s.push({
          pos: [col - 3.5, 0, row - 3.5],
          color: isLight ? '#E8F0FE' : '#1565C0',
        });
      }
    }
    return s;
  }, []);

  return (
    <group>
      {/* Board frame */}
      <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8.4, 8.4]} />
        <meshStandardMaterial color="#0D47A1" roughness={0.4} metalness={0.2} />
      </mesh>
      {squares.map((sq, i) => (
        <Square key={i} position={sq.pos} color={sq.color} />
      ))}
    </group>
  );
}

/* ─── Chess piece base (stylized) ─── */
function ChessPiece({
  position,
  color,
  height,
  floatIntensity = 1,
  delay = 0,
}: {
  position: [number, number, number];
  color: string;
  height: number;
  floatIntensity?: number;
  delay?: number;
}) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + delay) * 0.1;
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.2}
      floatIntensity={floatIntensity}
      floatingRange={[-0.1, 0.2]}
    >
      <group ref={meshRef} position={position}>
        {/* Base */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.4, 0.3, 32]} />
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.3} />
        </mesh>
        {/* Body */}
        <mesh position={[0, 0.15 + height / 2, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.3, height, 32]} />
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.3} />
        </mesh>
        {/* Top */}
        <mesh position={[0, 0.15 + height + 0.15, 0]} castShadow>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

/* ─── King piece ─── */
function King({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={1.2} floatingRange={[-0.05, 0.25]}>
      <group ref={meshRef} position={position}>
        {/* Base */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.45, 0.4, 32]} />
          <meshStandardMaterial color={color} roughness={0.15} metalness={0.4} />
        </mesh>
        {/* Body */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.35, 1.0, 32]} />
          <meshStandardMaterial color={color} roughness={0.15} metalness={0.4} />
        </mesh>
        {/* Crown ring */}
        <mesh position={[0, 1.45, 0]} castShadow>
          <torusGeometry args={[0.22, 0.06, 16, 32]} />
          <meshStandardMaterial color={color} roughness={0.15} metalness={0.5} />
        </mesh>
        {/* Cross vertical */}
        <mesh position={[0, 1.7, 0]} castShadow>
          <boxGeometry args={[0.06, 0.4, 0.06]} />
          <meshStandardMaterial color={color} roughness={0.15} metalness={0.5} />
        </mesh>
        {/* Cross horizontal */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <boxGeometry args={[0.25, 0.06, 0.06]} />
          <meshStandardMaterial color={color} roughness={0.15} metalness={0.5} />
        </mesh>
      </group>
    </Float>
  );
}

/* ─── Knight piece (horse-like shape) ─── */
function Knight({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4 + 1) * 0.2;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.25} floatIntensity={1.5} floatingRange={[-0.08, 0.3]}>
      <group ref={meshRef} position={position}>
        {/* Base */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.4, 0.3, 32]} />
          <meshStandardMaterial color={color} roughness={0.15} metalness={0.35} />
        </mesh>
        {/* Neck */}
        <mesh position={[0, 0.7, 0.05]} rotation={[0.3, 0, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.25, 0.8, 32]} />
          <meshStandardMaterial color={color} roughness={0.15} metalness={0.35} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 1.1, 0.2]} rotation={[0.8, 0, 0]} castShadow>
          <boxGeometry args={[0.2, 0.5, 0.3]} />
          <meshStandardMaterial color={color} roughness={0.15} metalness={0.35} />
        </mesh>
        {/* Ear */}
        <mesh position={[0, 1.35, 0.05]} rotation={[0.2, 0, 0]} castShadow>
          <coneGeometry args={[0.08, 0.25, 8]} />
          <meshStandardMaterial color={color} roughness={0.15} metalness={0.35} />
        </mesh>
      </group>
    </Float>
  );
}

/* ─── Rook piece ─── */
function Rook({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={1.4} rotationIntensity={0.1} floatIntensity={1} floatingRange={[-0.05, 0.2]}>
      <group position={position}>
        {/* Base */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.4, 0.3, 32]} />
          <meshStandardMaterial color={color} roughness={0.15} metalness={0.35} />
        </mesh>
        {/* Body */}
        <mesh position={[0, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.3, 0.8, 32]} />
          <meshStandardMaterial color={color} roughness={0.15} metalness={0.35} />
        </mesh>
        {/* Top platform */}
        <mesh position={[0, 1.15, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.2, 0.1, 32]} />
          <meshStandardMaterial color={color} roughness={0.15} metalness={0.35} />
        </mesh>
        {/* Battlements */}
        {[0, 1.2, 2.4, 3.6, 4.8].map((angle, i) => (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 0.22,
              1.3,
              Math.sin(angle) * 0.22,
            ]}
            castShadow
          >
            <boxGeometry args={[0.12, 0.2, 0.12]} />
            <meshStandardMaterial color={color} roughness={0.15} metalness={0.35} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

/* ─── Bishop piece ─── */
function Bishop({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={1.6} rotationIntensity={0.15} floatIntensity={1.1} floatingRange={[-0.06, 0.22]}>
      <group position={position}>
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.4, 0.3, 32]} />
          <meshStandardMaterial color={color} roughness={0.15} metalness={0.35} />
        </mesh>
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.3, 1.0, 32]} />
          <meshStandardMaterial color={color} roughness={0.15} metalness={0.35} />
        </mesh>
        <mesh position={[0, 1.4, 0]} castShadow>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial color={color} roughness={0.15} metalness={0.35} />
        </mesh>
        <mesh position={[0, 1.65, 0]} castShadow>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={color} roughness={0.15} metalness={0.35} />
        </mesh>
      </group>
    </Float>
  );
}

/* ─── Full scene ─── */
function Scene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  const white = '#F5F5F5';
  const dark = '#1A2332';

  return (
    <group ref={groupRef} rotation={[0.5, 0.5, 0]}>
      <Chessboard />
      
      {/* White pieces */}
      <King position={[-0.5, 0.05, -3.5]} color={white} />
      <Knight position={[1.5, 0.05, -3.5]} color={white} />
      <Rook position={[-3.5, 0.05, -3.5]} color={white} />
      <Bishop position={[0.5, 0.05, -3.5]} color={white} />
      <ChessPiece position={[-2.5, 0.05, -2.5]} color={white} height={0.6} delay={0} />
      <ChessPiece position={[-1.5, 0.05, -2.5]} color={white} height={0.6} delay={0.5} />
      <ChessPiece position={[0.5, 0.05, -2.5]} color={white} height={0.6} delay={1} />
      <ChessPiece position={[2.5, 0.05, -2.5]} color={white} height={0.6} delay={1.5} />

      {/* Dark pieces */}
      <King position={[-0.5, 0.05, 3.5]} color={dark} />
      <Knight position={[-1.5, 0.05, 3.5]} color={dark} />
      <Rook position={[3.5, 0.05, 3.5]} color={dark} />
      <Bishop position={[0.5, 0.05, 3.5]} color={dark} />
      <ChessPiece position={[-2.5, 0.05, 2.5]} color={dark} height={0.6} delay={2} />
      <ChessPiece position={[1.5, 0.05, 2.5]} color={dark} height={0.6} delay={2.5} />
      <ChessPiece position={[2.5, 0.05, 2.5]} color={dark} height={0.6} delay={3} />
      <ChessPiece position={[3.5, 0.05, 2.5]} color={dark} height={0.6} delay={3.5} />
    </group>
  );
}

export default function ChessScene() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <Canvas
        shadows
        camera={{ position: [8, 8, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#90CAF9" />
        <pointLight position={[5, 3, 5]} intensity={0.3} color="#BBDEFB" />
        
        <Scene />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 4}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
