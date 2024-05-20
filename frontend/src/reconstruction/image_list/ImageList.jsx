import { useContext, useSyncExternalStore } from "react";
import ImageEntry from "./ImageEntry";
import { XRaysStoreContext } from "../reconstructionStore";
import AddImageButton from "./AddImageButton";

export default function ImageList() {
    const xraysContext = useContext(XRaysStoreContext)
    const xrays = useSyncExternalStore(xraysContext.subscribe(), xraysContext.get())

    return (
        <>
            {
                xrays.map((_, ix) => <ImageEntry key={xrays[ix].id} ix={ix} />)
            }

        </>

    )

}