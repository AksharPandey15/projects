import { Canvas } from '@react-three/fiber';
import { Sky, PointerLockControls, Stars, Environment, Html } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { Player } from './components/minecraft/Player';
import { Cubes } from './components/minecraft/Cubes';
import { Ground } from './components/minecraft/Ground';
import { TextureSelector } from './components/minecraft/TextureSelector';
import { Crosshair } from './components/minecraft/Crosshair';
import { useStore } from './components/minecraft/hooks/useStore';
import { Button } from './components/ui/button';
import { RefreshCw, Save } from 'lucide-react';
import { Suspense, useState, useRef } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';

const Scene = ({ isLocked, setIsLocked }: { isLocked: boolean, setIsLocked: (v: boolean) => void }) => {
    const controlsRef = useRef<any>(null);
    
    return (
        <>
            <Sky
  sunPosition={[0, -300, 0]}   // sun far below horizon
  turbidity={20}
  rayleigh={0.02}
  mieCoefficient={0.02}
  mieDirectionalG={0.9}
/>

<Stars
  radius={400}
  depth={80}
  count={20000}
  factor={6}
  saturation={0}
  fade
  speed={0.15}
/>

<ambientLight intensity={0.015} />

<directionalLight
  castShadow
  position={[30, 15, -30]}    // faint moon
  intensity={0.12}
  color="#8fa9c8"
  shadow-mapSize={[2048, 2048]}
  shadow-camera-left={-40}
  shadow-camera-right={40}
  shadow-camera-top={40}
  shadow-camera-bottom={-40}
/>

<hemisphereLight
  skyColor="#020611"
  groundColor="#000000"
  intensity={0.03}
/>


            
            <Suspense fallback={null}>
              <Environment preset="park" />
              <Physics gravity={[0, -9.81, 0]}>
                <Player />
                <Cubes />
                <Ground />
              </Physics>
            </Suspense>
            
            <PointerLockControls 
                ref={controlsRef}
                onLock={() => setIsLocked(true)} 
                onUnlock={() => setIsLocked(false)} 
            />
        </>
    );
};

function App() {
  const saveWorld = useStore((state) => state.saveWorld);
  const resetWorld = useStore((state) => state.resetWorld);
  const viewMode = useStore((state) => state.viewMode);
  const [isLocked, setIsLocked] = useState(false);

  return (
    <>
      <div className="w-full h-screen relative bg-zinc-950 select-none overflow-hidden">
        <ErrorBoundary fallback={<div className="flex items-center justify-center h-full text-white bg-zinc-900">Failed to load 3D environment. Please refresh.</div>}>
          <Canvas shadows camera={{ fov: `150` }}>
             <Scene isLocked={isLocked} setIsLocked={setIsLocked} />
          </Canvas>
        </ErrorBoundary>
        
        {isLocked && <Crosshair />}
        
        <div className={`absolute top-6 right-6 flex flex-col gap-2 z-50 pointer-events-auto transition-opacity duration-300 ${isLocked ? 'opacity-50 hover:opacity-100' : 'opacity-100'}`}>
          <Button 
            variant="outline" 
            className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              saveWorld();
            }}
          >
            <Save className="w-4 h-4 mr-2" /> Save World
          </Button>
          <Button 
            variant="outline" 
            className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-red-500/50 hover:border-red-500/50 transition-colors"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              resetWorld();
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>

        <div className={`absolute top-6 left-6 z-40 pointer-events-none transition-opacity duration-300 ${isLocked ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white space-y-2 shadow-xl"> 
              <div className="space-y-1 text-xs text-zinc-300">
                  <div className="font-bold text-emerald-400 mb-1">Controls - {viewMode === 'firstPerson' ? '1st Person' : '3rd Person'}</div>
                  <div className="flex items-center gap-2"><span className="opacity-50">W/A/S/D</span> Move</div>
                  <div className="flex items-center gap-2"><span className="opacity-50">Right Click</span> Build</div>
                  <div className="flex items-center gap-2"><span className="opacity-50">Left Click</span> Break</div>
                  <div className="flex items-center gap-2"><span className="opacity-50">V</span> Toggle View</div>
              </div>
          </div>
        </div>

        <div className={`transition-transform duration-300 ${isLocked ? 'translate-y-0' : 'translate-y-24'}`}>
             <TextureSelector />
        </div>
      </div>
    </>
  );
}

export default App;
