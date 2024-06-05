import * as THREE from 'three';

import { useRef, useState } from "react";
import { Canvas, useThree } from '@react-three/fiber'
import { Grid, CameraControls } from '@react-three/drei'
import { useControls, buttonGroup } from 'leva'
import { Centerlines, ImageShadows, Sources, Vessel } from './PointClouds';

const { DEG2RAD } = THREE.MathUtils

export default function Viewport() {
    const [fullscreen, setFullscreen] = useState(false)

    return (
        <section style={{ backgroundColor: '#ededed', padding: "1em 0 1em 0" }}>
            <div style={fullscreen ? {
                position: "fixed",
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 10
            } : { height: "50vh", width: "60%" }}
            >
                <Canvas shadows camera={{ position: [0, 0, 0.1], fov: 100, near: 0.001 }} style={{ background: '#ededed' }}>
                    <Scene setFullscreen={setFullscreen} />
                </Canvas>
            </div>
        </section >
    )
}

// src: https://codesandbox.io/p/sandbox/cameracontrols-basic-sew669?file=%2Fsrc%2FApp.js%3A1%2C1-178%2C3
function Scene({ setFullscreen }) {
    const cameraControlsRef = useRef()

    const { camera } = useThree()
    const { enabled, vessel, centerlines, shadows, sources } = useControls({
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
        }),
        vessel: { value: true, label: 'show vessel' },
        centerlines: { value: false, label: 'show centerline' },
        shadows: { value: false, label: 'show shadows' },
        sources: { value: false, label: 'show sources' }
    })

    return (
        <>
            {vessel ? <Vessel /> : <></>}
            {shadows ? <ImageShadows /> : <></>}
            {sources ? <Sources /> : <></>}
            {centerlines ? <Centerlines /> : <></>}

            <group position-y={-1.0}>
                <Ground />
                {/* <Shadows /> */}
                <CameraControls
                    ref={cameraControlsRef}
                    enabled={enabled}
                />
            </group>
        </>
    )
}

function Ground() {
    const gridConfig = {
        cellSize: 0.5,
        cellThickness: 0.5,
        cellColor: '#6f6f6f',
        sectionSize: 3,
        sectionThickness: 1,
        sectionColor: '#9d4b4b',
        fadeDistance: 30,
        fadeStrength: 1,
        followCamera: false,
        infiniteGrid: true
    }
    return <Grid position={[0, -0.01, 0]} args={[10.5, 10.5]} {...gridConfig} />
}
