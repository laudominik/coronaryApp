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

export default function GenerationParamsList() {
    const [disabled, setDisabled] = useState(false)
    const paramsContext = useContext(ParamsStoreContext)
    const params = useSyncExternalStore(paramsContext.subscribe(), paramsContext.get())
    const errorContext = useContext(GenerationErrorStoreContext)
    const error = useSyncExternalStore(errorContext.subscribe(), errorContext.get())

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
            if (jso.status == 0) {
                errorContext.set("")
                const result = jso.xrays.map(el => JSON.parse(el))
            } else {
                errorContext.set(jso.msg)
            }
        } catch (e) {
            errorContext.set("backend error")
        } finally {
            setDisabled(false)
        }
    }


    function addProjection() {
        const newParams = structuredClone(params)
        newParams.xrays = [...newParams.xrays, new XRay()]
        paramsContext.set(newParams)
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
                                <Button variant="success" style={buttonStyle} onClick={generate}>Generate</Button>
                                <Button variant="warning" style={buttonStyle} href="reconstruction">Load to reconstruction</Button>
                                <Form>
                                    <Form.Group>
                                        <center>
                                            <div class="col-lg-4" style={{ margin: 10 }}>
                                                <Form.Control type="number" placeholder="generator seed" />
                                            </div>
                                        </center>
                                    </Form.Group>
                                </Form>

                                <MDBTable className="mb-4">
                                    <MDBTableHead>
                                        <tr>
                                            <th scope="col">No.</th>
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
                                            <td colSpan={6}>
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