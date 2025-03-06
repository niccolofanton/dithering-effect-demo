import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";

const CreationOfAdam = () => {
  const meshRef = useRef();

  const { scene } = useGLTF(
    "https://cdn.maximeheckel.com/models/creation-of-adam.glb"
  );

  useEffect(() => {
    meshRef.current.position.set(2.25, -2, 0);
    meshRef.current.rotation.y = -Math.PI / 2;
    meshRef.current.scale.setScalar(4);

    const hand1 =
      scene.children[0].children[0].children[0].children[0].children[0];
    const nails1 =
      scene.children[0].children[0].children[0].children[0].children[1];

    const hand2 =
      scene.children[0].children[0].children[0].children[1].children[0];
    const nails2 =
      scene.children[0].children[0].children[0].children[1].children[1];

    const material = new THREE.MeshStandardMaterial({
      metalness: 1,
      color: new THREE.Color("gray"),
      roughness: 0,
    });

    hand1.material = material;
    nails1.material = material;
    hand2.material = material;
    nails2.material = material;
  }, []);

  return (
    <group ref={meshRef}>
      <primitive object={scene} />
    </group>
  );
};

export { CreationOfAdam };
