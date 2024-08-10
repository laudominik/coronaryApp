import ImageList from '../image_list/ImageList';
import AddImageButton from '../image_list/AddImageButton';
import StartReconstructionButton from '../image_list/StartReconstructionButton';    


export default function Manual() {
    
    return (
        <main>
            <center>
                <div style={{ width: '60%', display: 'flex', justifyContent: 'space-between', padding: 0 }}>
                    <AddImageButton />
                    <StartReconstructionButton />
                </div>
                <div style={{ width: '60%' }}>
                    <ImageList />
                </div>
            </center>
        </main>
    )
}