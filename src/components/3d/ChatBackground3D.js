import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Floating model component with enhanced animation
function FloatingModel({ url, position, rotation, scale = 1.0, speed = 0.5, oscillationRange = 0.35, horizontalRange = 0.3 }) {
  const [model, setModel] = useState(null);
  const [error, setError] = useState(false);
  const modelRef = useRef();
  const initialPosition = [...position]; // Clone the position
  
  // Load model
  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        gltf.scene.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
            
            // Enhanced materials for better visibility
            if (node.material) {
              // Make materials more reflective and bright
              node.material.emissive = new THREE.Color(0x333333);
              node.material.emissiveIntensity = 0.3;
              node.material.metalness = 0.4;
              node.material.roughness = 0.5;
              node.material.envMapIntensity = 1.5;
              node.material.needsUpdate = true;
            }
          }
        });
        setModel(gltf.scene);
      },
      undefined,
      (err) => {
        console.error(`Failed to load model ${url}:`, err);
        setError(true);
      }
    );
  }, [url]);
  
  // Animation with greatly increased oscillation and movement
  useFrame(({ clock }) => {
    if (modelRef.current) {
      const time = clock.getElapsedTime();
      
      // Enhanced vertical oscillation
      modelRef.current.position.y = initialPosition[1] + Math.sin(time * speed) * oscillationRange;
      
      // Enhanced horizontal movement - figure-8 pattern
      modelRef.current.position.x = initialPosition[0] + Math.sin(time * speed * 0.5) * horizontalRange;
      modelRef.current.position.z = initialPosition[2] + Math.sin(time * speed * 0.7) * horizontalRange * 0.5;
      
      // Rotation on multiple axes for more organic movement
      modelRef.current.rotation.y += 0.002 * speed;
      modelRef.current.rotation.x += 0.0005 * speed * Math.sin(time * 0.2);
      modelRef.current.rotation.z += 0.0003 * speed * Math.cos(time * 0.3);
    }
  });
  
  if (error || !model) return null;
  
  return (
    <group 
      ref={modelRef} 
      position={position} 
      rotation={rotation}
    >
      <primitive 
        object={model.clone()} 
        scale={scale} 
        dispose={null} 
      />
    </group>
  );
}

// Scene component with reduced number of models but increased size
function BackgroundScene() {
  // Left group of models - reduced by ~35% (from 12 to 8) but 1.5x larger
  const leftModels = [
    // First layer
    { url: '/models/croissant.glb', position: [-8, 2, -2], rotation: [0, 0, 0], scale: 1.5, speed: 0.3, oscillationRange: 0.8, horizontalRange: 0.5 },
    { url: '/models/bread.glb', position: [-6, -3, -4], rotation: [0, 1, 0], scale: 1.2, speed: 0.4, oscillationRange: 0.7, horizontalRange: 0.6 },
    { url: '/models/tower.glb', position: [-7, 1, -5], rotation: [0, 0, 0], scale: 2.25, speed: 0.2, oscillationRange: 0.5, horizontalRange: 0.3 }, // 1.5x bigger than before
    { url: '/models/champagne.glb', position: [-10, -2, -3], rotation: [0, 0.7, 0], scale: 1.05, speed: 0.35, oscillationRange: 0.75, horizontalRange: 0.4 },
    
    // Second layer - reduced
    { url: '/models/croissant.glb', position: [-11, 4, -5], rotation: [0, 1.5, 0], scale: 1.65, speed: 0.35, oscillationRange: 0.9, horizontalRange: 0.7 },
    { url: '/models/tower.glb', position: [-4, -2, -8], rotation: [0, 0.3, 0], scale: 2.25, speed: 0.25, oscillationRange: 0.6, horizontalRange: 0.4 }, // 1.5x bigger than before
    { url: '/models/chicken.glb', position: [-12, 0, -4], rotation: [0, 2.5, 0], scale: 1.28, speed: 0.28, oscillationRange: 0.7, horizontalRange: 0.5 },
    { url: '/models/bread.glb', position: [-6, 5, -6], rotation: [0, 0.8, 0], scale: 1.35, speed: 0.32, oscillationRange: 0.85, horizontalRange: 0.6 },
  ];
  
  // Right group of models - reduced by ~35% (from 12 to 8) but 1.5x larger
  const rightModels = [
    // First layer
    { url: '/models/champagne.glb', position: [8, -2.5, -3], rotation: [0, 0.5, 0], scale: 1.05, speed: 0.35, oscillationRange: 0.8, horizontalRange: 0.45 },
    { url: '/models/chicken.glb', position: [9, 1.5, -4], rotation: [0, -0.5, 0], scale: 1.35, speed: 0.25, oscillationRange: 0.7, horizontalRange: 0.5 },
    { url: '/models/croissant.glb', position: [6, 3, -2], rotation: [0, 1, 0], scale: 1.5, speed: 0.3, oscillationRange: 0.75, horizontalRange: 0.6 },
    { url: '/models/tower.glb', position: [7, 4, -6], rotation: [0, -0.2, 0], scale: 2.25, speed: 0.2, oscillationRange: 0.5, horizontalRange: 0.3 }, // 1.5x bigger than before
    
    // Second layer - reduced
    { url: '/models/bread.glb', position: [11, 2.5, -4], rotation: [0, -1.2, 0], scale: 1.28, speed: 0.38, oscillationRange: 0.75, horizontalRange: 0.5 },
    { url: '/models/tower.glb', position: [4, -4, -7], rotation: [0, 0.7, 0], scale: 2.25, speed: 0.18, oscillationRange: 0.55, horizontalRange: 0.35 }, // 1.5x bigger than before
    { url: '/models/croissant.glb', position: [12, 0, -3], rotation: [0, 2.1, 0], scale: 1.43, speed: 0.28, oscillationRange: 0.8, horizontalRange: 0.7 },
    { url: '/models/champagne.glb', position: [7, 5, -5], rotation: [0, -0.8, 0], scale: 1.13, speed: 0.33, oscillationRange: 0.7, horizontalRange: 0.45 },
  ];
  
  return (
    <>
      {/* Enhanced lighting system for dramatic illumination */}
      <ambientLight intensity={0.8} color="#ffffff" />
      
      {/* Main directional light */}
      <directionalLight 
        position={[0, 5, 5]} 
        intensity={0.9}
        castShadow 
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-bias={-0.0005}
        color="#fffaea" /* Warmer light color */
      />
      
      {/* Dramatic spot light from above */}
      <spotLight 
        position={[0, 10, 0]} 
        intensity={1.2}
        angle={Math.PI / 3}
        penumbra={0.3}
        castShadow
        shadow-bias={-0.001}
        color="#fff5e0" /* Warm spot light */
      />
      
      {/* Colored fill lights for depth and dimension */}
      <spotLight 
        position={[-15, 0, 5]} 
        intensity={0.6}
        angle={Math.PI / 4}
        penumbra={0.5}
        color="#e0f5ff" /* Cool blue fill light */
        castShadow={false}
      />
      
      <spotLight 
        position={[15, 0, 5]} 
        intensity={0.6}
        angle={Math.PI / 4}
        penumbra={0.5}
        color="#fff0e0" /* Warm fill light */
        castShadow={false}
      />
      
      {/* Additional lighting for better visibility */}
      <spotLight 
        position={[0, -10, 5]} 
        intensity={0.5}
        angle={Math.PI / 3}
        penumbra={0.4}
        color="#f5f5ff" /* Soft uplight */
        castShadow={false}
      />
      
      {/* Environmental hemisphere light */}
      <hemisphereLight 
        skyColor="#ffffff" 
        groundColor="#444466" 
        intensity={0.7}
      />
      
      <PerspectiveCamera 
        makeDefault 
        position={[0, 0, 10]} 
        fov={50} /* Increased field of view */
      />
      
      {/* Left side models */}
      {leftModels.map((model, index) => (
        <FloatingModel
          key={`left-${index}`}
          url={model.url}
          position={model.position}
          rotation={model.rotation}
          scale={model.scale}
          speed={model.speed}
          oscillationRange={model.oscillationRange}
          horizontalRange={model.horizontalRange}
        />
      ))}
      
      {/* Right side models */}
      {rightModels.map((model, index) => (
        <FloatingModel
          key={`right-${index}`}
          url={model.url}
          position={model.position}
          rotation={model.rotation}
          scale={model.scale}
          speed={model.speed}
          oscillationRange={model.oscillationRange}
          horizontalRange={model.horizontalRange}
        />
      ))}
    </>
  );
}

// Main component
const ChatBackground3D = () => {
  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      pointerEvents: 'none',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F8FF 100%)'
    }}>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.5
        }}
      >
        <BackgroundScene />
      </Canvas>
    </div>
  );
};

export default ChatBackground3D; 