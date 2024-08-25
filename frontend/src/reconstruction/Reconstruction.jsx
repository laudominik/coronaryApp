import Viewport from "./viewport/Viewport";
import ImageList from './image_list/ImageList';
import { useContext, useSyncExternalStore } from 'react';
import AddImageButton from './image_list/AddImageButton';
import StartReconstructionButton from './image_list/StartReconstructionButton';
import { ReconstructionErrorStoreContext, XRaysStoreContext } from './reconstructionStore';

export default function Reconstruction() {

    const xraysContext = useContext(XRaysStoreContext)
    const errorContext = useContext(ReconstructionErrorStoreContext)
    const error = useSyncExternalStore(errorContext.subscribe(), errorContext.get())

    return (
        <main>
            <center>
                <Viewport />
                {
                    error === "" ? <></> :
                        <span className="error__text"> ERROR: {error} </span>
                }
                
                <div className='utils__container utils__reconstruction-buttons-wrapper'>
                    <AddImageButton />
                    <StartReconstructionButton />

                </div>
                <ImageList xraysContext={xraysContext} />
            </center>
        </main>
    )
}