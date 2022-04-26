import { Container, Nav, Navbar } from "react-bootstrap";
import { Outlet} from "react-router-dom";
import 'react-image-gallery/styles/css/image-gallery.css';

const App = () => {
  return (
    <div className="App">
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">AlquilAr</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/inmuebles">Inmuebles</Nav.Link>
              <Nav.Link href="/nuevoInmueble">Nuevo inmueble</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
}

export default App;
