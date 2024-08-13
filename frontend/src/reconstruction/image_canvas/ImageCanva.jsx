import {useRef, useEffect, useContext, useState, useSyncExternalStore } from 'react';
import { XRaysStoreContext } from '../reconstructionStore';

export default function ImageCanva({ ix }) {
    const xraysContext = useContext(XRaysStoreContext)
    const xrays = useSyncExternalStore(xraysContext.subscribe(), xraysContext.get())
    const current = xrays[ix]

    const canvasRef = useRef(null);
    const [point, setPoint] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = current.image;
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            if (point) {
                drawPoint(ctx, point.x, point.y);
            }
        }
        
    }, [point, current.image]);

    const handleClick = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setPoint({ x, y });
    }

    const drawPoint = (ctx, x, y) => {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
    };

    return (
        <section>
            <canvas
                ref={canvasRef}
                className="canva"
                width={400}
                height={500}
                onClick={handleClick}
            />
        </section>
    );
}