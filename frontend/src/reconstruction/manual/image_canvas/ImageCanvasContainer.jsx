import { useContext, useSyncExternalStore } from "react";
import ImageCanvas from "./ImageCanvas";
import CanvasColorPicker from "./CanvasColorPicker";
import { ManualErrorStoreContext, ManualDataStoreContext, XRaysStoreContext, ColorsStoreContext } from "../manualStore";
import { sendLinesRequest } from "../manualService";

export default function ImageCanvasContainer() {
    const xraysContext = useContext(XRaysStoreContext)
    const errorContext = useContext(ManualErrorStoreContext)
    const manualDataContext = useContext(ManualDataStoreContext)
    const colorsContext = useContext(ColorsStoreContext)
    const xrays = useSyncExternalStore(xraysContext.subscribe(), xraysContext.get())
    const manualData = useSyncExternalStore(manualDataContext.subscribe(), manualDataContext.get())
    const colors = useSyncExternalStore(colorsContext.subscribe(), colorsContext.get())
    async function onPointSet(point) {
        errorContext.set("")
        const markedPoint = manualData.markedPoints?.[0]
        try {
            if(manualData.markedPoints?.length !== 1 || markedPoint?.image_index === point.image_index) {
                const linesRequest = await sendLinesRequest(xrays, point)
                const linesBody = await linesRequest.json()
                if(linesRequest.status !== 200) {
                    errorContext.set(`${linesBody.message} - ${linesBody.reason}`)
                    clearAfterError()
                } else {
                    const childrenLines = getLinesForChildren(linesBody, point.image_index)
                    const childrenPoints = getChildrenPoints([point])
                    setCanvasData(childrenLines, childrenPoints, [point])
                }
            }
            else if (manualData.markedPoints?.length === 1) {
                const childrenPoints = getChildrenPoints([markedPoint, point])
                setCanvasData([], childrenPoints, [markedPoint, point])
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

    function setLinesColor(color) {
        colorsContext.set({point: colors.point, line: color})
    }

    function setPointsColor(color) {
        colorsContext.set({point: color, line: colors.line})
    }

    function setCanvasData(lines, points, markedPoints) {
        manualDataContext.set({lines: lines, points: points, markedPoints: markedPoints})
    }
    

    return (
        <div className="utils__container canvas">
            <div className="canvas__title">
                <h2>Choose two points on the photos below</h2>
            </div>
            <div className="canvas__color-pickers">
                <CanvasColorPicker initColor={colors.line} onColorChanged={setLinesColor} title={"Line color"} />
                <CanvasColorPicker initColor={colors.point} onColorChanged={setPointsColor} title={"Point color"}/>
            </div>
            <div className="canvas__container">
            {
                xrays.map((_, ix) => <ImageCanvas key={xrays[ix].id} ix={ix} pointSetEv={onPointSet} />)
            }
            </div>
        </div>
    )

}