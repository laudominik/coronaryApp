import * as THREE from 'three';
import { useRef, useState } from "react";
import { Canvas, useThree } from '@react-three/fiber'
import { Grid, CameraControls } from '@react-three/drei'
import { useControls, buttonGroup } from 'leva'
import { Bifurcations, Centerlines, ImageShadows, Sources, Vessel } from '../viewport/PointClouds';
import { Rays, Screens } from '../automatic/Screens';
import Viewport, { Ground } from '../viewport/Viewport';

const { DEG2RAD } = THREE.MathUtils

export default function AutomaticViewport(){
    const [fullscreen, setFullscreen] = useState(false)

    return <Viewport fullscreen={fullscreen}>
        <AutomaticScene setFullscreen={setFullscreen} />
    </Viewport>
}

// src: https://codesandbox.io/p/sandbox/cameracontrols-basic-sew669?file=%2Fsrc%2FApp.js%3A1%2C1-178%2C3
function AutomaticScene({ setFullscreen }) {
    const cameraControlsRef = useRef()

    const { camera } = useThree()
    const { enabled, vessel, centerlines, shadows, sources, bifurcations } = useControls({
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
        bifurcations: { value: false, label: 'show bifurcations' },
        shadows: { value: false, label: 'show shadows' },
        sources: { value: false, label: 'show sources' }
    })

    return (
        <>
            {vessel ? <Vessel /> : <></>}
            {shadows ? <ImageShadows /> : <></>}
            {shadows ? <Screens /> : <></>}
            {sources ? <Sources /> : <></>}
            {centerlines ? <Centerlines /> : <></>}
            {bifurcations ? <Bifurcations /> : <></>}

            {shadows && sources ? <Rays /> : <></>}

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