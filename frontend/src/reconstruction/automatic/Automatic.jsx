import ImageList from '../image_list/ImageList';
import { useContext, useSyncExternalStore } from 'react';
import AddImageButton from '../image_list/AddImageButton';
import StartReconstructionButton from '../image_list/StartReconstructionButton';
import { ReconstructionErrorStoreContext, XRaysStoreContext } from './automaticStore';
import AutomaticViewport from "./AutomaticViewport";
import ErrorNotifier from "../../error/ErrorNotifier.jsx";

export default function Automatic() {

    const xraysContext = useContext(XRaysStoreContext)
    const errorContext = useContext(ReconstructionErrorStoreContext)
    const error = useSyncExternalStore(errorContext.subscribe(), errorContext.get())

    return (
        <main>
            <center>

               
                <AutomaticViewport />
                {
                    error === "" ? <></> :
                        <span className="error__text"> ERROR: {error} </span>
                }
                
                <div className='utils__container utils__reconstruction-buttons-wrapper'>
                    <AddImageButton xraysContext={xraysContext} />
                    <StartReconstructionButton />

                </div>
                <ImageList xraysContext={xraysContext} />
                <ErrorNotifier errorContext={errorContext} />
            </center>
        </main>
    )
}