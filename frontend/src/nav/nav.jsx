import { Navbar, Container, Nav } from 'react-bootstrap'

export default function BrandNav() {
  return <Navbar bg='dark' data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
    <Container>
      <Navbar.Brand href="/">3D X-ray angiography</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="automatic">Automatic</Nav.Link>
          <Nav.Link href="manual">Manual</Nav.Link>
          <Nav.Link href="generation">Generation</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>

}