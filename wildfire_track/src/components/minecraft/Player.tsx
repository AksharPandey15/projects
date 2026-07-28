import { useSphere } from '@react-three/cannon';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { useKeyboard } from './hooks/useKeyboard';
import { useStore } from './hooks/useStore';
import { PlayerModel } from './PlayerModel';
import * as THREE from 'three';

const JUMP_FORCE = 4;
const SPEED = 4;
const THIRD_PERSON_DISTANCE = 5;
const CAMERA_LERP_FACTOR = 0.1; // How smooth camera follows (0-1, lower = smoother)
const ROTATION_LERP_FACTOR = 0.15; // How smooth rotation changes (0-1, lower = smoother)
const INPUT_SMOOTHING = 0.8; // Input smoothing factor (0-1, higher = more smoothing)
const INPUT_DECAY = 0.3; // How fast inputs decay when keys are released (0-1, lower = faster decay)
const INPUT_THRESHOLD = 0.01; // Minimum input value to register movement
const MOVEMENT_PREDICTION = 0.05; // How much to predict movement (in seconds)

export const Player = () => {
  const { camera } = useThree();
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 1, 0],
  }));

  const viewMode = useStore((state) => state.viewMode);
  const toggleViewMode = useStore((state) => state.toggleViewMode);

  // Player rotation state for model facing direction
  const [playerRotation, setPlayerRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [isMoving, setIsMoving] = useState(false);

  // Smoothing refs
  const targetCameraPos = useRef(new THREE.Vector3());
  const currentCameraPos = useRef(new THREE.Vector3());
  const targetPlayerRotation = useRef<[number, number, number]>([0, 0, 0]);
  const currentPlayerRotation = useRef<[number, number, number]>([0, 0, 0]);
  
  // Input smoothing
  const smoothedInputs = useRef({
    forward: 0,
    backward: 0,
    left: 0,
    right: 0
  });

  // State subscriptions
  const pos = useRef([0, 0, 0]);
  useEffect(() => {
    const unsub = api.position.subscribe((p) => (pos.current = p));
    return unsub;
  }, [api.position]);

  const vel = useRef([0, 0, 0]);
  useEffect(() => {
    const unsub = api.velocity.subscribe((v) => (vel.current = v));
    return unsub;
  }, [api.velocity]);

  const { moveBackward, moveForward, moveLeft, moveRight, jump, toggleView } = useKeyboard();

  // Handle view toggle
  useEffect(() => {
    if (toggleView) {
      toggleViewMode();
    }
  }, [toggleView, toggleViewMode]);

  useFrame(() => {
    // Calculate target camera position
    if (viewMode === 'firstPerson') {
      targetCameraPos.current.set(pos.current[0], pos.current[1], pos.current[2]);
    } else {
      // Third person: position camera behind player
      const playerPos = pos.current;
      const direction = camera.getWorldDirection(new THREE.Vector3()).negate();
      targetCameraPos.current.set(
        playerPos[0] + direction.x * THIRD_PERSON_DISTANCE,
        playerPos[1] + 2, // Slightly above player
        playerPos[2] + direction.z * THIRD_PERSON_DISTANCE
      );
    }

    // Smooth camera position with lerp
    currentCameraPos.current.lerp(targetCameraPos.current, CAMERA_LERP_FACTOR);
    camera.position.copy(currentCameraPos.current);

    // Smooth input values with different decay rates
    const smoothInput = (current: number, target: number) => {
      const smoothingFactor = target > current ? INPUT_SMOOTHING : INPUT_DECAY;
      return THREE.MathUtils.lerp(current, target, smoothingFactor);
    };

    smoothedInputs.current.forward = smoothInput(
      smoothedInputs.current.forward,
      Number(moveForward)
    );
    smoothedInputs.current.backward = smoothInput(
      smoothedInputs.current.backward,
      Number(moveBackward)
    );
    smoothedInputs.current.left = smoothInput(
      smoothedInputs.current.left,
      Number(moveLeft)
    );
    smoothedInputs.current.right = smoothInput(
      smoothedInputs.current.right,
      Number(moveRight)
    );

    // Apply threshold to prevent micro-movements
    if (Math.abs(smoothedInputs.current.forward) < INPUT_THRESHOLD) smoothedInputs.current.forward = 0;
    if (Math.abs(smoothedInputs.current.backward) < INPUT_THRESHOLD) smoothedInputs.current.backward = 0;
    if (Math.abs(smoothedInputs.current.left) < INPUT_THRESHOLD) smoothedInputs.current.left = 0;
    if (Math.abs(smoothedInputs.current.right) < INPUT_THRESHOLD) smoothedInputs.current.right = 0;

    const frontVector = camera.position.clone().set(
      0,
      0,
      (smoothedInputs.current.backward - smoothedInputs.current.forward)
    );
    
    const sideVector = camera.position.clone().set(
      (smoothedInputs.current.left - smoothedInputs.current.right),
      0,
      0
    );

    const direction = camera.position.clone().set(0, 0, 0)
      .subVectors(frontVector, sideVector);

    // Only normalize and apply speed if there's significant movement
    const hasMovement = direction.length() > INPUT_THRESHOLD;
    if (hasMovement) {
      direction.normalize().multiplyScalar(SPEED);
    } else {
      direction.set(0, 0, 0);
    }

    // Add movement prediction for more responsive feel
    if (hasMovement) {
      const predictedPos = [
        pos.current[0] + direction.x * MOVEMENT_PREDICTION,
        pos.current[1] + direction.y * MOVEMENT_PREDICTION,
        pos.current[2] + direction.z * MOVEMENT_PREDICTION
      ];
      
      // Update target camera position with prediction
      if (viewMode === 'firstPerson') {
        targetCameraPos.current.set(predictedPos[0], predictedPos[1], predictedPos[2]);
      } else {
        const playerPos = predictedPos;
        const camDirection = camera.getWorldDirection(new THREE.Vector3()).negate();
        targetCameraPos.current.set(
          playerPos[0] + camDirection.x * THIRD_PERSON_DISTANCE,
          playerPos[1] + 2,
          playerPos[2] + camDirection.z * THIRD_PERSON_DISTANCE
        );
      }
    }

    direction.applyEuler(camera.rotation);

    // Calculate player facing direction based on movement
    if (hasMovement) {
      const angle = Math.atan2(direction.x, direction.z);
      targetPlayerRotation.current = [0, angle, 0];
      setIsMoving(true);
    } else {
      setIsMoving(false);
    }

    // Smooth player rotation with lerp
    currentPlayerRotation.current[0] = THREE.MathUtils.lerp(
      currentPlayerRotation.current[0], 
      targetPlayerRotation.current[0], 
      ROTATION_LERP_FACTOR
    );
    currentPlayerRotation.current[1] = THREE.MathUtils.lerp(
      currentPlayerRotation.current[1], 
      targetPlayerRotation.current[1], 
      ROTATION_LERP_FACTOR
    );
    currentPlayerRotation.current[2] = THREE.MathUtils.lerp(
      currentPlayerRotation.current[2], 
      targetPlayerRotation.current[2], 
      ROTATION_LERP_FACTOR
    );

    setPlayerRotation([...currentPlayerRotation.current]);

    api.velocity.set(direction.x, vel.current[1], direction.z);

    if (jump && Math.abs(vel.current[1]) < 0.05) {
      api.velocity.set(vel.current[0], JUMP_FORCE, vel.current[2]);
    }
  });

  return (
    <>
      <mesh ref={ref as any} />
      {viewMode === 'thirdPerson' && (
        <PlayerModel
          position={[pos.current[0], pos.current[1] - 0.5, pos.current[2]]}
          rotation={playerRotation}
          isMoving={isMoving}
          velocity={[vel.current[0], vel.current[1], vel.current[2]]}
        />
      )}
    </>
  );
};
