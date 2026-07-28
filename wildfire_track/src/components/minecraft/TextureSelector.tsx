import { useEffect } from 'react';
import { useStore } from './hooks/useStore';
import { useKeyboard } from './hooks/useKeyboard';
import { textureUrls } from './textures';

export const TextureSelector = () => {
  const { texture, setTexture } = useStore((state) => state);
  const { dirt, grass, glass, wood, log } = useKeyboard();

  useEffect(() => {
    const textureMap = { dirt, grass, glass, wood, log };
    const pressed = Object.entries(textureMap).find(([k, v]) => v);
    if (pressed) {
        const [selectedTexture] = pressed;
        if (texture !== selectedTexture) {
            setTexture(selectedTexture as any);
        }
    }
  }, [dirt, grass, glass, wood, log, texture, setTexture]);

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 p-3 bg-black/20 backdrop-blur-md rounded-full border border-white/10 shadow-2xl z-50">
      {Object.entries(textureUrls).map(([k, src]) => {
        const isSelected = texture === k;
        return (
            <div key={k} className={`relative group cursor-pointer transition-transform duration-200 ${isSelected ? '-translate-y-2' : 'hover:-translate-y-1'}`}>
                 <div
                    className={`w-14 h-14 rounded-full shadow-lg overflow-hidden border-2 transition-all duration-200 ${isSelected ? 'border-white scale-110' : 'border-white/20 opacity-80 hover:opacity-100'}`}
                    onClick={() => setTexture(k as any)}
                 >
                    <img src={src} alt={k} className="w-full h-full object-cover" />
                 </div>
                 {isSelected && (
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white uppercase tracking-widest shadow-black drop-shadow-md">
                        {k}
                    </div>
                 )}
            </div>
        )
      })}
    </div>
  );
};
