import { useContext, useState, useSyncExternalStore } from "react";
import ImageCanva from "./ImageCanva";
import { XRaysStoreContext } from "../reconstructionStore";
import config from "../../config.json"

export default function ImageCanvas() {
    const [lines, setLines] = useState([]);
    const xraysContext = useContext(XRaysStoreContext)
    const xrays = useSyncExternalStore(xraysContext.subscribe(), xraysContext.get())
    let points = []

    function onPointSet(point) {
        points = [...points, point]
        if(points.length === 1) {
            const linesRequest = sendLinesRequest()
            setLinesForChildren(linesRequest, point.image_index)
        }
        points = []
        //check if first
            //send request for lines
            //set lines for each child except id
        //else check if second
            //send request for reconstruction (event for parent)
            //set reconstruction result
            //clear lines and points on children -> method called from parent
    }

    function sendLinesRequest() {
        const url = config["LINES_ENDPOINT"]/*
        const responseAsync = fetch(url, {
            method: 'POST',
            body: {
                "images": xraysContext.serialized(),
                "point": points[0]
            },
            headers: {
                'Content-Type': 'text/plain',
            }
        })*/
        try {
            return {"a": [-0.8792985953094256],"b": [390.08426994212505]} //SWAP TO REQUEST

        } catch (e) {
            return [];
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
    

    return (
        <div className="utils__container canvas">
            <div className="canvas__title">
                <h2>Zaznacz dwa punkty na załadowanych zdjęciach</h2>
            </div>
            <div className="canvas__container">
            {
                xrays.map((_, ix) => <ImageCanva key={xrays[ix].id} ix={ix} line={lines[ix]} pointSetEv={onPointSet} />)
            }
            </div>
        </div>
    )

}