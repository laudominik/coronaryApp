import { useContext, useSyncExternalStore } from 'react';
import { Button, Card } from 'react-bootstrap';
import { StoreContext } from '../store';
import { faCube } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function StartReconstructionButton() {
    const storeContext = useContext(StoreContext)
    const xrays = useSyncExternalStore(storeContext.subscribe(), storeContext.get())

    function handleStart() {
        // send to django
    }

    return (
        <Card style={{ width: "100%", backgroundColor: 'green', margin: '1em' }}>
            <Card.Header>
                <div>
                    <Button className='border-0 bg-transparent' onClick={handleStart}>
                        <FontAwesomeIcon className="iconInCard" icon={faCube} />
                    </Button>
                </div>
            </Card.Header>
        </Card>
    );
}