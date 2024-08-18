import {useRef, useEffect, useContext, useState, useSyncExternalStore } from 'react';
import { XRaysStoreContext } from '../reconstructionStore';

export default function ImageCanva({ ix, line, pointSetEv }) {
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
            if (line?.length === 2) {
                drawLine(ctx, line[0], line[1])
            }
        }
        
    }, [point, line, current.image]);

    const handleClick = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setPoint({ x, y });
        pointSetEv({x, y, "image_index": ix})
    }

    const drawPoint = (ctx, x, y) => {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
    };

    const drawLine = (ctx, a, b) => {
        const canvas = ctx.canvas;
        const width = canvas.width;

        console.log(current.image)
    
        a = a * 512 / 400 //TODO get from src
        const x1 = 0;
        const x2 = width;
        let y1 = a * x1 + b;
        let y2 = a * x2 + b;

    
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.stroke();
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