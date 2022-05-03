import * as API from "api/API";
import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "Storage/auth-context";
import { NotificationManager } from "react-notifications";
import LoadingSpinner from "components/UI/LoadingSpinner";
import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const [estamosLogueando, setEstamosLogueando] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const authCtx = useContext(AuthContext);

  const userInputRef = useRef();
  const passwordInputRef = useRef();
  const switchAuthModeHandler = () => {
    setEstamosLogueando((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const usuarioIngresado = userInputRef.current.value;
    const claveIngresada = passwordInputRef.current.value;

    // optional: add validation here

    setLoading(true);
    let url;
    if (estamosLogueando) {
      url = "/auth/login";
    } else {
      url = "/auth/register";
    }

    setLoading(true);

    const rq = {
      nombreUsuario: usuarioIngresado,
      clave: claveIngresada,
    };

    API.post(url, rq)
      .then((data) => {
        NotificationManager.success("Inicio de sesión exitoso");
        const expirationTime = new Date(
          new Date().getTime() + 86400 * 1000
          // new Date().getTime() + +data.expiresIn * 1000
        );
        console.log(expirationTime);
        authCtx.login(data.data, expirationTime.toISOString());
        navigate("/perfil");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <section className={classes.auth}>
          <h1>{estamosLogueando ? "Inicio de sesión" : "Registro"}</h1>
          <form onSubmit={submitHandler}>
            <div className={classes.control}>
              <label htmlFor="username">Usuario</label>
              <input type="text" id="username" required ref={userInputRef} />
            </div>
            <div className={classes.control}>
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                required
                ref={passwordInputRef}
              />
            </div>
            <div className={classes.actions}>
              {!loading && (
                <button>
                  {estamosLogueando ? "Ingresar" : "Crear cuenta"}
                </button>
              )}
              <button
                type="button"
                className={classes.toggle}
                onClick={switchAuthModeHandler}
              >
                {estamosLogueando
                  ? "Crear una nueva cuenta"
                  : "Iniciar sesión con una cuenta existente"}
              </button>
            </div>
          </form>
        </section>
      )}
    </>
  );
};

export default AuthForm;
