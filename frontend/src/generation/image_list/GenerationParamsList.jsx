import React, { useContext, useSyncExternalStore } from "react";
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
import { ParamsStoreContext } from "../generationStore";
import { Button, Form } from "react-bootstrap";

import config from "../../config.json"
import XRay from "../../xray";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function GenerationParamsList() {
    const paramsContext = useContext(ParamsStoreContext)
    const params = useSyncExternalStore(paramsContext.subscribe(), paramsContext.get())

    function generate() {
        // TODO: add a call to backend API, config["GENERATION_ENDPOINT"]
    }

    function addProjection() {
        paramsContext.set([...params, new XRay()])
    }

    return (
        <section className="vh-100" style={{ backgroundColor: "#eee" }}>
            <MDBContainer className="py-5 h-100">
                <MDBRow className="d-flex justify-content-center align-items-center">
                    <MDBCol lg="9" xl="7">
                        <MDBCard className="rounded-3">
                            <MDBCardBody className="p-4">
                                <h4 className="text-center my-3 pb-3">X-ray generation</h4>
                                <Button variant="success" onclick={generate}>Generate</Button>
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
                                            <th scope="col"></th>
                                        </tr>
                                    </MDBTableHead>
                                    <MDBTableBody>
                                        {
                                            params.map((el, ix) => <GenerationEntry ix={ix} />)
                                        }
                                        <tr>
                                            <td colSpan={6}>
                                                <center>
                                                    <Button onClick={addProjection}><FontAwesomeIcon icon={faPlus} /></Button>
                                                </center>
                                            </td>
                                        </tr>

                                        {/* <th scope="row">-</th>
                                        <td>-</td>
                                        <td>-</td>
                                        <td></td>
                                        <td>-</td>
                                        <td>-</td> */}
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