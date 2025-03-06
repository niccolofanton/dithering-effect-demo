import {
  OrbitControls,
  OrthographicCamera,
  Environment,
  Text3D,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, wrapEffect } from "@react-three/postprocessing";
import { Leva, useControls } from "leva";
import { Effect } from "postprocessing";
import { Suspense, useRef } from "react";
import * as THREE from "three";

import fragmentShader from "!!raw-loader!./shader2.glsl";
import { CreationOfAdam } from "./Model";
import { FontText } from "./FontText";
import "./scene.css";

class DitheredRayMarchEffectImpl extends Effect {
  constructor({
    time = 0,
    resolution = new THREE.Vector2(1, 1),
    gridSize = 4.0,
    luminanceMethod = 0,
    contrast = 1.0,
    brightness = 0.0,
    invertColor = false,
    toonShaderEnabled = false,
    toonColorA = "#ffffff",
    toonColorB = "#888888",
    toonColorC = "#000000",
  } = {}) {
    const uniforms = new Map([
      ["time", new THREE.Uniform(time)],
      ["resolution", new THREE.Uniform(resolution)],
      ["gridSize", new THREE.Uniform(gridSize)],
      ["luminanceMethod", new THREE.Uniform(luminanceMethod)],
      ["contrast", new THREE.Uniform(contrast)],
      ["brightness", new THREE.Uniform(brightness)],
      ["invertColor", new THREE.Uniform(invertColor ? 1 : 0)],
      ["ditheringEnabled", new THREE.Uniform(1)], // Default to enabled
      ["toonShaderEnabled", new THREE.Uniform(toonShaderEnabled ? 1 : 0)],
      ["toonColorA", new THREE.Uniform(new THREE.Color(toonColorA))],
      ["toonColorB", new THREE.Uniform(new THREE.Color(toonColorB))],
      ["toonColorC", new THREE.Uniform(new THREE.Color(toonColorC))],
    ]);

    super("DitheredRayMarchEffect", fragmentShader, { uniforms });

    this.uniforms = uniforms;
  }

  update(renderer, inputBuffer, deltaTime) {
    this.uniforms.get("time").value += deltaTime;
    this.uniforms
      .get("resolution")
      .value.set(inputBuffer.width, inputBuffer.height);
  }
}

const DitheredRayMarchEffect = wrapEffect(DitheredRayMarchEffectImpl);

export const DotsEffect = () => {
  const effectRef = useRef();

  const {
    gridSize,
    luminanceMethod,
    contrast,
    brightness,
    invertColor,
    ditheringEnabled,
    toonShaderEnabled,
    toonColorA,
    toonColorB,
    toonColorC,
  } = useControls({
    gridSize: {
      value: 2.0,
      min: 1.0,
      max: 16.0,
      step: 0.5,
      label: "Grid Size",
    },
    luminanceMethod: {
      value: 0,
      options: {
        "Rec. 709 (Standard)": 0,
        Average: 1,
        "Rec. 601 (Perceived)": 2,
      },
      label: "Luminance Method",
    },
    contrast: {
      value: 1.0,
      min: 0.0,
      max: 2.0,
      step: 0.1,
      label: "Contrast",
    },
    brightness: {
      value: 0.0,
      min: -1.0,
      max: 1.0,
      step: 0.1,
      label: "Brightness",
    },
    invertColor: {
      value: false,
      label: "Invert Colors",
    },
    ditheringEnabled: {
      value: true,
      label: "Enable Dithering",
    },
    toonShaderEnabled: {
      value: false,
      label: "Enable Toon Shader",
    },
    toonColorA: {
      value: "#ffffff",
      label: "Toon Color 1 (Highest)",
    },
    toonColorB: {
      value: "#888888",
      label: "Toon Color 2",
    },
    toonColorC: {
      value: "#000000",
      label: "Toon Color 3 (Lowest)",
    },
  });

  useFrame((state) => {
    const { camera } = state;

    if (effectRef.current) {
      // Update existing uniforms
      effectRef.current.uniforms.get("gridSize").value = gridSize;
      effectRef.current.uniforms.get("luminanceMethod").value = luminanceMethod;
      effectRef.current.uniforms.get("contrast").value = contrast;
      effectRef.current.uniforms.get("brightness").value = brightness;
      effectRef.current.uniforms.get("invertColor").value = invertColor ? 1 : 0;

      // Dithering toggle
      effectRef.current.uniforms.get("ditheringEnabled").value =
        ditheringEnabled ? 1 : 0;

      // Toon shader uniforms
      effectRef.current.uniforms.get("toonShaderEnabled").value =
        toonShaderEnabled ? 1 : 0;

      // Update color uniforms
      effectRef.current.uniforms.get("toonColorA").value.set(toonColorA);
      effectRef.current.uniforms.get("toonColorB").value.set(toonColorB);
      effectRef.current.uniforms.get("toonColorC").value.set(toonColorC);
    }
  });

  return (
    <EffectComposer>
      <DitheredRayMarchEffect ref={effectRef} />
    </EffectComposer>
  );
};

const Scene = () => {
  const fontUrl = "./font.json";

  return (
    <>
      <Canvas shadows dpr={[1, 1.5]}>
        <Suspense>
          <color attach="background" args={["black"]} />
          <ambientLight intensity={0.55} />
          <directionalLight position={[5, 10, 0]} intensity={10.0} />

          <OrbitControls autoRotate={false} />

          <OrthographicCamera
            makeDefault
            position={[0, 0, 5]}
            zoom={150}
            near={0.01}
            far={500}
          />
          {/* <CreationOfAdam /> */}

          <Text3D
            // curveSegments={1}
            // bevelEnabled
            // bevelThickness={0.01}
            // bevelSize={0.04}
            // bevelOffset={0}
            // bevelSegments={5}
            font={fontUrl}
          >
            {`Niccolò
            Fanton`}
            <meshStandardMaterial metalness={0} roughness={0} />
          </Text3D>

          <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr" />

          <DotsEffect />
        </Suspense>
      </Canvas>
      <Leva collapsed />
    </>
  );
};

export default Scene;
