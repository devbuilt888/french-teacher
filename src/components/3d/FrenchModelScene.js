import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Physics, useBox, usePlane } from '@react-three/cannon';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

// Table floor that catches the models - now smaller
function Floor(props) {
  const [ref] = usePlane(() => ({ 
    rotation: [-Math.PI / 2, 0, 0], 
    position: [0, -1, 0], // Moved up to make tabletop smaller/higher
    ...props 
  }));
  
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[30, 30]} /> {/* Smaller tabletop area */}
      <meshStandardMaterial color="#f5f5f5" opacity={0.4} transparent />
    </mesh>
  );
}

// Simple model with respawn on click functionality
function Model({ url, position, scale = 1.0 }) {
  const [error, setError] = useState(false);
  const [gltf, setGltf] = useState(null);
  
  // Size multipliers for better collision fitting
  const getSizeMultiplier = () => {
    if (url.includes('tower')) return [0.2, 1, 0.2]; // Tall and thin for tower
    if (url.includes('croissant')) return [0.7, 0.3, 0.4]; // Curved shape for croissant
    if (url.includes('bread')) return [0.6, 0.4, 0.8]; // Bread loaf shape
    if (url.includes('champagne')) return [0.3, 0.8, 0.3]; // Tall thin bottle
    if (url.includes('chicken')) return [0.6, 0.6, 0.8]; // Chicken shape
    return [0.5, 0.5, 0.5]; // Default
  };
  
  // Create physics box with better-fitting size
  const sizeMultiplier = getSizeMultiplier();
  const [ref, api] = useBox(() => ({ 
    mass: 1,
    position,
    rotation: [Math.random(), Math.random(), Math.random()],
    args: [
      scale * sizeMultiplier[0], 
      scale * sizeMultiplier[1], 
      scale * sizeMultiplier[2]
    ],
    allowSleep: true,
    sleepSpeedLimit: 0.1,
    sleepTimeLimit: 1
  }));
  
  // Load model
  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (loadedGltf) => {
        // Set shadows on all meshes
        loadedGltf.scene.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });
        setGltf(loadedGltf);
      },
      undefined,
      (error) => {
        console.error(`Failed to load model ${url}:`, error);
        setError(true);
      }
    );
  }, [url]);
  
  // Function to respawn the model on click
  const handleClick = (e) => {
    e.stopPropagation();
    
    // Generate a new random position
    const newPosition = [
      (Math.random() - 0.5) * 4, // Smaller x range
      Math.random() * 5 + 3,     // Height above table
      (Math.random() - 0.5) * 4  // Smaller z range
    ];
    
    // Apply new random position and velocity
    api.position.set(...newPosition);
    api.velocity.set(0, 2, 0); // Give it a slight upward velocity for visual effect
    api.angularVelocity.set(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    );
  };
  
  // If there's an error loading the model, render a simple box
  if (error) {
    return (
      <mesh 
        ref={ref} 
        position={position} 
        castShadow
        onClick={handleClick}
      >
        <boxGeometry args={[
          scale * sizeMultiplier[0], 
          scale * sizeMultiplier[1], 
          scale * sizeMultiplier[2]
        ]} />
        <meshStandardMaterial color="#E30B1C" />
      </mesh>
    );
  }
  
  // If the model is still loading, render a placeholder
  if (!gltf) {
    return (
      <mesh 
        ref={ref} 
        position={position} 
        castShadow
        onClick={handleClick}
      >
        <boxGeometry args={[
          scale * sizeMultiplier[0], 
          scale * sizeMultiplier[1], 
          scale * sizeMultiplier[2]
        ]} />
        <meshStandardMaterial color="#cccccc" wireframe />
      </mesh>
    );
  }
  
  return (
    <mesh
      ref={ref}
      castShadow
      onClick={handleClick}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      <primitive 
        object={gltf.scene.clone()} 
        scale={scale} 
        dispose={null} 
      />
    </mesh>
  );
}

// Random position generator for initial placement - smaller area
const getRandomPosition = () => [
  (Math.random() - 0.5) * 4,  // Smaller x range
  Math.random() * 4 + 2,      // Start above the table, but not too high
  (Math.random() - 0.5) * 4   // Smaller z range
];

// Scene content
const SceneContent = () => {
  // Model URLs and their scales - increased tower scale significantly
  const models = [
    { url: '/models/croissant.glb', scale: 1.2 },
    { url: '/models/bread.glb', scale: 1.0 },
    { url: '/models/champagne.glb', scale: 0.8 },
    { url: '/models/tower.glb', scale: 1.2 },  // Much bigger tower
    { url: '/models/chicken.glb', scale: 1.0 }
  ];
  
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 8]} /> {/* Closer camera position */}
      <color attach="background" args={['#001852']} />
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[10, 10, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <spotLight 
        position={[-10, 10, -10]} 
        intensity={0.5} 
        castShadow 
      />
      
      <Physics 
        gravity={[0, -12, 0]} 
        defaultContactMaterial={{ 
          friction: 0.3, 
          restitution: 0.5 
        }}
      >
        <Floor />
        {models.map((model, index) => (
          <Model
            key={index}
            url={model.url}
            position={getRandomPosition()}
            scale={model.scale}
          />
        ))}
      </Physics>
      
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI / 2.1}
      />
    </>
  );
};

// Main component that exports the 3D scene
const FrenchModelScene = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
      <Canvas 
        shadows 
        dpr={[1, 1.5]} // Reduce for better performance
        camera={{ position: [0, 5, 8], fov: 50 }}
        gl={{ 
          antialias: true,
          alpha: true
        }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
};

export default FrenchModelScene; 