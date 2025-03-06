import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text3D, Center } from "@react-three/drei";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

// FontText component that handles loading and displaying the custom font
export const FontText = ({
  text,
  fontUrl,
  color = "#ffffff",
  size = 1,
  depth = 0.2,
}) => {
  const [font, setFont] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const textRef = useRef();

  // Function to load the custom font
  useEffect(() => {
    setLoading(true);
    const loader = new FontLoader();

    loader.load(
      fontUrl,
      (loadedFont) => {
        setFont(loadedFont);
        setLoading(false);
      },
      // Progress callback
      (xhr) => {
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      // Error callback
      (err) => {
        console.error("Font loading error:", err);
        setError(`Error loading font: ${err.message}`);
        setLoading(false);
      }
    );
  }, [fontUrl]);

  // Animate the text - simple rotation
  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  if (loading) {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="gray" />
      </mesh>
    );
  }

  if (error) {
    return (
      <Text3D position={[0, 0, 0]} size={0.5} height={0.1} curveSegments={12}>
        {error}
        <meshStandardMaterial color="red" />
      </Text3D>
    );
  }

  return (
    <Center>
      <Text3D
        ref={textRef}
        font={font}
        size={size}
        height={depth}
        curveSegments={32}
        bevelEnabled
        bevelThickness={0.01}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
      >
        {text}
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </Text3D>
    </Center>
  );
};
