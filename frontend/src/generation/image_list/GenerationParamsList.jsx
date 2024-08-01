import React, { useContext, useState, useSyncExternalStore } from "react";
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCol,
    MDBContainer,
    MDBInput,
    MDBRow,
    MDBTable,
    MDBTableBody,
    MDBTableHead,
} from "mdb-react-ui-kit";
import GenerationEntry from "./GenerationEntry";
import { GenerationErrorStoreContext, ParamsStoreContext } from "../generationStore";
import { Button, Form } from "react-bootstrap";

import config from "../../config.json"
import XRay from "../../xray";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import GenerationParams from "../generationParams";
import { XRaysStoreContext } from "../../reconstruction/reconstructionStore";

const TOO_FEW_GENERATED_IMGS_MSG = "to load images to reconstruction there has to be at least two images (generated)"

export default function GenerationParamsList() {
    const [disabled, setDisabled] = useState(false)
    const paramsContext = useContext(ParamsStoreContext)
    const params = useSyncExternalStore(paramsContext.subscribe(), paramsContext.get())
    const errorContext = useContext(GenerationErrorStoreContext)
    const error = useSyncExternalStore(errorContext.subscribe(), errorContext.get())

    // reconstruction!
    const reconstructionXrayContext = useContext(XRaysStoreContext)

    async function generate() {
        if (disabled) return;
        setDisabled(true)
        const url = config["GENERATION_ENDPOINT"]
        const responseAsync = fetch(url, {
            method: 'POST',
            body: paramsContext.serialized(),
            headers: {
                'Content-Type': 'text/plain',
            }
        },
        )
        try {
            const response = await responseAsync
            const jso = await response.json()
            if (jso.status == 200) {
                errorContext.set("")
                const result = jso.xrays.map(el => JSON.parse(el))
                const newParams = structuredClone(params)
                newParams.xrays = result
                paramsContext.set(newParams)
            } else {
                errorContext.set(jso.msg)
            }
        } catch (e) {
            errorContext.set("backend error")
        } finally {
            setDisabled(false)
        }
    }

    function handleSeedChange(val){
        const newParams = structuredClone(params)
        newParams.seed = val
        paramsContext.set(newParams)
    }

    function addProjection() {
        const newParams = structuredClone(params)
        newParams.xrays = [...newParams.xrays, new XRay()]
        paramsContext.set(newParams)
    }

    function canLoadToReconstruction(){
        return params.xrays.reduce((acc, el) => el.generated ? acc + 1 : acc, 0) >= 2;
    }

    function handleLoadToAutoReconstruction(){
        if(!canLoadToReconstruction()){
            errorContext.set(TOO_FEW_GENERATED_IMGS_MSG)
            return;
        }
        reconstructionXrayContext.set(params.xrays)
        window.location.href = "reconstruction";
    }

    function handleLoadToManualReconstruction(){
        if(!canLoadToReconstruction()){
            errorContext.set(TOO_FEW_GENERATED_IMGS_MSG)
            return;
        }
        // reconstructionXrayContext.set(params.xrays) TODO: set input data after manual is ready
        window.location.href = "manual";
    }

    const buttonStyle = {
        cursor: disabled ? 'wait' : 'pointer',
        margin: 5
    }

    return (
        <section className="vh-100" style={{ backgroundColor: "#eee" }}>
            <MDBContainer className="py-5 h-100">
                <MDBRow className="d-flex justify-content-center align-items-center">
                    <MDBCol lg="9" xl="7">
                        <MDBCard className="rounded-3">
                            <MDBCardBody className="p-4">
                                <h4 className="text-center my-3 pb-3">X-ray generation</h4>
                                {
                                    error == "" ? <></> :
                                        <span style={{ color: 'red' }}> ERROR: {error} </span>
                                }
                                <br />
                                <Button variant="success" style={buttonStyle} onClick={generate}>Generate</Button> <br/>
                                <Button variant="warning" style={buttonStyle} onClick={handleLoadToAutoReconstruction}>Load to <b>automatic</b> reconstruction</Button>
                                <Button variant="danger" style={buttonStyle} onClick={handleLoadToManualReconstruction}>Load to <b>manual</b> reconstruction</Button>
                                {/* <Form>
                                    <Form.Group>
                                        <center>
                                            <div class="col-lg-4" style={{ margin: 10 }}>
                                             generator seed
                                                <Form.Control type="number" value={params.seed} onChange={e => handleSeedChange(e.target.value)} />
                                            </div>
                                        </center>
                                    </Form.Group>
                                </Form> */}

                                <MDBTable className="mb-4">
                                    <MDBTableHead>
                                        <tr>
                                            <th scope="col">No.</th>
                                            <th scope="col">Generated?</th>
                                            <th scope="col">Alpha</th>
                                            <th scope="col">Beta</th>
                                            <th scope="sid">SID</th>
                                            <th scope="sod">SOD</th>
                                        </tr>
                                    </MDBTableHead>
                                    <MDBTableBody>
                                        {
                                            params.xrays.map((el, ix) => <GenerationEntry ix={ix} />)
                                        }
                                        <tr>
                                            <td colSpan={7}>
                                                <center>
                                                    <Button onClick={addProjection}><FontAwesomeIcon icon={faPlus} /></Button>
                                                </center>
                                            </td>
                                        </tr>
                                    </MDBTableBody>

                                </MDBTable>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </section>
    );
}