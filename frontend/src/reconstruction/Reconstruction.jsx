import * as THREE from 'three';
import Viewport from "./viewport/Viewport";
import ImageList from './image_list/ImageList';
import { Container, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import AddImageButton from './image_list/AddImageButton';
import StartReconstructionButton from './image_list/StartReconstructionButton';

export default function Reconstruction() {
    const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1280);

    // TODO: change to backend's response
    const vertices = [];
    for (let i = 0; i < 1000; i++) {
        const x = THREE.MathUtils.randFloatSpread(2000);
        const y = THREE.MathUtils.randFloatSpread(2000);
        const z = THREE.MathUtils.randFloatSpread(2000);
        vertices.push(x, y, z);
    }
    useEffect(() => {
        const handleResize = () => {
            setIsWideScreen(window.innerWidth > 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    return (
        <main>
            <center>
                <Viewport pcd={vertices} />
                <div style={{ width: '60%', display: 'flex', justifyContent: 'space-between', padding: 0 }}>
                    <AddImageButton />
                    <StartReconstructionButton />
                </div>
                <div style={{ width: '60%' }}>
                    <ImageList />
                </div>

            </center>
        </main>
    )
}