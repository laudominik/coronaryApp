import { useContext, useState, useSyncExternalStore } from 'react';
import { Button, Card, Form, Collapse } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { StoreContext } from '../store';
import XRay from '../xray';


export default function AddImageButton() {
    const storeContext = useContext(StoreContext)
    const xrays = useSyncExternalStore(storeContext.subscribe(), storeContext.getXRays())

    function handleAdd() {
        storeContext.setXRays([...xrays, new XRay()])
    }

    return (
        <Card style={{
            width: "100%",
            backgroundColor: 'red',
            margin: '1em',
            cursor: 'pointer'
        }}
            onClick={handleAdd}
        >
            <Card.Header>
                <div>
                    <Button className='border-0 bg-transparent' >
                        <FontAwesomeIcon className="iconInCard" icon={faPlus} />
                    </Button>
                </div>
            </Card.Header>
        </Card>
    );
}