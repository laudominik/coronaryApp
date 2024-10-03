import { useContext, useState, useSyncExternalStore } from 'react';
import { Button, Card, Form, Collapse } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faMinus } from '@fortawesome/free-solid-svg-icons';
import { XRaysStoreContext } from '../automatic/automaticStore';

const prettyNames = {
    'sid': 'Source-image distance',
    'sod': 'Source-object distance',
    'alpha': 'alpha (X-axis)',
    'beta': 'beta (X-axis)',
    'spacing_r': 'rows spacing',
    'spacing_c': 'columns spacing'
}


export default function ImageEntry({ ix, xraysContext }) {
    const [open, setOpen] = useState(false);
    const xrays = useSyncExternalStore(xraysContext.subscribe(), xraysContext.get())
    const current = xrays[ix]

    function handleRemove() {
        xraysContext.set(xrays.slice(0, ix).concat(xrays.slice(ix + 1)))
    }

    function handleChangeAcq(param_name, value) {
        let newXrays = [...xrays]

        newXrays[ix].acquisition_params[param_name] = value
        xraysContext.set(newXrays)
    }

    function handleImageChange(e) {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const imageDataUrl = event.target?.result;
            let newXrays = [...xrays]
            newXrays[ix].image = imageDataUrl;
            newXrays[ix].filename = file.name.split('.').slice(0, -1).join('.')
            xraysContext.set(newXrays)
        }

        reader.readAsDataURL(file);
    }

    return (
        <Card className='image-entry'>
            <Card.Header style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Card.Title>xray: {current.filename == "" ? "empty image" : current.filename}</Card.Title>
                <div>
                    <Button
                        className='border-0 bg-transparent'
                        onClick={() => setOpen(!open)}
                        aria-expanded={open}>
                        <FontAwesomeIcon className="iconInCard" icon={open ? faChevronDown : faChevronUp} />
                    </Button>
                    {
                        xrays.length > 2 ?
                            <Button className='border-0 bg-transparent' onClick={handleRemove}>
                                <FontAwesomeIcon className="iconInCard" icon={faMinus} />
                            </Button> : <></>
                    }

                </div>
            </Card.Header>

            <Collapse in={open}>
                <Card.Body>
                    <img src={current.image} className="image-entry__selected-image"/>
                    <Form>
                        <Form.Group className="image-entry__form-image-input">
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="file" onChange={handleImageChange} />
                        </Form.Group>
                        <Form.Group className='image-entry__form-params'>
                        {
                            Object.entries(current.acquisition_params).map(el =>
                                <Form.Group className="image-entry__form-element">
                                    <Form.Label>{prettyNames[el[0]]}</Form.Label>
                                    <Form.Control type="number" value={el[1]} onChange={e => handleChangeAcq(el[0], e.target.value)} />
                                </Form.Group>
                            )
                        }
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Collapse>
        </Card>
    );
}