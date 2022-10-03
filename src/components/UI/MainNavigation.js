import AuthContext from "storage/auth-context";
import { useContext } from "react";
import classes from "./MainNavigation.module.css";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Outlet, useNavigate } from "react-router-dom";
import Logo from "assets/LogoAlquilar.svg";
import { BsFillPersonFill } from "react-icons/bs";
import { SiHomeassistant } from "react-icons/si";
import {
  MdHomeWork,
  MdAssignmentInd,
  MdManageAccounts,
  MdOutlineNewReleases,
  MdAssignmentTurnedIn,
} from "react-icons/md";
import { NavLink } from "react-router-dom";

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutHandler = () => {
    authCtx.logout();
    navigate("/perfil");
  };

  const loginHandler = () => {
    navigate("/auth");
  };

  return (
    <div className="App">
      <Navbar className={classes.header} variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={NavLink} className={classes.logo} to="/home">
            <img src={Logo} alt="React Bootstrap logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} className={classes.li} to="/inmuebles">
                Inmuebles
              </Nav.Link>
            </Nav>
            <Nav>
              {!authCtx.isLoggedIn ? (
                <button className={classes.button} onClick={loginHandler}>
                  Iniciar sesión
                </button>
              ) : (
                <NavDropdown
                  className={classes.navDropDown}
                  title={
                    <div>
                      <BsFillPersonFill />
                    </div>
                  }
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item as={NavLink} to="/nuevoInmueble">
                    <MdHomeWork />
                    <NavLink
                      className={classes.NavDropdownLink}
                      to="/nuevoInmueble"
                    >
                      Agregar nuevo inmueble
                    </NavLink>
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/perfil">
                    <MdAssignmentInd />
                    <NavLink className={classes.NavDropdownLink} to="/perfil">
                      Mi perfil
                    </NavLink>
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/mispropiedades">
                    <SiHomeassistant />
                    <NavLink
                      className={classes.NavDropdownLink}
                      to="/mispropiedades"
                    >
                      Mis Propiedades
                    </NavLink>
                  </NavDropdown.Item>
                  {authCtx.nombreRol === "Administrador" && (
                    <NavDropdown.Item as={NavLink} to="/admin/verificacion">
                      <MdManageAccounts />
                      <NavLink
                        className={classes.NavDropdownLink}
                        to="/admin/verificacion"
                      >
                        Solicitudes inmobiliarias
                      </NavLink>
                    </NavDropdown.Item>
                  )}
                  {authCtx.nombreRol === "Administrador" && (
                    <NavDropdown.Item as={NavLink} to="/admin/NuevaNoticia">
                      <MdAssignmentTurnedIn />
                      <NavLink
                        className={classes.NavDropdownLink}
                        to="/admin/NuevaNoticia"
                      >
                        Agregar nueva noticia
                      </NavLink>
                    </NavDropdown.Item>
                  )}
                  {authCtx.nombreRol === "Administrador" && (
                    <NavDropdown.Item as={NavLink} to="/admin/listadoNoticias">
                      <MdOutlineNewReleases />
                      <NavLink
                        className={classes.NavDropdownLink}
                        to="/admin/listadoNoticias"
                      >
                        Noticias
                      </NavLink>
                    </NavDropdown.Item>
                  )}
                  <NavDropdown.Divider />
                  {authCtx.isLoggedIn && (
                    <NavDropdown.Item onClick={logoutHandler}>
                      Cerrar sesión
                    </NavDropdown.Item>
                  )}
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
};

export default MainNavigation;
