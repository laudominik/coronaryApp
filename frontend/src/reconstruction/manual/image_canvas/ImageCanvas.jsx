import { useContext, useState, useSyncExternalStore } from "react";
import ImageCanva from "./ImageCanva";
import CanvasColorPicker from "./CanvasColorPicker";
import { ReconstructionErrorStoreContext, XRaysStoreContext } from "../../reconstructionStore";
import config from "../../../config.json"

export default function ImageCanvas({onReconstructionReady}) {
    const [lines, setLines] = useState([]);
    const [points, setPoints] = useState([]);
    const xraysContext = useContext(XRaysStoreContext)
    const errorContext = useContext(ReconstructionErrorStoreContext)
    const xrays = useSyncExternalStore(xraysContext.subscribe(), xraysContext.get())
    const [linesColor, setLinesColor] = useState("#FF0000")
    const [pointsColor, setPointsColor] = useState("#00FF00")
    const [markedPoint, setMarkedPoint] = useState(null)

    async function onPointSet(point) {
        errorContext.set("")
        try {
            if(markedPoint == null || markedPoint.image_index === point.image_index) {
                const linesRequest = await sendLinesRequest(point)
                const linesBody = await linesRequest.json()
                if(linesRequest.status !== 200) {
                    errorContext.set(`${linesBody.message} - ${linesBody.reason}`)
                    clearAfterError()
                    return;
                }
                setLinesForChildren(linesBody, point.image_index)
                setMarkedPoint(point)
                setChildrenPoints([point])
            }
            else if (!!markedPoint) {
                setMarkedPoint(null)
                setLines([])
                setChildrenPoints([markedPoint, point])
                onReconstructionReady({first: markedPoint, second: point})
            }
        } catch (e) {
            errorContext.set("Backend error")
        }
    }

    function clearAfterError() {
        setMarkedPoint(null)
        setLines([])
        setChildrenPoints([])
    }

    function setChildrenPoints(points) {
        const newPoints = xrays.map((_, ix) => null)
        points.forEach(point => newPoints[point.image_index] = point)
        setPoints(newPoints)
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


    function setLinesForChildren(newLines, ix) {
        const childrenLines = {"a": addElementAt(newLines.a, ix, null), "b": addElementAt(newLines.b, ix, null)}
        setLines(childrenLines.a.map((item, index) => [item, childrenLines.b[index]]))
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
    

    return (
        <div className="utils__container canvas">
            <div className="canvas__title">
                <h2>Zaznacz dwa punkty na załadowanych zdjęciach</h2>
            </div>
            <div className="canvas__color-pickers">
                <CanvasColorPicker initColor={linesColor} onColorChanged={setLinesColor} title={"Kolor linii"} />
                <CanvasColorPicker initColor={pointsColor} onColorChanged={setPointsColor} title={"Kolor punktu"}/>
            </div>
            <div className="canvas__container">
            {
                xrays.map((_, ix) => <ImageCanva key={xrays[ix].id} ix={ix} line={lines[ix]} point={points[ix]} pointSetEv={onPointSet} lineColor={linesColor} pointColor={pointsColor} />)
            }
            </div>
        </div>
    )

}