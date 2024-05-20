import { useContext, useState, useSyncExternalStore } from 'react';
import { Button, Card } from 'react-bootstrap';
import { ReconstructionErrorStoreContext, VerticesStoreContext, XRaysStoreContext } from '../reconstructionStore';
import { faCube } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import config from "../../config.json"


export default function StartReconstructionButton() {
    const verticesContext = useContext(VerticesStoreContext)
    const vertices = useSyncExternalStore(verticesContext.subscribe(), verticesContext.get())
    const xraysContext = useContext(XRaysStoreContext)
    const _ = useSyncExternalStore(xraysContext.subscribe(), xraysContext.get())
    const errorContext = useContext(ReconstructionErrorStoreContext)
    const error = useSyncExternalStore(errorContext.subscribe(), errorContext.get())

    const [disabled, setDisabled] = useState(false)
    async function handleStart() {
        if (disabled) return;
        setDisabled(true)
        const url = config["RECONSTRUCTION_ENDPOINT"]
        const responseAsync = fetch(url, {
            method: 'POST',
            body: xraysContext.serialized(),
            headers: {
                'Content-Type': 'text/plain',
            }
        },
        )
        try {
            const response = await responseAsync
            const jso = await response.json()

            if (jso.status == 0) {
                verticesContext.set(jso.array)
                errorContext.set("")
            } else {
                errorContext.set(jso.msg)
            }
        } catch (e) {
            errorContext.set("backend error")
        } finally {
            setDisabled(false)
        }
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