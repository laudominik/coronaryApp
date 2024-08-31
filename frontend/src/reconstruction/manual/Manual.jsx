import { useContext, useSyncExternalStore } from "react";
import ImageList from '../image_list/ImageList';
import AddImageButton from '../image_list/AddImageButton';
import CreatePointButton from "./CreatePointButton.jsx";
import { ManualErrorStoreContext, XRaysStoreContext } from './manualStore';
import ClearPointsButton from "./ClearPointsButton.jsx";
import ImageCanvasContainer from "./image_canvas/ImageCanvasContainer.jsx";
import Viewport from "../viewport/Viewport.jsx";
import ManualViewport from "./ManualViewport.jsx";



export default function Manual() {

    const xraysContext = useContext(XRaysStoreContext)
    const errorContext = useContext(ManualErrorStoreContext)
    const error = useSyncExternalStore(errorContext.subscribe(), errorContext.get())
    
    // get points from child, possibility to restart
    return (
        <main>
            <center>
                <ManualViewport />                
                {
                    error === "" ? <></> :
                        <span className="error__text"> ERROR: {error} </span>
                }
                <div className='utils__container utils__reconstruction-buttons-wrapper'>
                    <AddImageButton />
                    <CreatePointButton />
                    <ClearPointsButton />
                </div>
                <ImageCanvasContainer />
                <ImageList xraysContext={xraysContext} />
            </center>
        </main>
    )
}