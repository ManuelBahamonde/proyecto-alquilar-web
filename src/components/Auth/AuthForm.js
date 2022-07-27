import * as API from "api/API";
import { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "storage/auth-context";
import { NotificationManager } from "react-notifications";
import LoadingSpinner from "components/UI/LoadingSpinner";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import _ from "lodash";
import classes from "./AuthForm.module.css";

// Validation Helpers:
const isEmpty = (value) => value.toString().trim() === "";

const AuthForm = () => {
  const [estamosLogueando, setEstamosLogueando] = useState(true);
  const [loading, setLoading] = useState(false);
  const [posiblesRoles, setPosiblesRoles] = useState("");

  // En común login y registro:
  const [usuarioIngresado, setUsuarioIngresado] = useState("");
  const [claveIngresada, setClaveIngresada] = useState("");

  // Para el registro de cualquier usuario necesitamos los dos campos anteriores y:
  const [nombreIngresado, setNombreIngresado] = useState("");
  const [telefonoIngresado, setTelefonoIngresado] = useState("");
  const [emailIngresado, setEmailIngresado] = useState("");
  const [localidadIngresada, setLocalidadIngresada] = useState("");
  const [rolIngresado, setRolIngresado] = useState("");

  // Datos particulares de una inmobiliaria:
  const [direccionIngresada, setDireccionIngresada] = useState("");
  const [pisoIngresado, setPisoIngresado] = useState("");
  const [servicioIngresado, setServicioIngresado] = useState("");
  const [duracionTurno, setDuracionTurno] = useState("");
  const [logo, setLogo] = useState("");
  const [horariosIngresados, setHorariosIngresados] = useState([]);

  const [formInputsValidity, setFormInputsValidity] = useState({
    rol: true,
    localidad: true,
  });

  const navigate = useNavigate();

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    
    // Nos traemos los posibles roles
    API.get("/rol/GetRolesPosiblesParaRegistro")
      .then((response) => {
        const roles = response.data.map((rol) => ({
          value: rol.idRol,
          label: rol.descripcion,
        }));
        console.log(roles);
        setPosiblesRoles(roles);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

  }, []);


  // InputsChangeHandlers:
  const switchAuthModeHandler = () => {
    setEstamosLogueando((prevState) => !prevState);
  };
  const rolInputChangeHandler = (value) => {
    setRolIngresado(value);
    // Limpiamos los campos propios de la inmobiliaria por si quedan sucios: 
    setDireccionIngresada('');
    setPisoIngresado('');
    setFormInputsValidity((prevState) => {
      return { ...prevState, rol: true };
    });
  }
  const usuarioInputChangeHandler = (event) => {
    setUsuarioIngresado(event.target.value);
  };
  const claveInputChangeHandler = (event) => {
    setClaveIngresada(event.target.value);
  };
  const nombreInputChangeHandler = (event) => {
    setNombreIngresado(event.target.value);
  };
  const telefonoInputChangeHandler = (event) => {
    setTelefonoIngresado(event.target.value);
  };
  const emailInputChangeHandler = (event) => {
    setEmailIngresado(event.target.value);
  };
  const localidadInputChangeHandler = (value) => {
    setLocalidadIngresada(value);
    setFormInputsValidity((prevState) => {
      return { ...prevState, localidad: true };
    });
  };
  const direccionInputChangeHandler = (event) => {
    setDireccionIngresada(event.target.value);
  };
  const pisoInputChangeHandler = (event) => {
    setPisoIngresado(event.target.value);
  };
  const servicioInputChangeHandler = (event) => {
    setServicioIngresado(event.target.value);
  };
  const duracionInputChangeHandler = (value) => {
    setDuracionTurno(value);
  };
  const logoInputChangeHandler = (value) => {
    const imagen = value.target.files;
    setLogo(imagen);
  };
  const horariosInputChangeHandler = (event) => {
    setHorariosIngresados(event.target.value);
  };

  const limpiarForm = () => {
    setRolIngresado("");
    setUsuarioIngresado("");
    setClaveIngresada("");
    setNombreIngresado("");
    setTelefonoIngresado("");
    setEmailIngresado("");
    setLocalidadIngresada("");
    setDireccionIngresada("");
    setPisoIngresado("");
    setServicioIngresado("");
    setDuracionTurno("");
    setLogo("");
    setHorariosIngresados([]);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    // optional: add validation here
    const rolEsValido = validarRol();
    const localidadEsValida = validarLocalidad();

    if (rolEsValido && localidadEsValida){

      setLoading(true);
      let url;
      if (estamosLogueando) {
        url = "/auth/login";
      } else {
        url = "/auth/register";
      }
  
      setLoading(true);
    
      let rq;
      if (estamosLogueando){
        rq = {
          nombreUsuario: usuarioIngresado,
          clave: claveIngresada,
        };
      } else {
        rq = {
          nombreUsuario: usuarioIngresado,
          clave: claveIngresada,
          nombre: nombreIngresado,
          telefono: telefonoIngresado,
          email: emailIngresado,
          idLocalidad: localidadIngresada.value,
          idRol: rolIngresado.value,
          direccion: direccionIngresada,
          piso: pisoIngresado,
        }
      }
  
      API.post(url, rq)
        .then((data) => {
          NotificationManager.success(estamosLogueando ? "Inicio de sesión exitoso" : "Registro exitoso");
          const expirationTime = new Date(
            new Date().getTime() + 86400 * 1000
            // TODO: cambiar a new Date().getTime() + +data.expiresIn * 1000
          );
          console.log(expirationTime);
          authCtx.login(data.data, expirationTime.toISOString());
          estamosLogueando ? navigate("/perfil") : setEstamosLogueando(true);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
      
    }

  };


  const loadOptions = _.debounce((input, callback) => {
    API.get("/localidad", { searchText: input })
      .then((response) => {
        const localidades = response.data.map((localidad) => ({
          value: localidad.idLocalidad,
          label: localidad.label,
        }));

        callback(localidades);
      })
      .catch(() => {});
  }, 1000);

  const validarLocalidad = () => {
    console.log(localidadIngresada);
    const localidadIngresadaEsValido = !isEmpty(localidadIngresada);
    setFormInputsValidity((prevState) => {
      return { ...prevState, localidad: localidadIngresadaEsValido };
    });
    return localidadIngresadaEsValido;
  };

  const validarRol = () => {
    const rolIngresadoEsValido = !isEmpty(rolIngresado);
    setFormInputsValidity((prevState) => {
      return { ...prevState, rol: rolIngresadoEsValido };
    });
    console.log("Validez del rol: "+ rolIngresadoEsValido)
    return rolIngresadoEsValido;
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
              <label htmlFor="usuario">Usuario</label>
              <input
                type="text"
                id="usuario"
                required
                onChange={usuarioInputChangeHandler}
              />
            </div>
            <div className={classes.control}>
              <label htmlFor="password">Clave</label>
              <input
                type="password"
                id="password"
                required
                onChange={claveInputChangeHandler}
              />
            </div>
            {!estamosLogueando && (
              <div className={classes.control}>
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  required
                  onChange={nombreInputChangeHandler}
                />
              </div>
            )}
            {!estamosLogueando && (
              <div className={classes.control}>
                <label htmlFor="telefono">Telefono</label>
                <input
                  type="text"
                  id="telefono"
                  required
                  onChange={telefonoInputChangeHandler}
                />
              </div>
            )}
            {!estamosLogueando && (
              <div className={classes.control}>
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  id="email"
                  required
                  onChange={emailInputChangeHandler}
                />
              </div>
            )}
            {!estamosLogueando && 
              <div className={classes.control}>
                  <label
                    htmlFor="localidad"
                  >
                    Localidad
                  </label>
                  <AsyncSelect
                    cacheOptions
                    required
                    loadOptions={loadOptions}
                    onChange={localidadInputChangeHandler}
                    value={localidadIngresada}
                    onBlur={validarLocalidad}
                    styles={{
                      option: (provided,state) => {
                        return {
                          ...provided,
                          color: "black",
                        }
                      }
                    }}
                  />
                  {!formInputsValidity.localidad && (
                    <p className={classes.error}>Por favor ingrese una localidad válida</p>
                  )}
            </div>}
            {!estamosLogueando && (
              <div className={classes.control}>
                <label htmlFor="Rol">
                  Rol
                </label>
                <Select
                  classNamePrefix="select"
                  isSearchable={true}
                  name="Rol"
                  required
                  options={posiblesRoles}
                  onChange={rolInputChangeHandler}
                  value={rolIngresado}
                  onBlur={validarRol}
                  styles={{
                    option: (provided,state) => {
                      return {
                        ...provided,
                        color: "black",
                      }
                    }
                  }}
                />
                {!formInputsValidity.rol && (
                    <p className={classes.error}>Por favor ingrese un rol válido</p>
                  )}
              </div>
            )}
            {!estamosLogueando && rolIngresado.value== 4 &&(
              <div className={classes.control}>
                <label htmlFor="direccion">Dirección inmobiliaria</label>
                <input
                  type="text"
                  id="direccion"
                  onChange={direccionInputChangeHandler}
                />
              </div>
            )}
            {!estamosLogueando && rolIngresado.value== 4 &&(
              <div className={classes.control}>
                <label htmlFor="piso">Piso</label>
                <input
                  type="text"
                  id="piso"
                  onChange={pisoInputChangeHandler}
                />
              </div>
            )}

            {/* Esto seguro lo hagamos en una pantalla de configuración del perfil 
            
            {!estamosLogueando && rolIngresado.value== 4 &&(
              <div className={classes.control}>
              <label htmlFor="duracionTurno">
                Duración turnos de visitas
              </label>
              <Select
                classNamePrefix="select"
                isSearchable={true}
                name="duracionTurno"
                options={[{value: 0.25, label:'15 minutos'},{value: 0.5, label:'30 minutos'},{value: 0.75, label:'45 minutos'},{value: 1,label:'1 hora'},{value: 1.25,label:'1 hora y 15 minutos'},{value: 1.50,label:'1 hora y 30 minutos'},{value: 1.75,label:'1 hora y 45 minutos'}, {value: 2,label:'2 horas'}]}
                onChange={duracionInputChangeHandler}
                value={duracionTurno}
                // onBlur={validarDuracion}
              />
            </div>
            )} */}
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
