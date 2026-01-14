import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { textureUrls } from './textures';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, NearestFilter } from 'three';

interface PlayerModelProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  isMoving?: boolean;
  velocity?: [number, number, number];
}

// Minecraft Steve exact proportions (in pixels converted to units)
// Steve is 32 pixels tall, we scale to 1.8 units (typical player height)
const SCALE = 1.8 / 32;

export const PlayerModel = ({ 
  position, 
  rotation = [0, 0, 0], 
  isMoving = false,
  velocity = [0, 0, 0]
}: PlayerModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  
  const animationTime = useRef(0);
  const currentPosition = useRef(new THREE.Vector3(...position));
  const currentRotation = useRef(new THREE.Euler(...rotation));
  const targetPosition = useRef(new THREE.Vector3(...position));
  const targetRotation = useRef(new THREE.Euler(...rotation));

  // Load a simple texture for Steve's skin
  const skinTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Steve's classic skin colors
    // Head - tan/peachy skin
    ctx.fillStyle = '#F0B478';
    ctx.fillRect(0, 0, 32, 16);
    ctx.fillRect(32, 0, 32, 16);
    
    // Hair/facial features - brown (taller hair with more volume)
    ctx.fillStyle = '#6B4423';
    ctx.fillRect(8, 0, 16, 10); // Increased height for more hair
    ctx.fillRect(6, 2, 20, 4); // Wider base
    ctx.fillRect(8, 10, 8, 2); // Additional tuft
    ctx.fillRect(16, 10, 8, 2);
    
    // Eyes - white with blue pupils (moved lower)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(8, 14, 3, 3);
    ctx.fillRect(13, 14, 3, 3);
    ctx.fillStyle = '#4287F5';
    ctx.fillRect(9, 15, 1, 1);
    ctx.fillRect(14, 15, 1, 1);

    // Body - cyan shirt
    ctx.fillStyle = '#66CCCC';
    ctx.fillRect(0, 16, 32, 16);
    ctx.fillRect(32, 16, 32, 16);
    
    // Arms - cyan sleeves transitioning to skin
    ctx.fillStyle = '#66CCCC';
    ctx.fillRect(0, 32, 16, 16);
    ctx.fillRect(16, 32, 16, 16);
    ctx.fillStyle = '#F0B478';
    ctx.fillRect(0, 44, 16, 4);
    ctx.fillRect(16, 44, 16, 4);
    
    // Legs - dark blue pants
    ctx.fillStyle = '#2B3E8C';
    ctx.fillRect(0, 48, 32, 16);
    ctx.fillRect(32, 48, 32, 16);

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = NearestFilter;
    texture.minFilter = NearestFilter;
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Animation loop for walking
  useFrame((state, delta) => {
    // Update target position and rotation
    targetPosition.current.set(...position);
    targetRotation.current.set(...rotation);

    // Smooth position and rotation
    currentPosition.current.lerp(targetPosition.current, delta * 15); // Fast position lerp
    currentRotation.current.x = THREE.MathUtils.lerp(currentRotation.current.x, targetRotation.current.x, delta * 10);
    currentRotation.current.y = THREE.MathUtils.lerp(currentRotation.current.y, targetRotation.current.y, delta * 10);
    currentRotation.current.z = THREE.MathUtils.lerp(currentRotation.current.z, targetRotation.current.z, delta * 10);

    // Apply smoothed transforms
    if (groupRef.current) {
      groupRef.current.position.copy(currentPosition.current);
      groupRef.current.rotation.copy(currentRotation.current);
    }

    if (!isMoving) {
      animationTime.current = 0;
      
      // Smoothly return to idle position
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, delta * 5);
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, delta * 5);
      }
      if (leftLegRef.current) {
        leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, delta * 5);
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, delta * 5);
      }
      return;
    }

    animationTime.current += delta * 8;
    
    // Use smoother easing function instead of simple sine
    const swing = Math.sin(animationTime.current) * (1 - Math.abs(Math.sin(animationTime.current * 0.5)) * 0.3);
    const swingAmount = 0.6; // Slightly more pronounced swing

    // Animate arms (opposite swing) with slight delay for natural feel
    if (leftArmRef.current) {
      const armSwing = Math.sin(animationTime.current + 0.2) * swingAmount;
      leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, armSwing, delta * 10);
    }
    if (rightArmRef.current) {
      const armSwing = Math.sin(animationTime.current + Math.PI + 0.2) * swingAmount;
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, armSwing, delta * 10);
    }

    // Animate legs (opposite swing) with slight phase difference
    if (leftLegRef.current) {
      const legSwing = Math.sin(animationTime.current) * swingAmount;
      leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, legSwing, delta * 10);
    }
    if (rightLegRef.current) {
      const legSwing = Math.sin(animationTime.current + Math.PI) * swingAmount;
      rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, legSwing, delta * 10);
    }
  });

  // Create materials with pixelated textures
  const skinMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xF0B478,
    roughness: 0.8,
    metalness: 0.1
  });
  
  const shirtMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x66CCCC,
    roughness: 0.9,
    metalness: 0
  });
  
  const pantsMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x2B3E8C,
    roughness: 0.9,
    metalness: 0
  });
  
  const hairMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x6B4423,
    roughness: 0.9,
    metalness: 0
  });

  const shoeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x1A1A1A,
    roughness: 0.8,
    metalness: 0.1
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Head - 8x8x8 pixels = 0.45 units */}
      <group position={[0, 1.35, 0]}>
        {/* Main head */}
        <mesh castShadow>
          <boxGeometry args={[0.45, 0.45, 0.45]} />
          <meshStandardMaterial color={0xF0B478} roughness={0.8} />
        </mesh>
        
        {/* Hair/top overlay - moved higher and made taller */}
        <mesh position={[0, 0.18, 0]} castShadow>
          <boxGeometry args={[0.48, 0.21, 0.48]} />
          <primitive object={hairMaterial} attach="material" />
        </mesh>
        
        {/* Additional hair tuft on top */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[0.42, 0.12, 0.42]} />
          <primitive object={hairMaterial} attach="material" />
        </mesh>
        
        {/* Eyes - moved slightly lower to create gap */}
        <mesh position={[0.12, 0.02, 0.226]}>
          <boxGeometry args={[0.09, 0.09, 0.01]} />
          <meshStandardMaterial color={0x4287F5} />
        </mesh>
        <mesh position={[-0.12, 0.02, 0.226]}>
          <boxGeometry args={[0.09, 0.09, 0.01]} />
          <meshStandardMaterial color={0x4287F5} />
        </mesh>
        
        {/* Beard/mouth area */}
        <mesh position={[0, -0.12, 0.226]}>
          <boxGeometry args={[0.18, 0.09, 0.01]} />
          <primitive object={hairMaterial} attach="material" />
        </mesh>
      </group>

      {/* Body - 8x12x4 pixels */}
      <mesh position={[0, 0.78, 0]} castShadow>
        <boxGeometry args={[0.45, 0.68, 0.225]} />
        <primitive object={shirtMaterial} attach="material" />
      </mesh>

      {/* Left Arm */}
      <group 
        ref={leftArmRef}
        position={[-0.315, 1.05, 0]}
      >
        <group position={[0, -0.34, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.225, 0.68, 0.225]} />
            <primitive object={shirtMaterial} attach="material" />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.4, 0]} castShadow>
            <boxGeometry args={[0.225, 0.15, 0.225]} />
            <primitive object={skinMaterial} attach="material" />
          </mesh>
        </group>
      </group>

      {/* Right Arm */}
      <group 
        ref={rightArmRef}
        position={[0.315, 1.05, 0]}
      >
        <group position={[0, -0.34, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.225, 0.68, 0.225]} />
            <primitive object={shirtMaterial} attach="material" />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.4, 0]} castShadow>
            <boxGeometry args={[0.225, 0.15, 0.225]} />
            <primitive object={skinMaterial} attach="material" />
          </mesh>
        </group>
      </group>

      {/* Left Leg */}
      <group 
        ref={leftLegRef}
        position={[-0.1125, 0.44, 0]}
      >
        <group position={[0, -0.34, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.225, 0.68, 0.225]} />
            <primitive object={pantsMaterial} attach="material" />
          </mesh>
          {/* Shoe */}
          <mesh position={[0, -0.38, 0.02]} castShadow>
            <boxGeometry args={[0.24, 0.09, 0.28]} />
            <primitive object={shoeMaterial} attach="material" />
          </mesh>
        </group>
      </group>

      {/* Right Leg */}
      <group 
        ref={rightLegRef}
        position={[0.1125, 0.44, 0]}
      >
        <group position={[0, -0.34, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.225, 0.68, 0.225]} />
            <primitive object={pantsMaterial} attach="material" />
          </mesh>
          {/* Shoe */}
          <mesh position={[0, -0.38, 0.02]} castShadow>
            <boxGeometry args={[0.24, 0.09, 0.28]} />
            <primitive object={shoeMaterial} attach="material" />
          </mesh>
        </group>
      </group>
    </group>
  );
};