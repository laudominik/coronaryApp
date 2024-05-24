import { MDBBtn } from "mdb-react-ui-kit";
import { ParamsStoreContext } from "../generationStore";
import { useContext, useState, useSyncExternalStore } from "react";
import { Button, Collapse, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faChevronDown, faChevronUp, faCross, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";

const editableKeys = [
    'alpha',
    'beta',
    'sid',
    'sod'
]

export default function GenerationEntry({ ix }) {
    const [open, setOpen] = useState(false)
    const paramsContext = useContext(ParamsStoreContext)
    const params = useSyncExternalStore(paramsContext.subscribe(), paramsContext.get())

    const current = params.xrays[ix]
    const acq = current.acquisition_params

    function handleRemove() {
        const newParams = structuredClone(params)
        newParams.xrays = params.xrays.slice(0, ix).concat(params.xrays.slice(ix + 1))
        paramsContext.set(newParams)
    }

    function handleChange(key, value) {
        const newParams = structuredClone(params)
        newParams.xrays[ix].acquisition_params[key] = value
        newParams.xrays[ix].image = ""
        newParams.xrays[ix].generated = false;
        paramsContext.set(newParams)
    }

    return (
        <>
            <tr>
                <th scope="row">{ix + 1}</th>
                <td>
                    <FontAwesomeIcon icon={current.generated ? faCheck : faXmark} />
                </td>
                {editableKeys.map(el =>
                    <td><Form.Control type='number' value={acq[el]} onChange={e => handleChange(el, e.target.value)} /></td>
                )}
                <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Button variant="danger" onClick={handleRemove}>
                            <FontAwesomeIcon icon={faTrash} />
                        </Button>
                        {current.image ? 
                            <Button
                            variant="secondary"
                            onClick={() => setOpen(!open)}
                            aria-controls={`collapse-image-${ix}`}
                            aria-expanded={open}
                        > <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />  </Button>: <></>
                        }
                    </div>
                </td>
                </tr>
                
                {
                    current.image ? 
                    <Collapse in={open} id={`collapse-image-${ix}`} timeout={0}>
                    <tr>
                    <td colSpan={editableKeys.length + 3}>
                        <div style={{ textAlign: 'center' }}>
                            <img src={current.image} alt={`X-ray ${ix + 1}`} style={{ marginTop: '10px', maxWidth: '100%' }} />
                        </div>
                    </td>
                    </tr>
                </Collapse> : <></>
                }
                
        </>
    );
}