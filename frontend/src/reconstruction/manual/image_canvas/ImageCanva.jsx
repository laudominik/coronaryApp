import {useRef, useEffect, useContext, useState, useSyncExternalStore } from 'react';
import { XRaysStoreContext } from '../../reconstructionStore';

export default function ImageCanva({ ix, line, pointSetEv, lineColor, pointColor, point }) {
    const xraysContext = useContext(XRaysStoreContext)
    const xrays = useSyncExternalStore(xraysContext.subscribe(), xraysContext.get())
    const current = xrays[ix]

    const canvasRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = current.image;
        img.onload = () => {
            setDimensions({
                width: img.width,
                height: img.height
            })
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            if (point) {
                drawPoint(ctx, point.x, point.y);
            }
            if (line?.length === 2 && line[0] && line[1]) {
                drawLine(ctx, line[0], line[1])
            }
        }
        
    }, [point, line, current.image, lineColor, pointColor]);

    const handleClick = (event) => {
        if(current.image) {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            pointSetEv({x, y, image_index: ix, x_scale: dimensions.width/canvas.width, y_scale: dimensions.height/canvas.height})    
        }
    }

    const drawPoint = (ctx, x, y) => {
        ctx.fillStyle = pointColor;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
    };

    const drawLine = (ctx, a, b) => {
        const canvas = ctx.canvas;
        const x1 = 0;
        const x2 = canvas.width;

        const scale = canvas.height / dimensions.height; 
        const y1 = b * scale
        const y2 = (a * dimensions.width + b) * scale

    
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = lineColor;
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