import { useContext, useState, useSyncExternalStore } from 'react';
import { Button, Card, Form, Collapse } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faMinus } from '@fortawesome/free-solid-svg-icons';
import { XRaysStoreContext } from '../reconstructionStore';

const prettyNames = {
    'sid': 'Source-image distance',
    'sod': 'Source-object distance',
    'alpha': 'alpha (X-axis)',
    'beta': 'beta (X-axis)',
    'spacing_r': 'rows spacing',
    'spacing_c': 'columns spacing'
}


export default function ImageEntry({ ix }) {
    const [open, setOpen] = useState(false);
    const xraysContext = useContext(XRaysStoreContext)
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
        <Card style={{ backgroundColor: 'black', color: 'white', margin: '1em' }}>
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
                    <Card.Img variant='top' src={current.image} />
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="file" onChange={handleImageChange} />
                        </Form.Group>
                        {
                            Object.entries(current.acquisition_params).map(el =>
                                <Form.Group className="mb-3">
                                    <Form.Label>{prettyNames[el[0]]}</Form.Label>
                                    <Form.Control type="number" value={el[1]} onChange={e => handleChangeAcq(el[0], e.target.value)} />
                                </Form.Group>
                            )
                        }
                    </Form>
                </Card.Body>
            </Collapse>
        </Card>
    );
}