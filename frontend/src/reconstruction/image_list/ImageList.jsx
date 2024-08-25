import { useSyncExternalStore } from "react";
import ImageEntry from "./ImageEntry";

export default function ImageList({xraysContext}) {
    const xrays = useSyncExternalStore(xraysContext.subscribe(), xraysContext.get())

    return (
        <div className="utils__container">
            {
                xrays.map((_, ix) => <ImageEntry key={xrays[ix].id} ix={ix} xraysContext={xraysContext} />)
            }
        </div>

    )

}