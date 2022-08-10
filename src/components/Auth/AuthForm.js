import * as API from "api/API";
import { useState, useContext } from "react";
import AuthContext from "storage/auth-context";
import { NotificationManager } from "react-notifications";
import LoadingSpinner from "components/UI/LoadingSpinner";
import classes from "./AuthForm.module.css";
import TextBox from "components/UI/TextBox";
import LocalidadSelect from "components/shared/LocalidadSelect";
import RolSelect from "components/shared/RolSelect";

const AuthForm = () => {
  const [loggingIn, setLoggingIn] = useState(true);
  const [loading, setLoading] = useState(false);

  // Login fields
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");

  // Register fields
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [rol, setRol] = useState("");

  // Role-specific fields (Inmobiliaria)
  const [direccion, setDireccion] = useState("");
  const [piso, setPiso] = useState("");

  const authCtx = useContext(AuthContext);

  // Handlers
  const switchAuthModeHandler = () => {
    setLoggingIn((prevState) => !prevState);
  };
  const rolInputChangeHandler = (value) => {
    setRol(value);

    // Cleaning role-specific fields
    setDireccion('');
    setPiso('');
  }
  const usuarioInputChangeHandler = (newValue) => {
    setUsuario(newValue);
  };
  const claveInputChangeHandler = (newValue) => {
    setClave(newValue);
  };
  const nombreInputChangeHandler = (newValue) => {
    setNombre(newValue);
  };
  const telefonoInputChangeHandler = (newValue) => {
    setTelefono(newValue);
  };
  const emailInputChangeHandler = (newValue) => {
    setEmail(newValue);
  };
  const localidadInputChangeHandler = (value) => {
    setLocalidad(value);
  };
  const direccionInputChangeHandler = (newValue) => {
    setDireccion(newValue);
  };
  const pisoInputChangeHandler = (newValue) => {
    setPiso(newValue);
  };

  const submitHandler = (event) => {
    event.preventDefault(); setLoading(true);

    let url;
    if (loggingIn) {
      url = "/auth/login";
    } else {
      url = "/auth/register";
    }

    let rq;
    if (loggingIn) {
      rq = {
        nombreUsuario: usuario,
        clave: clave,
      };
    } else {
      rq = {
        nombreUsuario: usuario,
        clave: clave,
        nombre: nombre,
        telefono: telefono,
        email: email,
        idLocalidad: localidad.value,
        idRol: rol.value,
        direccion: direccion,
        piso: piso,
      }
    }

    API.post(url, rq)
      .then((data) => {
        NotificationManager.success(loggingIn ? "Inicio de sesión exitoso" : "Registro exitoso");
        const expirationTime = new Date(
          new Date().getTime() + 86400 * 1000
        );
        authCtx.login(data.data, expirationTime.toISOString());
        if (!loggingIn) setLoggingIn(true);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <section className={classes.auth}>
          <h1>{loggingIn ? "Inicio de sesión" : "Registro"}</h1>
          <form onSubmit={submitHandler}>
            <TextBox
              id="usuario"
              type="text"
              label="Usuario"
              containerClassName={classes.control}
              value={usuario}
              onChange={usuarioInputChangeHandler}
            />
            <TextBox
              id="password"
              type="password"
              label="Clave"
              containerClassName={classes.control}
              value={clave}
              onChange={claveInputChangeHandler}
            />
            {!loggingIn && (
              <>
                <TextBox
                  id="nombre"
                  type="text"
                  label="Nombre"
                  containerClassName={classes.control}
                  value={nombre}
                  onChange={nombreInputChangeHandler}
                />
                <TextBox
                  id="telefono"
                  type="text"
                  label="Telefono"
                  containerClassName={classes.control}
                  value={telefono}
                  onChange={telefonoInputChangeHandler}
                />
                <TextBox
                  id="email"
                  type="text"
                  label="Email"
                  containerClassName={classes.control}
                  value={email}
                  onChange={emailInputChangeHandler}
                />
                <LocalidadSelect
                  id="localidad"
                  label="Localidad"
                  containerClassName={classes.control}
                  onChange={localidadInputChangeHandler}
                  value={localidad}
                />
                <RolSelect
                  id="rol"
                  label="Rol"
                  containerClassName={classes.control}
                  onChange={rolInputChangeHandler}
                  value={rol}
                />
                {rol.value === 4 && (
                  <>
                    <TextBox
                      id="direccion"
                      type="text"
                      label="Direccion"
                      containerClassName={classes.control}
                      value={direccion}
                      onChange={direccionInputChangeHandler}
                    />
                    <TextBox
                      id="piso"
                      type="text"
                      label="Piso"
                      containerClassName={classes.control}
                      value={piso}
                      onChange={pisoInputChangeHandler}
                    />
                  </>
                )}
              </>
            )}
            <div className={classes.actions}>
              {!loading && (
                <button>
                  {loggingIn ? "Ingresar" : "Crear cuenta"}
                </button>
              )}
              <button
                type="button"
                className={classes.toggle}
                onClick={switchAuthModeHandler}
              >
                {loggingIn
                  ? "Crear una nueva cuenta"
                  : "Iniciar sesión con una cuenta existente"}
              </button>
            </div>
          </form>
        </section>
      )
      }
    </>
  );
};

export default AuthForm;
