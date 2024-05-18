import * as THREE from 'three';
import Viewport from "./viewport/Viewport";
import ImageList from './image_list/ImageList';
import { Container, Row, Col } from 'react-bootstrap';
import { useContext, useEffect, useState, useSyncExternalStore } from 'react';
import AddImageButton from './image_list/AddImageButton';
import StartReconstructionButton from './image_list/StartReconstructionButton';
import { ReconstructionErrorStoreContext, VerticesStoreContext } from './store';

export default function Reconstruction() {
    const verticesContext = useContext(VerticesStoreContext)
    const vertices = useSyncExternalStore(verticesContext.subscribe(), verticesContext.get())
    const errorContext = useContext(ReconstructionErrorStoreContext)
    const error = useSyncExternalStore(errorContext.subscribe(), errorContext.get())

    return (
        <main>
            <center>
                <Viewport pcd={vertices} />
                {
                    error == "" ? <></> :
                        <span style={{ color: 'red' }}> ERROR: {error} </span>
                }
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