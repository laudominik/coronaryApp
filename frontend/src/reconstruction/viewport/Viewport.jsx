import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { useEffect, useRef } from "react";






export default function Viewport({ pcd }) {
    const refContainer = useRef(null);

    function canvasWH() {
        const w = window.innerWidth * 0.6
        const result = w > 768 ? 768 : w
        return [result, result]
    }

    useEffect(() => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xe5e5e5)
        const [width, height] = canvasWH()
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        new OrbitControls(camera, renderer.domElement);

        renderer.setSize(width, height);
        if (refContainer.current) {
            refContainer.current.innerHTML = ''
            refContainer.current.appendChild(renderer.domElement);
        }
        var geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(pcd, 3))
        const material = new THREE.PointsMaterial({ color: 0x000000 });
        const points = new THREE.Points(geometry, material);
        scene.add(points);
        camera.position.z = 5;
        var animate = function () {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();
    }, []);

    return (
        <section style={{ backgroundColor: '#ededed', padding: "1em 0 1em 0" }}>
            <div ref={refContainer} />
        </section>
    )
}