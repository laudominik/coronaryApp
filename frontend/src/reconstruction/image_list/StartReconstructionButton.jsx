import { useContext, useState, useSyncExternalStore } from 'react';
import { Button, Card } from 'react-bootstrap';
import { StoreContext } from '../store';
import { faCube } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function StartReconstructionButton() {
    const storeContext = useContext(StoreContext)
    const xrays = useSyncExternalStore(storeContext.subscribe(), storeContext.getXRays())

    const [disabled, setDisabled] = useState(false)

    async function handleStart() {
        if (disabled) return;
        setDisabled(true)
        const responseAsync = fetch("http://127.0.0.1:8000", {
            method: 'POST',
            body: "abcdefghij",
            headers: {
                'Content-Type': 'text/plain',
            }
        },
        )
        const response = await responseAsync
        const jso = await response.json()
        storeContext.setVertices(jso.array)
        setDisabled(false)
    }

    return (
        <Card style={{
            width: "100%",
            backgroundColor: 'green',
            margin: '1em',
            cursor: disabled ? 'wait' : 'pointer'
        }}
            disabled={disabled} onClick={handleStart}>
            <Card.Header>
                <div>
                    <Button className='border-0 bg-transparent' onClick={handleStart} disabled={disabled}>
                        <FontAwesomeIcon className="iconInCard" icon={faCube} />
                    </Button>
                </div>
            </Card.Header>
        </Card>
    );
}