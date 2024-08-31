import { useContext, useState, useSyncExternalStore } from 'react';
import { Button, Card, Form, Collapse } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { XRaysStoreContext } from '../automatic/automaticStore';
import XRay from '../../xray';


export default function AddImageButton() {
    const xraysContext = useContext(XRaysStoreContext)
    const xrays = useSyncExternalStore(xraysContext.subscribe(), xraysContext.get())

    function handleAdd() {
        xraysContext.set([...xrays, new XRay()])
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