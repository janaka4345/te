import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Box } from "@react-three/drei";
import "./styles.css";
import {
  Physics,
  Debug,
  RigidBody,
  RigidBodyApi,
  HeightfieldCollider,
  HeightfieldArgs
} from "@react-three/rapier";
import { Ground } from "./Ground";
import { Player } from "./Player";
import { useKeyboard } from "./useKeyboard";
import { useMouseCapture } from "./useMouseCapture";

function Ball({ position }) {
  return (
    <RigidBody colliders="ball" position={position}>
      <mesh>
        <sphereGeometry args={[2, 24, 24, 8]} />
        <meshStandardMaterial />
      </mesh>
    </RigidBody>
  );
}

// this could be inlined but into player but thinking about how to support multiple input types
function getInput(keyboard, mouse) {
  let [x, y, z] = [0, 0, 0];
  if (keyboard["s"]) z += 1.0;
  if (keyboard["w"]) z -= 1.0;
  if (keyboard["d"]) x += 1.0;
  if (keyboard["a"]) x -= 1.0;
  if (keyboard[" "]) y += 1.0;

  return {
    move: [x, y, z],
    look: [mouse.x / window.innerWidth, mouse.y / window.innerHeight],
    running: keyboard["Shift"]
  };
}

const Scene = () => {
  const keyboard = useKeyboard();
  const mouse = useMouseCapture();
  return (
    <Suspense fallback={null}>
      <Physics>
        <Debug />
        <Ball position={[6, 8, 0]} />
        <Ground displacementOffset={-20} displacementScale={80} />
        <Player walk={5} jump={5} input={() => getInput(keyboard, mouse)} />
      </Physics>
    </Suspense>
  );
};

export default function App() {
  return (
    <Canvas camera={{ position: [0, 40, 40] }}>
      <ambientLight intensity={0.5} />
      <directionalLight />
      <Scene />
    </Canvas>
  );
}
