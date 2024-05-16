import { useContext, useSyncExternalStore } from "react";
import ImageEntry from "./ImageEntry";
import { StoreContext } from "../store";
import AddImageButton from "./AddImageButton";

export default function ImageList() {
    const storeContext = useContext(StoreContext)
    const xrays = useSyncExternalStore(storeContext.subscribe(), storeContext.getXRays())

    return (
        <>
            {
                xrays.map((_, ix) => <ImageEntry key={xrays[ix].id} ix={ix} />)
            }

        </>

    )

}