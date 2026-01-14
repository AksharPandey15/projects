import { useBox } from '@react-three/cannon';
import { useState, useEffect } from 'react';
import { useStore } from './hooks/useStore';
import { textureUrls } from './textures';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, NearestFilter } from 'three';

interface CubeProps {
  position: [number, number, number];
  texture: string;
}

export const Cube = ({ position, texture }: CubeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const addCube = useStore((state) => state.addCube);
  const removeCube = useStore((state) => state.removeCube);

  const [ref] = useBox(() => ({
    type: 'Static',
    position,
  }));

  const url = (textureUrls as any)[texture] || textureUrls.dirt;
  const map = useLoader(TextureLoader, url);

  useEffect(() => {
    if (map) {
        map.magFilter = NearestFilter;
        map.minFilter = NearestFilter;
        map.needsUpdate = true;
    }
  }, [map]);

  return (
    <mesh
      ref={ref as any}
      castShadow
      receiveShadow
      onPointerMove={(e) => {
        e.stopPropagation();
        setIsHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setIsHovered(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        
        if (e.button === 2) {
            removeCube(position[0], position[1], position[2]);
            return;
        }

        if (!e.face) return;
        const { x, y, z } = e.face.normal;
        addCube(position[0] + x, position[1] + y, position[2] + z);
      }}
    >
      <boxGeometry attach="geometry" />
      <meshStandardMaterial
        attach="material"
        map={map}
        color={isHovered ? '#dedede' : 'white'}
        transparent={texture === 'glass'}
        opacity={texture === 'glass' ? 0.6 : 1}
        roughness={0.8}
      />
    </mesh>
  );
};
