import { useContext, useState, useSyncExternalStore } from 'react';
import { Button, Card } from 'react-bootstrap';
import { ReconstructionErrorStoreContext, VesselStoreContext, SourcesStoreContext, CenterlineStoreContext, ShadowsStoreContext, XRaysStoreContext, BifurcationStoreContext, RectsStoreContext } from '../automatic/automaticStore';
import { faCube } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import config from "../../config.json"


export default function StartReconstructionButton() {
    const vesselContext = useContext(VesselStoreContext)
    const sourcesContext = useContext(SourcesStoreContext)
    const centerlineContext = useContext(CenterlineStoreContext)
    const bifurcationsContext = useContext(BifurcationStoreContext)
    const shadowsContext = useContext(ShadowsStoreContext)
    const xraysContext = useContext(XRaysStoreContext)
    const xrays = useSyncExternalStore(xraysContext.subscribe(), xraysContext.get())
    const rectsContext = useContext(RectsStoreContext)
    const rects = useSyncExternalStore(rectsContext.subscribe(), rectsContext.get())
    const errorContext = useContext(ReconstructionErrorStoreContext)
    const error = useSyncExternalStore(errorContext.subscribe(), errorContext.get())

    const [disabled, setDisabled] = useState(false)
    async function handleStart() {
        if (disabled) return;
        setDisabled(true)
        const url = config["AUTO_RECONSTRUCTION_ENDPOINT"]
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

            if (response.status === 200) {
                vesselContext.set(jso.vessel)
                shadowsContext.set(jso.shadows)
                centerlineContext.set(jso.centerlines)
                sourcesContext.set(jso.sources)
                bifurcationsContext.set(jso.bifurcations)
                rectsContext.set(jso.rects)
                errorContext.set("")
            } else {
                errorContext.set(`${jso.message} - ${jso.reason}`)
            }
        } catch (e) {
            errorContext.set("Backend error")
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
                    <Button id="startReconstruction" className='border-0 bg-transparent' disabled={disabled}>
                        <FontAwesomeIcon className="iconInCard" icon={faCube} />
                    </Button>
                </div>
            </Card.Header>
        </Card>
    );
}