import {useRef, useEffect, useContext, useState, useSyncExternalStore, useCallback } from 'react';
import { XRaysStoreContext, ColorsStoreContext, CanvasStoreContext } from '../manualStore';

export default function ImageCanva({ ix, pointSetEv,  }) {
    const xraysContext = useContext(XRaysStoreContext)
    const canvasContext = useContext(CanvasStoreContext)
    const colorsContext = useContext(ColorsStoreContext)
    const xrays = useSyncExternalStore(xraysContext.subscribe(), xraysContext.get())
    const colors = useSyncExternalStore(colorsContext.subscribe(), colorsContext.get())
    const canvasData = useSyncExternalStore(canvasContext.subscribe(), canvasContext.get())
    const current = xrays[ix]
    const pointColor = colors.point
    const lineColor = colors.line
    const point = canvasData.points[ix]
    const line = canvasData.lines[ix]

    const canvasRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const drawPoint = useCallback((ctx, x, y) => {
        ctx.fillStyle = pointColor;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
    }, [pointColor]);

    const drawLine = useCallback((ctx, a, b) => {
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
    }, [lineColor, dimensions]);

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
    }, [point, line, current.image, lineColor, pointColor, drawLine, drawPoint]);

    const handleClick = (event) => {
        if(current.image) {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            pointSetEv({x, y, image_index: ix, x_scale: dimensions.width/canvas.width, y_scale: dimensions.height/canvas.height})    
        }
    }

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