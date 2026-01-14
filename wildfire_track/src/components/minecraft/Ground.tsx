import { usePlane } from '@react-three/cannon';
import { useStore } from './hooks/useStore';
import { useLoader } from '@react-three/fiber';
import { textureUrls } from './textures';
import { useEffect } from 'react';
import { TextureLoader, RepeatWrapping, NearestFilter } from 'three';

export const Ground = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.5, 0],
  }));

  const addCube = useStore((state) => state.addCube);
  
  const texture = useLoader(TextureLoader, textureUrls.grass);

  useEffect(() => {
    if (texture) {
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(100, 100);
        texture.magFilter = NearestFilter;
        texture.minFilter = NearestFilter;
        texture.needsUpdate = true;
    }
  }, [texture]);

  return (
    <mesh
      ref={ref as any}
      receiveShadow
      onClick={(e) => {
        e.stopPropagation();
        if (!e.face) return;
        const { x, y, z } = e.point;
        const [nX, nY, nZ] = [Math.round(x), 0, Math.round(z)];
        addCube(nX, nY, nZ);
      }}
    >
      <planeGeometry attach="geometry" args={[100, 100]} />
      <meshStandardMaterial attach="material" map={texture} />
    </mesh>
  );
};
