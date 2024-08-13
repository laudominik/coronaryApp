import { useContext, useSyncExternalStore } from "react";
import ImageCanva from "./ImageCanva";
import { XRaysStoreContext } from "../reconstructionStore";

export default function ImageCanvas() {
    const xraysContext = useContext(XRaysStoreContext)
    const xrays = useSyncExternalStore(xraysContext.subscribe(), xraysContext.get())

    return (
        <div className="utils__container canvas">
            <div className="canvas__title">
                <h2>Zaznacz dwa punkty na załadowanych zdjęciach</h2>
            </div>
            <div className="canvas__container">
            {
                xrays.map((_, ix) => <ImageCanva key={xrays[ix].id} ix={ix} />)
            }
            </div>
        </div>
    )

}