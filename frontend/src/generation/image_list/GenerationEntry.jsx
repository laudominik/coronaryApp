import { MDBBtn } from "mdb-react-ui-kit";
import { ParamsStoreContext } from "../generationStore";
import { useContext, useSyncExternalStore } from "react";
import { Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const editableKeys = [
    'alpha',
    'beta',
    'sid',
    'sod'
]

export default function GenerationEntry({ ix }) {
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
        paramsContext.set(newParams)
    }

    return (
        <tr>
            <th scope="row">{ix + 1}</th>
            {editableKeys.map(el =>
                <td><Form.Control type='number' value={acq[el]} onChange={e => handleChange(el, e.target.value)} /></td>
            )}
            <td>
                <Button variant="danger" onClick={handleRemove}>
                    <FontAwesomeIcon icon={faTrash} />
                </Button>
            </td>
        </tr>
    );
}