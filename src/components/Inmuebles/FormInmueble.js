import { Fragment, useState, useEffect } from "react";
import { Form, Row, Col, Alert } from "react-bootstrap";
import LoadingSpinner from "../UI/LoadingSpinner";
import AsyncSelect from "react-select/async";
import _ from "lodash";
import classes from "./FormInmueble.module.css";

// Validation Helpers:

const isEmpty = (value) => value.trim() === "";

const isFechaValida = (value) => {
  var today = new Date();
  var date = new Date(value);

  return date > today;
};

const soloNumeros = (value) => {
  return value.match(/^[0-9]+$/);
};

const soloPrecio = (value) => {
  return value.match(/^\d{0,2}(\.\d{0,2}){0,1}$/);
};

const FormInmueble = (prop) => {
  const [posiblesTiposInmuebles, setPosiblesTiposInmuebles] = useState([]);
  const [hayFechaHasta, setHayFechaHasta] = useState(false);

  const [estamosEditando, setEstamosEditando] = useState(false);
  const [esperandoRespuesta, setEsperandoRespuesta] = useState(false);
  const [httpError, setHttpError] = useState();
  const [tenemosError, setTenemosError] = useState(null);

  const [direccionIngresada, setDireccionIngresada] = useState("");
  const [pisoIngresado, setPisoIngresado] = useState("");
  const [departamentoIngresado, setDepartamentoIngresado] = useState("");
  const [precioIngresado, setPrecioIngresado] = useState("");
  const [habitacionesIngresadas, setHabitacionesIngresadas] = useState("");
  const [bañosIngresados, setBañosIngresados] = useState("");
  const [ambientesIngresados, setAmbientesIngresados] = useState("");
  const [fechaHastaIngresada, setFechaHastaIngresada] = useState("");
  const [tipoInmuebleIngresado, setTipoInmuebleIngresado] = useState("");
  const [localidadIngresada, setLocalidadIngresada] = useState("");

  const [formInputsValidity, setFormInputsValidity] = useState({
    direccion: true,
    piso: true,
    departamento: true,
    precio: true,
    habitaciones: true,
    baños: true,
    ambientes: true,
    fechaHasta: true,
    tipoInmueble: true,
    localidad: true,
  });

  useEffect(() => {
    setTenemosError(false);
    setEsperandoRespuesta(true);
    const fetchTiposInmuebles = async () => {
      const response = await fetch("https://localhost:44380/TipoInmueble");

      if (!response.ok) {
        throw new Error("Algo salio mal al cargar los tipos de inmueble!");
      }

      const responseData = await response.json();

      const tipos = [];

      for (const key in responseData) {
        tipos.push({
          idTipoInmueble: responseData[key].idTipoInmueble,
          nombre: responseData[key].nombre,
        });
      }

      setPosiblesTiposInmuebles(tipos);
      setEsperandoRespuesta(false);
      setTenemosError(null);
    };

    fetchTiposInmuebles().catch((error) => {
      setEsperandoRespuesta(false);
      setHttpError(error.message);
      setTenemosError(true);
    });
  }, []);

  const direccionInputChangeHandler = (event) => {
    setDireccionIngresada(event.target.value);
  };
  const pisoInputChangeHandler = (event) => {
    setPisoIngresado(event.target.value);
  };
  const departamentoInputChangeHandler = (event) => {
    setDepartamentoIngresado(event.target.value);
  };
  const precioInputChangeHandler = (event) => {
    setPrecioIngresado(event.target.value);
  };
  const habitacionesInputChangeHandler = (event) => {
    setHabitacionesIngresadas(event.target.value);
  };
  const bañosInputChangeHandler = (event) => {
    setBañosIngresados(event.target.value);
  };
  const ambientesInputChangeHandler = (event) => {
    setAmbientesIngresados(event.target.value);
  };
  const fechaHastaInputChangeHandler = (event) => {
    setFechaHastaIngresada(event.target.value);
  };
  const tipoInmebleInputChangeHandler = (event) => {
    setTipoInmuebleIngresado(event.target.value);
    console.log(event.target.value);
  };

  const limpiarForm = () => {
    setDireccionIngresada("");
    setPisoIngresado("");
    setDepartamentoIngresado("");
    setPrecioIngresado("");
    setHabitacionesIngresadas("");
    setBañosIngresados("");
    setAmbientesIngresados("");
    setFechaHastaIngresada("");
    setTipoInmuebleIngresado("");
    setLocalidadIngresada("");
  };

  const guardarNuevoInmueble = async (inmuebleData) => {
    setEsperandoRespuesta(true);

    const response = await fetch("https://localhost:44380/Inmueble", {
      method: "POST",
      body: JSON.stringify({
        idInmueble: 0,
        direccion: inmuebleData.direccion,
        piso: parseInt(inmuebleData.piso),
        departamento: inmuebleData.departamento,
        precio: parseFloat(inmuebleData.precio),
        habitaciones: parseInt(inmuebleData.habitaciones),
        baños: parseInt(inmuebleData.baños),
        ambientes: parseInt(inmuebleData.ambientes),
        fechaHastaAlquilada:
          inmuebleData.fechaHastaAlquilada === ""
            ? null
            : inmuebleData.fechaHastaAlquilada,
        imagenes: inmuebleData.imagenes,
        idTipoInmueble: parseInt(inmuebleData.idTipoInmueble),
        idLocalidad: parseInt(inmuebleData.idLocalidad),
        idUsuario: inmuebleData.idUsuario,
      }),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    }).catch((error) => {
      setEsperandoRespuesta(false);
      setHttpError(error.message);
      setTenemosError(true);
    });

    if (!response.ok) {
      setHttpError("Algo salió mal!");
      setTenemosError(true);
      setEsperandoRespuesta(false);
    } else {
      setEsperandoRespuesta(false);
      setHttpError("");
      setTenemosError(false);
      limpiarForm();
    }
  };

  // Validaciones individuales por campo
  const validarDireccion = () => {
    const direccionIngresadaEsValido = !isEmpty(direccionIngresada);
    setFormInputsValidity((prevState) => {
      return { ...prevState, direccion: direccionIngresadaEsValido };
    });
    return direccionIngresadaEsValido;
  };
  const validarPiso = () => {
    const pisoIngresadoEsValido =
      isEmpty(pisoIngresado) ||
      (!isEmpty(pisoIngresado) && soloNumeros(pisoIngresado));
    setFormInputsValidity((prevState) => {
      return { ...prevState, piso: pisoIngresadoEsValido };
    });
    return pisoIngresadoEsValido;
  };
  const validarDepartamento = () => {
    const departamentoIngresadoEsValido = true;
    setFormInputsValidity((prevState) => {
      return { ...prevState, departamento: departamentoIngresadoEsValido };
    });
    return departamentoIngresadoEsValido;
  };

  const validarPrecio = () => {
    const precioIngresadoEsValido =
      !isEmpty(precioIngresado) && soloPrecio(precioIngresado);
    setFormInputsValidity((prevState) => {
      return { ...prevState, precio: precioIngresadoEsValido };
    });
    return precioIngresadoEsValido;
  };
  const validarHabitaciones = () => {
    const habitacionesIngresadasEsValido =
      isEmpty(habitacionesIngresadas) ||
      (!isEmpty(habitacionesIngresadas) && soloNumeros(habitacionesIngresadas));
    setFormInputsValidity((prevState) => {
      return { ...prevState, habitaciones: habitacionesIngresadasEsValido };
    });
    return habitacionesIngresadasEsValido;
  };
  const validarBaños = () => {
    const bañosIngresadosEsValido =
      isEmpty(bañosIngresados) ||
      (!isEmpty(bañosIngresados) && soloNumeros(bañosIngresados));
    setFormInputsValidity((prevState) => {
      return { ...prevState, baños: bañosIngresadosEsValido };
    });
    return bañosIngresadosEsValido;
  };
  const validarAmbientes = () => {
    const ambientesIngresadosEsValido =
      isEmpty(ambientesIngresados) ||
      (!isEmpty(ambientesIngresados) && soloNumeros(ambientesIngresados));
    setFormInputsValidity((prevState) => {
      return { ...prevState, ambientes: ambientesIngresadosEsValido };
    });
    return ambientesIngresadosEsValido;
  };
  const validarFechaHasta = () => {
    const fechaHastaIngresadaEsValido =
      isFechaValida(fechaHastaIngresada) || !hayFechaHasta;
    setFormInputsValidity((prevState) => {
      return { ...prevState, fechaHasta: fechaHastaIngresadaEsValido };
    });
    return fechaHastaIngresadaEsValido;
  };
  const validarTipoInmueble = () => {
    const tipoInmuebleIngresadoEsValido = !isEmpty(tipoInmuebleIngresado);
    setFormInputsValidity((prevState) => {
      return { ...prevState, tipoInmuebles: tipoInmuebleIngresadoEsValido };
    });
    return tipoInmuebleIngresadoEsValido;
  };
  const validarLocalidad = () => {
    const localidadIngresadaEsValido = localidadIngresada !== null;
    setFormInputsValidity((prevState) => {
      return { ...prevState, localidad: localidadIngresadaEsValido };
    });
    return localidadIngresadaEsValido;
  };

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    // Validaciones:
    const direccionIngresadaEsValido = validarDireccion();

    const pisoIngresadoEsValido = validarPiso();

    const departamentoIngresadoEsValido = validarDepartamento();

    const precioIngresadoEsValido = validarPrecio();

    const habitacionesIngresadasEsValido = validarHabitaciones();

    const bañosIngresadosEsValido = validarBaños();

    const ambientesIngresadosEsValido = validarAmbientes();

    const fechaHastaIngresadaEsValido = validarFechaHasta();

    const tipoInmuebleIngresadoEsValido = validarTipoInmueble();

    const localidadIngresadaEsValido = validarLocalidad();

    const formIsValid =
      direccionIngresadaEsValido &&
      pisoIngresadoEsValido &&
      departamentoIngresadoEsValido &&
      precioIngresadoEsValido &&
      habitacionesIngresadasEsValido &&
      bañosIngresadosEsValido &&
      ambientesIngresadosEsValido &&
      fechaHastaIngresadaEsValido &&
      tipoInmuebleIngresadoEsValido &&
      localidadIngresadaEsValido;

    if (!formIsValid) {
      return;
    }

    // Llamo a la función para crear el inmueble...

    if (!estamosEditando) {
      guardarNuevoInmueble({
        idInmueble: 0,
        direccion: direccionIngresada,
        piso: pisoIngresado,
        departamento: departamentoIngresado,
        precio: precioIngresado,
        habitaciones: habitacionesIngresadas,
        baños: bañosIngresados,
        ambientes: ambientesIngresados,
        fechaHastaAlquilada: fechaHastaIngresada,
        imagenes: [],
        idTipoInmueble: tipoInmuebleIngresado,
        idLocalidad: localidadIngresada,
        idUsuario: 4,
      });
    }
  };

  const direccionControlClasses = `${classes.control} ${
    formInputsValidity.direccion ? "" : classes.invalid
  }`;
  const pisoControlClasses = `${classes.control} ${
    formInputsValidity.piso ? "" : classes.invalid
  }`;
  const departamentoControlClasses = `${classes.control} ${
    formInputsValidity.departamento ? "" : classes.invalid
  }`;
  const precioControlClasses = `${classes.control} ${
    formInputsValidity.precio ? "" : classes.invalid
  }`;
  const habitacionesControlClasses = `${classes.control} ${
    formInputsValidity.habitaciones ? "" : classes.invalid
  }`;
  const bañosControlClasses = `${classes.control} ${
    formInputsValidity.baños ? "" : classes.invalid
  }`;
  const ambientesControlClasses = `${classes.control} ${
    formInputsValidity.ambientes ? "" : classes.invalid
  }`;
  const fechaHastaControlClasses = `${classes.control} ${
    formInputsValidity.fechaHasta ? "" : classes.invalid
  }`;
  const tipoInmuebleControlClasses = `${classes.control} ${
    formInputsValidity.tipoInmueble ? "" : classes.invalid
  }`;
  const localidadControlClasses = `${classes.control} ${
    formInputsValidity.localidad ? "" : classes.invalid
  }`;

  const onCloseHandler = () => {
    setTenemosError(null);
  };

  const Alerta = () => {
    if (tenemosError !== null) {
      if (tenemosError) {
        return (
          <Alert variant="danger" onClose={onCloseHandler} dismissible>
            <Alert.Heading>¡Malas noticias!</Alert.Heading>
            <p>{httpError}</p>
          </Alert>
        );
      }
      if (!tenemosError) {
        return (
          <Alert variant="success" onClose={onCloseHandler} dismissible>
            <Alert.Heading>¡Buenas noticias!</Alert.Heading>
            <p>
              {estamosEditando
                ? "Se modificó con éxito el inmueble"
                : "Se guardó con éxito el inmueble"}
            </p>
          </Alert>
        );
      }
    } else {
      return <></>;
    }
  };
  // TODO:
  const loadOptions = _.debounce((input, callback) => {
    console.log(input);

    setTenemosError(null);
    const fetchLocalidades = async () => {
      const response = await fetch("https://localhost:44380/Localidad");

      if (!response.ok) {
        throw new Error("No hay ninguna localidad cargada con ese nombre");
      }

      const responseData = await response.json();

      const localidades = [];

      for (const key in responseData) {
        localidades.push({
          idLocalidad: responseData[key].idLocalidad,
          label: responseData[key].label,
        });
      }

      callback(localidades);
      setTenemosError(null);
      console.log("se hizo una llamada");
    };

    fetchLocalidades().catch((error) => {
      setHttpError(error.message);
      setTenemosError(true);
    });
  }, 1000);

  const onInputChangeHandler = (value) => {
    setLocalidadIngresada(value.idLocalidad);
    console.log(value.idLocalidad);
  };

  const checkBoxHandler = () => {
    setHayFechaHasta((a) => {
      return !a;
    });

    if (hayFechaHasta) {
      setFechaHastaIngresada("");
    }
  };

  return (
    <Fragment>
      {esperandoRespuesta && (
        <div className="centered">
          <LoadingSpinner />
        </div>
      )}
      {!esperandoRespuesta && (
        <div>
          <Alerta />
          <Form className={classes.form} onSubmit={formSubmissionHandler}>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <div className={direccionControlClasses}>
                  <label htmlFor="direccion">Direccion</label>
                  <input
                    type="text"
                    id="direccion"
                    onChange={direccionInputChangeHandler}
                    value={direccionIngresada}
                    onBlur={validarDireccion}
                  />
                  {!formInputsValidity.direccion && (
                    <p>Por favor ingrese una dirección válida</p>
                  )}
                </div>
              </Form.Group>
              <Form.Group as={Col}>
                <div className={pisoControlClasses}>
                  <label htmlFor="piso">Piso</label>
                  <input
                    type="text"
                    id="piso"
                    onChange={pisoInputChangeHandler}
                    value={pisoIngresado}
                    onBlur={validarPiso}
                  />
                  {!formInputsValidity.piso && (
                    <p>Por favor ingrese un piso válido (solo números)</p>
                  )}
                </div>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <div className={departamentoControlClasses}>
                  <label htmlFor="departamento">Departamento</label>
                  <input
                    type="text"
                    id="departamento"
                    onChange={departamentoInputChangeHandler}
                    value={departamentoIngresado}
                    onBlur={validarDepartamento}
                  />
                  {!formInputsValidity.departamento && (
                    <p>Por favor ingrese un depto válido</p>
                  )}
                </div>
              </Form.Group>
              <Form.Group as={Col}>
                <div className={precioControlClasses}>
                  <label htmlFor="precio">Precio</label>
                  <input
                    type="text"
                    id="precio"
                    onChange={precioInputChangeHandler}
                    value={precioIngresado}
                    onBlur={validarPrecio}
                  />
                  {!formInputsValidity.precio && (
                    <p>Por favor ingrese un precio válido (solo números)</p>
                  )}
                </div>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <div className={habitacionesControlClasses}>
                  <label htmlFor="habitaciones">Habitaciones</label>
                  <input
                    type="text"
                    id="habitaciones"
                    onChange={habitacionesInputChangeHandler}
                    value={habitacionesIngresadas}
                    onBlur={validarHabitaciones}
                  />
                  {!formInputsValidity.habitaciones && (
                    <p>Por favor ingrese un número de habitaciones válido</p>
                  )}
                </div>
              </Form.Group>
              <Form.Group as={Col}>
                <div className={bañosControlClasses}>
                  <label htmlFor="banos">Baños</label>
                  <input
                    type="text"
                    id="banos"
                    onChange={bañosInputChangeHandler}
                    value={bañosIngresados}
                    onBlur={validarBaños}
                  />
                  {!formInputsValidity.baños && (
                    <p>
                      Por favor ingrese un número de baños válido (solo números)
                    </p>
                  )}
                </div>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <div className={ambientesControlClasses}>
                  <label htmlFor="ambientes">Ambientes</label>
                  <input
                    type="text"
                    id="ambientes"
                    onChange={ambientesInputChangeHandler}
                    value={ambientesIngresados}
                    onBlur={validarAmbientes}
                  />
                </div>
                {!formInputsValidity.ambientes && (
                  <p>
                    Por favor ingrese un número de ambientes válido (solo
                    números)
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col}>
                <div className={fechaHastaControlClasses}>
                  <Row>
                    <Col md={12}>
                      <input
                        name="hayFechaHasta"
                        type="checkbox"
                        checked={hayFechaHasta}
                        onChange={checkBoxHandler}
                      />
                    </Col>
                    <Col>
                      <label htmlFor="hayFechaHasta">
                        Fecha hasta alquilada
                      </label>
                    </Col>
                  </Row>
                  <input
                    disabled={!hayFechaHasta}
                    type="date"
                    id="fechaHasta"
                    onChange={fechaHastaInputChangeHandler}
                    value={fechaHastaIngresada}
                    onBlur={validarFechaHasta}
                  />
                  {!formInputsValidity.fechaHasta && (
                    <p>Por favor ingrese una fecha válida</p>
                  )}
                </div>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <div className={tipoInmuebleControlClasses}>
                  <label htmlFor="tipoInmueble">Tipo de inmueble</label>
                  <select
                    aria-label="Elija un tipo"
                    onChange={tipoInmebleInputChangeHandler}
                    value={tipoInmuebleIngresado}
                    onBlur={validarTipoInmueble}
                  >
                    {posiblesTiposInmuebles.map((tipo) => (
                      <option
                        key={tipo.idTipoInmueble}
                        value={tipo.idTipoInmueble}
                      >
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                  {!formInputsValidity.tipoInmueble && (
                    <p>Por favor ingrese un tipo de inmueble de la lista</p>
                  )}
                </div>
              </Form.Group>
              <Form.Group as={Col}>
                <div className={localidadControlClasses}>
                  <label htmlFor="localidad">Localidad</label>
                  <AsyncSelect
                    className={classes.localidad}
                    cacheOptions
                    loadOptions={loadOptions}
                    onChange={onInputChangeHandler}
                    value={localidadIngresada?.value}
                    onBlur={validarLocalidad}
                  />
                  {!formInputsValidity.localidad && (
                    <p>Por favor ingrese una localidad válida</p>
                  )}
                </div>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <p>Agregar imagenes +</p>
            </Row>
            <div className={classes.actions}>
              <button className={classes.submit}>Agregar Inmueble</button>
            </div>
          </Form>
        </div>
      )}
    </Fragment>
  );
};

export default FormInmueble;
