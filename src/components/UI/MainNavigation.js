import AuthContext from "Storage/auth-context";
import { useContext } from "react";
import classes from "./MainNavigation.module.css";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Outlet, useNavigate } from "react-router-dom";
import Logo from "assets/LogoAlquilar.svg";
import { BsFillPersonFill } from "react-icons/bs";
import {MdHomeWork,MdAssignmentInd,MdManageAccounts,MdClose} from "react-icons/md";
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
          {/* <Navbar.Brand className={classes.logo} href="/">AlquilAr</Navbar.Brand> */}
          <Navbar.Brand className={classes.logo} href="/">
            <img
              src={Logo}
              // width="50"
              // height="50"
              // className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link className={classes.li} href="/inmuebles">
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
                      {/* {authCtx.nombreUsuario} */}
                    </div>
                  }
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item>
                    <MdHomeWork />
                    <NavLink
                      className={classes.NavDropdownLink}
                      to="/nuevoInmueble"
                    >
                      Agregar nuevo inmueble
                    </NavLink>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <MdAssignmentInd />
                    <NavLink className={classes.NavDropdownLink} to="/perfil">
                      Mi perfil
                    </NavLink>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <MdManageAccounts />
                    <NavLink className={classes.NavDropdownLink} to="/solicitudesinmobiliarias">
                      Solicitudes inmobiliarias
                    </NavLink>
                  </NavDropdown.Item>
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
