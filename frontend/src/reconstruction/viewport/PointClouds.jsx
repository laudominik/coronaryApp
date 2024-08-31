import { useContext, useEffect, useRef, useSyncExternalStore } from "react";
import * as THREE from 'three';
import { CenterlineStoreContext, ShadowsStoreContext, SourcesStoreContext, VesselStoreContext, BifurcationStoreContext } from "../automatic/automaticStore";
import { ManualPointsStoreContext } from "../manual/manualStore";

const POINT_SIZE = 5.0;

export function Vessel() {
    const vesselContext = useContext(VesselStoreContext)
    const vessel = useSyncExternalStore(vesselContext.subscribe(), vesselContext.get())
    return <Cloud pcd={vessel} color='#ff0000' />
}

export function Centerlines() {
    const centerlinesContext = useContext(CenterlineStoreContext)
    const centerlines = useSyncExternalStore(centerlinesContext.subscribe(), centerlinesContext.get())
    return <Cloud pcd={centerlines} color='#0000ff' />
}

export function Bifurcations() {
    const bifurcationsContext = useContext(BifurcationStoreContext)
    const bifurcations = useSyncExternalStore(bifurcationsContext.subscribe(), bifurcationsContext.get())
    return <Cloud pcd={bifurcations} color='#ff00ff' />
}

export function ManualPoints() {
    const pointsContext = useContext(ManualPointsStoreContext)
    const points = useSyncExternalStore(pointsContext.subscribe(), pointsContext.get())
    return <Cloud pcd={points} color='#ff00ff' />
}

export function ImageShadows() {
    const shadowsContext = useContext(ShadowsStoreContext)
    const shadows = useSyncExternalStore(shadowsContext.subscribe(), shadowsContext.get())

    return (
        <>
            {shadows.map(el => <Cloud pcd={el} color='#000000' />)}
        </>
    )
}

export function Sources() {
    const sourcesContext = useContext(SourcesStoreContext)
    const sources = useSyncExternalStore(sourcesContext.subscribe(), sourcesContext.get())
    return <Cloud pcd={sources} color='#00ffff' size={10} />
}

function Cloud({ pcd, color, size = POINT_SIZE }) {
    const bufferRef = useRef()
    useEffect(() => {
        if (bufferRef.current) {
            const geometry = new THREE.BufferGeometry();
            const attribute = new THREE.Float32BufferAttribute(pcd.flat(), 3);
            geometry.setAttribute('position', attribute);

            bufferRef.current.geometry.dispose(); // Dispose of the old geometry to free up memory
            bufferRef.current.geometry = geometry;
            bufferRef.current.geometry.attributes.position.needsUpdate = true;
        }

    }, [pcd])
    return <points ref={bufferRef} castShadow receiveShadow>
        <bufferGeometry />
        <pointsMaterial attach="material" color={color} size={POINT_SIZE} sizeAttenuation={false} />
    </points>
}