import * as THREE from 'three';

import { useRef, useState } from "react";
import { Canvas, useThree } from '@react-three/fiber'
import { Grid, CameraControls } from '@react-three/drei'
import { useControls, buttonGroup } from 'leva'
import { Bifurcations, Centerlines, ImageShadows, Sources, Vessel } from './PointClouds';
import { Rays, Screens } from '../automatic/Screens';

const { DEG2RAD } = THREE.MathUtils

export default function Viewport(body /* crappy, but don't have better idea for now */, fullscreen) {
    console.log(body)
    return (
        <section className='viewport__wrapper'>
            <div className={body.fullscreen ? 'viewport__canvas-wrapper--fullscreen' : 'viewport__canvas-wrapper--not-fullscreen'}>
                <Canvas shadows camera={{ position: [0, 0, 0.1], fov: 100, near: 0.001 }} className='viewport__canvas'>
                    {body.children ?? <></>}
                </Canvas>
            </div>
        </section >
    )
}

export function Ground() {
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
