import { useContext, useSyncExternalStore } from "react";
import ImageList from '../image_list/ImageList';
import ImageCanvas from './image_canvas/ImageCanvas';
import AddImageButton from '../image_list/AddImageButton';
import StartReconstructionButton from '../image_list/StartReconstructionButton';    
import { ReconstructionErrorStoreContext } from '../reconstructionStore';


export default function Manual() {

    const errorContext = useContext(ReconstructionErrorStoreContext)

    const error = useSyncExternalStore(errorContext.subscribe(), errorContext.get())

    function onReconstructionReady(points) {

    }
    
    // get points from child, possibility to restart
    return (
        <main>
            <center>
                {
                    error === "" ? <></> :
                        <span className="error__text"> ERROR: {error} </span>
                }
                <div className='utils__container utils__reconstruction-buttons-wrapper'>
                    <AddImageButton />
                    <StartReconstructionButton />
                </div>
                <ImageCanvas onReconstructionReady={onReconstructionReady} />
                <ImageList />
            </center>
        </main>
    )
}