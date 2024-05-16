import * as THREE from 'three';
import Viewport from "./viewport/Viewport";
import ImageList from './image_list/ImageList';
import { Container, Row, Col } from 'react-bootstrap';
import { useContext, useEffect, useState, useSyncExternalStore } from 'react';
import AddImageButton from './image_list/AddImageButton';
import StartReconstructionButton from './image_list/StartReconstructionButton';
import { StoreContext } from './store';

export default function Reconstruction() {
    const storeContext = useContext(StoreContext)
    const vertices = useSyncExternalStore(storeContext.subscribe(), storeContext.getVertices())

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