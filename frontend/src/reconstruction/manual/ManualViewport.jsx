import * as THREE from 'three';

import { useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Canvas, useThree } from '@react-three/fiber'
import { Grid, CameraControls } from '@react-three/drei'
import { useControls, buttonGroup } from 'leva'
import { ManualBifurcations } from '../viewport/PointClouds';
import { Ground } from '../viewport/Viewport'

const { DEG2RAD } = THREE.MathUtils

export default function ManualViewport() {
    const [fullscreen, setFullscreen] = useState(false)

    return (
        <section className='viewport__wrapper'>
            <div className={fullscreen ? 'viewport__canvas-wrapper--fullscreen' : 'viewport__canvas-wrapper--not-fullscreen'}>
                <Canvas shadows camera={{ position: [0, 0, 0.1], fov: 100, near: 0.001 }} className='viewport__canvas'>
                    <ManualScene setFullscreen={setFullscreen} />
                </Canvas>
            </div>  
        </section >
    )
}

// src: https://codesandbox.io/p/sandbox/cameracontrols-basic-sew669?file=%2Fsrc%2FApp.js%3A1%2C1-178%2C3
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
            <ManualBifurcations />
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