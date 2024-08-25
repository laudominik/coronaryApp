import { useContext, useState, useSyncExternalStore } from "react";
import ImageCanva from "./ImageCanva";
import CanvasColorPicker from "./CanvasColorPicker";
import { ManualErrorStoreContext, CanvasStoreContext, XRaysStoreContext, ColorsStoreContext } from "../manualStore";
import config from "../../../config.json"

export default function ImageCanvas({onReconstructionReady}) {
    const xraysContext = useContext(XRaysStoreContext)
    const errorContext = useContext(ManualErrorStoreContext)
    const canvasContext = useContext(CanvasStoreContext)
    const colorsContext = useContext(ColorsStoreContext)
    const xrays = useSyncExternalStore(xraysContext.subscribe(), xraysContext.get())
    const canvasData = useSyncExternalStore(canvasContext.subscribe(), canvasContext.get())
    const colors = useSyncExternalStore(colorsContext.subscribe(), colorsContext.get())

    async function onPointSet(point) {
        errorContext.set("")
        try {
            if(canvasData.markedPoint == null || canvasData.markedPoint.image_index === point.image_index) {
                const linesRequest = await sendLinesRequest(point)
                const linesBody = await linesRequest.json()
                if(linesRequest.status !== 200) {
                    errorContext.set(`${linesBody.message} - ${linesBody.reason}`)
                    clearAfterError()
                    return;
                }
                const childrenLines = getLinesForChildren(linesBody, point.image_index)
                const childrenPoints = getChildrenPoints([point])
                setCanvasData(childrenLines, childrenPoints, point)
            }
            else if (!!canvasData.markedPoint) {
                const childrenPoints = getChildrenPoints([canvasData.markedPoint, point])
                setCanvasData([], childrenPoints, null)
                onReconstructionReady({first: canvasData.markedPoint, second: point})
            }
        } catch (e) {
            errorContext.set("Backend error")
        }
    }

    function clearAfterError() {
        setCanvasData([], [], null)
    }

    function getChildrenPoints(points) {
        const newPoints = xrays.map((_, ix) => null)
        points.forEach(point => newPoints[point.image_index] = point)
        return newPoints;
    }

    async function sendLinesRequest(point) {
        const url = config["LINES_ENDPOINT"]
        const images = await createImagesRequestParameter()

        const responseAsync = fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                "images": images,
                point: scaledPoint(point)
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        }) 
        return await responseAsync
    }

    async function createImagesRequestParameter() {
        return await Promise.all(xrays.map(async (xray) => {
            const dimensions = await getImageDimensions(xray.image)
            return {
                [`acquisition_params`]: {
                    sid: parseFloat(xray.acquisition_params.sid),
                    sod: parseFloat(xray.acquisition_params.sod),
                    alpha: parseFloat(xray.acquisition_params.alpha),
                    beta: parseFloat(xray.acquisition_params.beta),
                    spacing_c: parseFloat(xray.acquisition_params.spacing_c),
                    spacing_r: parseFloat(xray.acquisition_params.spacing_r),
                },
                [`image`]: {
                    width: dimensions.width,
                    height: dimensions.height
                }
            }
        }))
    }

    function getLinesForChildren(newLines, ix) {
        const childrenLines = {"a": addElementAt(newLines.a, ix, null), "b": addElementAt(newLines.b, ix, null)}
        return childrenLines.a.map((item, index) => [item, childrenLines.b[index]])
    }
    
    function addElementAt(array, index, element) {
        return [
            ...array.slice(0, index),
            element,
            ...array.slice(index)
        ];  
    };

    function scaledPoint(point) {
        return {
            x: point.x * point.x_scale,
            y: point.y * point.y_scale,
            image_index: point.image_index
        }
    }

    async function getImageDimensions(src) {
        return new Promise (function (resolved, _) {
          let image = new Image()
          image.onload = () => {
            resolved({width: image.width, height: image.height})
          };
          image.src = src
        })
      }

    function setLinesColor(color) {
        colorsContext.set({point: colors.point, line: color})
    }

    function setPointsColor(color) {
        colorsContext.set({point: color, line: colors.line})
    }

    function setCanvasData(lines, points, markedPoint) {
        canvasContext.set({lines: lines, points: points, markedPoint: markedPoint})
    }
    

    return (
        <div className="utils__container canvas">
            <div className="canvas__title">
                <h2>Zaznacz dwa punkty na załadowanych zdjęciach</h2>
            </div>
            <div className="canvas__color-pickers">
                <CanvasColorPicker initColor={colors.line} onColorChanged={setLinesColor} title={"Kolor linii"} />
                <CanvasColorPicker initColor={colors.point} onColorChanged={setPointsColor} title={"Kolor punktu"}/>
            </div>
            <div className="canvas__container">
            {
                xrays.map((_, ix) => <ImageCanva key={xrays[ix].id} ix={ix} pointSetEv={onPointSet} />)
            }
            </div>
        </div>
    )

}