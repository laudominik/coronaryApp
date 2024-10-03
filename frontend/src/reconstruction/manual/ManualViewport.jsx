import * as THREE from 'three';

import { useRef, useState } from "react";
import { Canvas, useThree } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import { useControls, buttonGroup } from 'leva'
import { ManualPoints } from '../viewport/PointClouds';
import Viewport, { Ground } from '../viewport/Viewport'

const { DEG2RAD } = THREE.MathUtils

export default function ManualViewport(){
    const [fullscreen, setFullscreen] = useState(false)

    return <Viewport fullscreen={fullscreen}>
        <ManualScene setFullscreen={setFullscreen}/>
    </Viewport>
}

function ManualScene({ setFullscreen }) {
    const cameraControlsRef = useRef()

    const { camera } = useThree()
    const { enabled} = useControls({
        zaxis: buttonGroup({
            label: 'rotate z axis',
            opts: {
                '+45º': () => cameraControlsRef.current?.rotate(45 * DEG2RAD, 0, true),
                '-90º': () => cameraControlsRef.current?.rotate(-90 * DEG2RAD, 0, true),
                '+360º': () => cameraControlsRef.current?.rotate(360 * DEG2RAD, 0, true)
            }
        }),
        yaxis: buttonGroup({
            label: 'rotate y axis',
            opts: {
                '+20º': () => cameraControlsRef.current?.rotate(0, 20 * DEG2RAD, true),
                '-40º': () => cameraControlsRef.current?.rotate(0, -40 * DEG2RAD, true)
            }
        }),

        zoomGrp: buttonGroup({
            label: 'zoom',
            opts: {
                '+': () => cameraControlsRef.current?.zoom(camera.zoom / 2, true),
                '-': () => cameraControlsRef.current?.zoom(-camera.zoom / 2, true)
            }
        }),

        minimaxi: buttonGroup({
            label: 'fullscreen',
            opts: {
                'maximize': () => setFullscreen(true),
                'minimize': () => setFullscreen(false)
            }
        })
    })

    return (
        <>
            <ManualPoints />
            <group position-y={-1.0}>
                <Ground />
                <CameraControls
                    ref={cameraControlsRef}
                    enabled={enabled}
                />
            </group>
        </>
    )
}