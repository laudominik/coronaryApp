import { useContext, useSyncExternalStore } from 'react';
import { Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCube } from '@fortawesome/free-solid-svg-icons';
import { ManualBifurcationStoreContext, ManualDataStoreContext, ManualErrorStoreContext, XRaysStoreContext } from './manualStore';
import { sendPointRequest } from './manualService';


export default function CreateBifurcationPointButton() {
    const errorContext = useContext(ManualErrorStoreContext)
    const xraysContext = useContext(XRaysStoreContext)
    const bifurcationContext = useContext(ManualBifurcationStoreContext)
    const manualDataContext = useContext(ManualDataStoreContext)
    const xrays = useSyncExternalStore(xraysContext.subscribe(), xraysContext.get())
    const manualData = useSyncExternalStore(manualDataContext.subscribe(), manualDataContext.get())
    const bifurcationPoints = useSyncExternalStore(bifurcationContext.subscribe(), bifurcationContext.get())

    async function onButtonClicked() {
        errorContext.set("")
        try {
            if(manualData.markedPoints?.length === 2) {
                const pointRequest = await sendPointRequest(xrays, manualData.markedPoints)
                const pointBody = await pointRequest.json()
                if(pointRequest.status !== 200) {
                    errorContext.set(`${pointBody.message} - ${pointBody.reason}`)
                } else {
                    bifurcationContext.set([...bifurcationPoints, {x: pointBody.x, y: pointBody.y, z: pointBody.z}])
                    setCanvasData([], [], [])
                }
            }
        } catch (e) {
            errorContext.set("Backend error")
        }
    }

    function setCanvasData(lines, points, markedPoints) {
        manualDataContext.set({lines: lines, points: points, markedPoints: markedPoints})
    }

    return (
        <Card style={{
            width: "100%",
            backgroundColor: 'blue',
            margin: '1em',
            cursor: 'pointer'
        }}
            onClick={onButtonClicked}
        >
            <Card.Header>
                <div>
                    <Button className='border-0 bg-transparent' >
                        <FontAwesomeIcon className="iconInCard" icon={faCube} />
                    </Button>
                </div>
            </Card.Header>
        </Card>
    );
}