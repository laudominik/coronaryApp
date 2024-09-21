import * as THREE from 'three';
import { useContext, useEffect, useRef, useSyncExternalStore } from "react"
import { RectsStoreContext, ShadowsStoreContext, SourcesStoreContext } from "./automaticStore"

export function Rays() {
    const SUBSAMPLING = 1000

    const sourcesContext = useContext(SourcesStoreContext)
    const sources = useSyncExternalStore(sourcesContext.subscribe(), sourcesContext.get())
    const shadowsContext = useContext(ShadowsStoreContext)
    const shadows = useSyncExternalStore(shadowsContext.subscribe(), shadowsContext.get())
    const bufferRef = useRef()

    useEffect(() => {
        if (bufferRef.current) {
            const vertices = []

            for (const i in shadows) {
                const shadow = shadows[i];
                const source = sources[i];

                for (const j in shadow) {
                    if (j % SUBSAMPLING != 0) continue;
                    const p = shadow[j]
                    vertices.push(source[0], source[1], source[2], p[0], p[1], p[2])
                }
            }

            const geometry = new THREE.BufferGeometry();
            const attribute = new THREE.Float32BufferAttribute(vertices, 3);
            geometry.setAttribute('position', attribute);

            bufferRef.current.geometry.dispose();
            bufferRef.current.geometry = geometry;
            bufferRef.current.geometry.attributes.position.needsUpdate = true;
        }

    }, [sources, shadows])
    return <lineSegments ref={bufferRef}>
        <bufferGeometry />
        <lineBasicMaterial color={'#ffff00'} transparent={false} opacity={0.5} />
    </lineSegments>
}

export function Screens() {
    const bufferRef = useRef()
    const rectsContext = useContext(RectsStoreContext)
    const rects = useSyncExternalStore(rectsContext.subscribe(), rectsContext.get())
    console.log("rects", rects)
    useEffect(() => {
        if (bufferRef.current) {
            const vertices = []
            for (const rect of rects) {
                vertices.push(rect[0][0], rect[0][1], rect[0][2], rect[1][0], rect[1][1], rect[1][2])
                vertices.push(rect[0][0], rect[0][1], rect[0][2], rect[2][0], rect[2][1], rect[2][2])
                vertices.push(rect[3][0], rect[3][1], rect[3][2], rect[1][0], rect[1][1], rect[1][2])
                vertices.push(rect[3][0], rect[3][1], rect[3][2], rect[2][0], rect[2][1], rect[2][2])
            }

            const geometry = new THREE.BufferGeometry();
            const attribute = new THREE.Float32BufferAttribute(vertices, 3);
            geometry.setAttribute('position', attribute);

            bufferRef.current.geometry.dispose();
            bufferRef.current.geometry = geometry;
            bufferRef.current.geometry.attributes.position.needsUpdate = true;
        }
    }, [rects])

    return <lineSegments ref={bufferRef}>
        <bufferGeometry />
        <lineBasicMaterial color={'#000000'} />
    </lineSegments>
}