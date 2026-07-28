import { create } from 'zustand';
import { nanoid } from 'nanoid';

type Texture = 'dirt' | 'grass' | 'glass' | 'wood' | 'log';
type ViewMode = 'firstPerson' | 'thirdPerson';

interface Cube {
  key: string;
  pos: [number, number, number];
  texture: Texture;
}

interface State {
  texture: Texture;
  viewMode: ViewMode;
  cubes: Cube[];
  addCube: (x: number, y: number, z: number) => void;
  removeCube: (x: number, y: number, z: number) => void;
  setTexture: (texture: Texture) => void;
  toggleViewMode: () => void;
  saveWorld: () => void;
  resetWorld: () => void;
}

const getLocalStorage = (key: string) => {
    try {
        return JSON.parse(window.localStorage.getItem(key) || 'null');
    } catch (e) {
        return null;
    }
}

const setLocalStorage = (key: string, value: any) => {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error(e);
    }
}

export const useStore = create<State>((set) => ({
  texture: 'dirt',
  viewMode: 'firstPerson',
  cubes: getLocalStorage('world') || [
    { key: nanoid(), pos: [1, 0, 1], texture: 'dirt' },
    { key: nanoid(), pos: [2, 0, 1], texture: 'grass' },
    { key: nanoid(), pos: [3, 0, 1], texture: 'glass' },
    { key: nanoid(), pos: [4, 0, 1], texture: 'wood' },
    { key: nanoid(), pos: [5, 0, 1], texture: 'log' },
  ],
  addCube: (x, y, z) =>
    set((state) => ({
      cubes: [
        ...state.cubes,
        {
          key: nanoid(),
          pos: [x, y, z],
          texture: state.texture,
        },
      ],
    })),
  removeCube: (x, y, z) =>
    set((state) => ({
      cubes: state.cubes.filter((cube) => {
        const [cx, cy, cz] = cube.pos;
        return cx !== x || cy !== y || cz !== z;
      }),
    })),
  setTexture: (texture) => set(() => ({ texture })),
  toggleViewMode: () => set((state) => ({ 
    viewMode: state.viewMode === 'firstPerson' ? 'thirdPerson' : 'firstPerson' 
  })),
  saveWorld: () =>
    set((state) => {
      setLocalStorage('world', state.cubes);
      return state;
    }),
  resetWorld: () =>
    set(() => {
      setLocalStorage('world', null);
      return {
        cubes: [],
      };
    }),
}));
