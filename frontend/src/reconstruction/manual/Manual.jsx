import { useContext, useSyncExternalStore } from "react";
import ImageList from '../image_list/ImageList';
import ImageCanvas from './image_canvas/ImageCanvas';
import AddImageButton from '../image_list/AddImageButton';
import CreateBifurcationPointButton from "./CreateBifurcationPointButton";
import { ManualErrorStoreContext, XRaysStoreContext } from './manualStore';
import ClearBifurcationPointsButton from "./ClearBifurcationPointsButton.jsx";
import ManualViewport from "./ManualViewport.jsx";
import ErrorNotifier from "../../error/ErrorNotifier.jsx";


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
                    <CreateBifurcationPointButton />
                    <ClearBifurcationPointsButton />
                </div>
                <ImageCanvas />
                <ImageList xraysContext={xraysContext} />
                <ErrorNotifier errorContext={errorContext} />
            </center>
        </main>
    )
}