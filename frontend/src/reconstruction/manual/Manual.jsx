import ImageList from '../image_list/ImageList';
import ImageCanvas from './image_canvas/ImageCanvas';
import AddImageButton from '../image_list/AddImageButton';
import StartReconstructionButton from '../image_list/StartReconstructionButton';    


export default function Manual() {
    
    return (
        <main>
            <center>
                <div className='utils__container utils__reconstruction-buttons-wrapper'>
                    <AddImageButton />
                    <StartReconstructionButton />
                </div>
                <ImageCanvas />
                <ImageList />
            </center>
        </main>
    )
}