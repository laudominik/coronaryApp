import { useContext, useState, useSyncExternalStore } from 'react';
import { Button, Card } from 'react-bootstrap';
import { XRaysStoreContext } from '../store';
import { faCube } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function StartReconstructionButton() {
    const xraysContext = useContext(XRaysStoreContext)
    const xrays = useSyncExternalStore(xraysContext.subscribe(), xraysContext.get())

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
        xraysContext.set(jso.array)
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
                    <Button className='border-0 bg-transparent' disabled={disabled}>
                        <FontAwesomeIcon className="iconInCard" icon={faCube} />
                    </Button>
                </div>
            </Card.Header>
        </Card>
    );
}