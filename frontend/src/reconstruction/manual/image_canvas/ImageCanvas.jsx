import {useRef, useEffect, useContext, useState, useSyncExternalStore, useCallback } from 'react';
import { XRaysStoreContext, ColorsStoreContext, ManualDataStoreContext } from '../manualStore';

export default function ImageCanvas({ ix, pointSetEv,  }) {
    const xraysContext = useContext(XRaysStoreContext)
    const manualDataContext = useContext(ManualDataStoreContext)
    const colorsContext = useContext(ColorsStoreContext)
    const xrays = useSyncExternalStore(xraysContext.subscribe(), xraysContext.get())
    const colors = useSyncExternalStore(colorsContext.subscribe(), colorsContext.get())
    const manualData = useSyncExternalStore(manualDataContext.subscribe(), manualDataContext.get())
    const current = xrays[ix]
    const pointColor = colors.point
    const lineColor = colors.line
    const point = manualData.points[ix]
    const line = manualData.lines[ix]

    const canvasRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const drawPoint = (ctx, x, y) => {
        ctx.fillStyle = pointColor;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
    };

    const drawLine = (ctx, a, b, scale_x, scale_y) => {
        const canvas = ctx.canvas;
        const x1 = 0;
        const x2 = canvas.width;

        const y1 = b * scale_y
        const y2 = (a * scale_x + b) * scale_y
            
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 2;
        ctx.stroke();
    };

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
                drawLine(ctx, line[0], line[1], img.width, canvas.height / img.height)
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

    return (
        <section>
            <canvas
                ref={canvasRef}
                id={`imageCanvas${ix}`}
                className="canva"
                width={400}
                height={500}
                onClick={handleClick}
            />
        </section>
    );
}