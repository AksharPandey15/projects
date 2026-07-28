# Minecraft Clone in React Three Fiber

A fully interactive 3D Minecraft-like voxel building game built with React, Three.js, and modern web technologies. Experience block-based world creation with realistic physics, dynamic lighting, and smooth first-person controls.

## ✨ Features

- **3D Voxel World**: Build and destroy blocks in a fully 3D environment
- **Realistic Physics**: Gravity, collision detection, and dynamic interactions using Cannon.js
- **Multiple Textures**: 5 different block types (Dirt, Grass, Glass, Wood, Log) with procedurally generated pixel-art textures
- **Smooth Camera**: Camera follows player with configurable lerp smoothing for cinematic feel
- **Input Smoothing**: Movement inputs are smoothed to reduce jerky controls
- **Movement Prediction**: Slight forward prediction makes controls feel more responsive
- **Fluid Animations**: Character walking animations use easing functions and smooth transitions
- **Responsive UI**: Modern, accessible interface with Tailwind CSS and Radix UI components
- **Performance Optimized**: Efficient rendering with React Three Fiber and instanced meshes

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **3D Rendering**: React Three Fiber (@react-three/fiber)
- **Physics Engine**: @react-three/cannon
- **State Management**: Zustand
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Language**: TypeScript

## 🚀 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/NafisRayan/Frontend-Practice.git
   cd "Minecraft Clone in ReactThreeFiber"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to start playing!

## 🎮 How to Play

### Getting Started
1. Click "Click to Start" on the welcome screen
2. Your mouse will be captured for camera control
3. Use the controls below to build your world!

## 🎮 Gameplay Features

### Smooth Movement System

The game features a highly polished movement system designed for the best player experience:

- **Camera Smoothing**: Camera position lerps smoothly to follow the player, eliminating jerky movements
- **Input Buffering**: Movement inputs are smoothed to prevent stuttering and provide fluid control
- **Movement Prediction**: Slight forward prediction makes controls feel instant and responsive
- **Animation Easing**: Character animations use smooth easing functions instead of abrupt transitions
- **Rotation Smoothing**: Player model rotation changes are interpolated for natural turning

### Controls

| Action | Key/Button |
|--------|------------|
| Move Forward | `W` |
| Move Backward | `S` |
| Move Left | `A` |
| Move Right | `D` |
| Jump | `Space` |
| Look Around | Mouse |
| Place Block | Left Click |
| Remove Block | `Alt` + Left Click |
| Select Dirt | `1` |
| Select Grass | `2` |
| Select Glass | `3` |
| Select Wood | `4` |
| Select Log | `5` |
| Toggle View Mode | `V` |
| Save World | Save Button (top-right) |
| Reset World | Reset Button (top-right) |
| Exit Pointer Lock | `Escape` |

### Building Tips
- Click on the ground or existing blocks to place new blocks
- Hold `Alt` while clicking to remove blocks
- Use different textures to create varied structures
- Your world is automatically saved to your browser's local storage

## 📁 Project Structure

```
src/
├── components/
│   ├── minecraft/           # Game-specific components
│   │   ├── Cube.tsx        # Individual block component
│   │   ├── Cubes.tsx       # Collection of all cubes
│   │   ├── Ground.tsx      # Ground plane
│   │   ├── Player.tsx      # Player character with physics
│   │   ├── TextureSelector.tsx # Block type selection UI
│   │   ├── Crosshair.tsx   # Center screen reticle
│   │   ├── hooks/
│   │   │   ├── useKeyboard.ts # Keyboard input handling
│   │   │   └── useStore.ts    # Game state management
│   │   └── textures/
│   │       └── index.ts       # Texture generation
│   ├── ui/                  # Reusable UI components
│   └── ErrorBoundary.tsx    # Error handling
├── App.tsx                 # Main application component
├── main.tsx               # React entry point
├── index.css              # Global styles
└── styles/
    └── globals.css        # Additional styles
```

## 🎨 Customization

### Adding Player Models

The game supports custom 3D player models for third-person view:

1. Place your GLB model file in `public/models/Steve.glb`
2. The game will automatically load and display your custom model
3. If no GLB is found, a simple blocky fallback character is used
4. Models should be scaled to ~1 unit tall with origin at the feet

See `public/models/README.md` for detailed instructions.

### Adding New Textures

1. Add a new texture name to the `Texture` type in `useStore.ts`
2. Create a texture generator in `textures/index.ts`
3. Update the keyboard mappings in `useKeyboard.ts`
4. Add the texture to the selector UI

### Modifying Physics

Adjust physics parameters in the respective components:
- Player speed and jump force in `Player.tsx`
- Gravity in `App.tsx` Physics component
- Block properties in `Cube.tsx`

## 🏗️ Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Minecraft and classic voxel games
- Built with [React Three Fiber](https://github.com/pmndrs/react-three-fiber)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide](https://lucide.dev/)

## 📞 Support

If you have any questions or issues, please open an issue on GitHub.

---

**Happy Building! 🧱**</content>
<parameter name="filePath">c:\Users\BS00861\Documents\GitHub\Minecraft Clone in ReactThreeFiber\README.md