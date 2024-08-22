import { useContext, useState, useSyncExternalStore } from "react";
import ImageCanva from "./ImageCanva";
import CanvasColorPicker from "./CanvasColorPicker";
import { XRaysStoreContext } from "../../reconstructionStore";
import config from "../../../config.json"

export default function ImageCanvas() {
    const [lines, setLines] = useState([]);
    const xraysContext = useContext(XRaysStoreContext)
    const xrays = useSyncExternalStore(xraysContext.subscribe(), xraysContext.get())
    const [linesColor, setLinesColor] = useState("#FF0000")
    const [pointsColor, setPointsColor] = useState("#00FF00")
    let points = []

    async function onPointSet(point) {
        points = [...points, point]
        if(points.length === 1) {
            const linesRequest = await sendLinesRequest()
            setLinesForChildren(linesRequest, point.image_index)
        }
        points = []
        //else check if second
            //send request for reconstruction (event for parent)
            //set reconstruction result
            //clear lines and points on children -> method called from parent
    }

    async function sendLinesRequest() {
        const url = config["LINES_ENDPOINT"]
        const images = await Promise.all(xrays.map(async (xray) => {
            const dimensions = await getImageDimensions(xray.image)
            return {
                [`acquisition_params`]: {
                    sid: xray.acquisition_params.sid,
                    sod: xray.acquisition_params.sod,
                    alpha: xray.acquisition_params.alpha,
                    beta: xray.acquisition_params.beta,
                    spacing_c: xray.acquisition_params.spacing_c,
                    spacing_r: xray.acquisition_params.spacing_r,
                },
                [`image`]: {
                    width: dimensions.width,
                    height: dimensions.height
                }
            }
        }))

        //TODO extract to another method
        //TODO handle error

        const responseAsync = fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                "images": images,
                "point": points[0]
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        }) 
        try {
            return (await responseAsync).json()

        } catch (e) {
            return {"a": [], "b": []};
        }
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
                xrays.map((_, ix) => <ImageCanva key={xrays[ix].id} ix={ix} line={lines[ix]} pointSetEv={onPointSet} lineColor={linesColor} pointColor={pointsColor} />)
            }
            </div>
        </div>
    )

}