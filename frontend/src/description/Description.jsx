import React from 'react';
import { Button, ButtonGroup, Card, Container, Row, Col } from 'react-bootstrap'
import './Description.css'

export default function Description() {
    return (
        <main className='description'>
            <h2 id='pageTitle'>3D X-ray angiography</h2>
            <p>
                <center>
                The goal of this web-app is to present heart point cloud reconstruction methods for coronary angiography designed as a part of the thesis.
                The app comes in form of three modules: <b>Automatic</b>, <b>Manual</b> and <b>Generation</b>
               </center>
            </p>
            <div className='album py-5 bg-light'>
                <Container>
                <Row>
                    <ModuleCard index={0} type="reconstruction" href="/automatic">
                        <ModuleCard.Image src="voxels.jpg"/> 
                        <ModuleCard.Title>Automatic</ModuleCard.Title>
                        <ModuleCard.Body>Automatic reconstruction of heart point-cloud from images. User can specify multiple
                        images which to take into account in the reconstruction algorithm. </ModuleCard.Body>
                    </ModuleCard>  
                    <ModuleCard index={1} type="reconstruction" href="/manual">
                        <ModuleCard.Image src="manual.jpg"/> 
                        <ModuleCard.Title>Manual</ModuleCard.Title>
                        <ModuleCard.Body>Manual reconstruction of heart point-cloud from images. User has to pick matching points
                            from multiple images with helper lines. </ModuleCard.Body>
                    </ModuleCard>  
                    <ModuleCard index={2} type="utility" href="/generation">
                        <ModuleCard.Image src="angio.jpg"></ModuleCard.Image>
                        <ModuleCard.Title>Generator</ModuleCard.Title>
                        <ModuleCard.Body>Generation of projections from random-generated model. User can generate multiple 
                        images at once, specifying acquisition parameters for each x-ray.</ModuleCard.Body>
                    </ModuleCard>
                </Row>
                </Container>
                </div>
        </main>
    )
}


function ModuleCard({index, type, href, children}){
    let titleContent, bodyContent, image;
    React.Children.forEach(children, child => {
        if (child.type === ModuleCard.Title) {
            titleContent = child;
        } else if (child.type === ModuleCard.Body) {
            bodyContent = child;
        } else if(child.type === ModuleCard.Image){
            image = child;
        }
    });
    return (
        <Col md={4} key={index}>
            <Card className='mb-4 shadow-sm h-100'>
                {image}
                <Card.Body className="px-1 mx-1">
                    <Card.Title>{titleContent}</Card.Title>
                    <Card.Text className="px-5">{bodyContent}</Card.Text>
                    <div className='d-flex justify-content-between align-items-center'>
                        <ButtonGroup aria-label='Basic example' class='mt-auto'>
                            <Button variant='btn-outline-secondary' href={href} id={"go_button_" + index}>Go</Button>
                        </ButtonGroup>
                        <small className='text-muted'>{type}</small>
                    </div>
                </Card.Body>
            </Card>
      </Col>
    )
}

ModuleCard.Title = function ({ children }) {
    return <>{children}</>;
};

ModuleCard.Body = function ({ children }) {
    return <>{children}</>
};


ModuleCard.Image = function ({ src, children }) {
    return <img src={src} width='100%' height='150vh' >{children}</img>
};