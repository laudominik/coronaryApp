import { useContext, useEffect, useRef, useSyncExternalStore } from "react";
import * as THREE from 'three';
import { CenterlineStoreContext, ShadowsStoreContext, SourcesStoreContext, VesselStoreContext } from "../reconstructionStore";


export function Vessel() {
    const vesselContext = useContext(VesselStoreContext)
    const vessel = useSyncExternalStore(vesselContext.subscribe(), vesselContext.get())
    return <Cloud pcd={vessel} color='#ff0000' />
}

export function ImageShadows() {
    const shadowsContext = useContext(ShadowsStoreContext)
    const shadows = useSyncExternalStore(shadowsContext.subscribe(), shadowsContext.get())
    return <Cloud pcd={shadows} color='#000000' />
}

export function Centerlines() {
    const centerlinesContext = useContext(CenterlineStoreContext)
    const centerlines = useSyncExternalStore(centerlinesContext.subscribe(), centerlinesContext.get())
    return <Cloud pcd={centerlines} color='#0000ff' />
}

export function Sources() {
    const sourcesContext = useContext(SourcesStoreContext)
    const sources = useSyncExternalStore(sourcesContext.subscribe(), sourcesContext.get())
    return <Cloud pcd={sources} color='#ffff00' />
}

function Cloud({ pcd, color }) {
    const bufferRef = useRef()
    useEffect(() => {
        if (bufferRef.current) {
            const geometry = new THREE.BufferGeometry();
            const attribute = new THREE.Float32BufferAttribute(pcd, 3);
            geometry.setAttribute('position', attribute);

            bufferRef.current.geometry.dispose(); // Dispose of the old geometry to free up memory
            bufferRef.current.geometry = geometry;
            bufferRef.current.geometry.attributes.position.needsUpdate = true;
        }

    }, [pcd])
    return <points ref={bufferRef} castShadow receiveShadow>
        <bufferGeometry />
        <pointsMaterial attach="material" color={color} />
    </points>
}