import { useContext } from 'react';
import { Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { ManualPointsStoreContext} from './manualStore';

export default function ClearBifurcationPointsButton() {
    const bifurcationContext = useContext(ManualPointsStoreContext)

    async function onButtonClicked() {
        bifurcationContext.set([])
    }

    return (
        <Card style={{
            width: "100%",
            backgroundColor: '#CE930B',
            margin: '1em',
            cursor: 'pointer'
        }}
            onClick={onButtonClicked}
        >
            <Card.Header>
                <div>
                    <Button className='border-0 bg-transparent' >
                        <FontAwesomeIcon className="iconInCard" icon={faX} />
                    </Button>
                </div>
            </Card.Header>
        </Card>
    );
}