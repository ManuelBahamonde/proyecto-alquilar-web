import { Fragment, useRef, useState, useEffect } from "react";
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
  const [posiblesLocalidades, setPosiblesLocalidades] = useState([]);
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

  const direccionInputRef = useRef();
  const pisoInputRef = useRef();
  const departamentoInputRef = useRef();
  const precioInputRef = useRef();
  const habitacionesInputRef = useRef();
  const bañosInputRef = useRef();
  const ambientesInputRef = useRef();
  const fechaHastaInputRef = useRef();
  const tipoInmuebleInputRef = useRef();
  const localidadInputRef = useRef();

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
        fechaHastaAlquilada: inmuebleData.fechaHastaAlquilada,
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

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    const direccionIngresada = direccionInputRef.current.value;
    const pisoIngresado = pisoInputRef.current.value;
    const departamentoIngresado = departamentoInputRef.current.value;
    const precioIngresado = precioInputRef.current.value;
    const habitacionesIngresadas = habitacionesInputRef.current.value;
    const bañosIngresados = bañosInputRef.current.value;
    const ambientesIngresados = ambientesInputRef.current.value;
    const fechaHastaIngresada = fechaHastaInputRef.current.value;
    const tipoInmuebleIngresado = tipoInmuebleInputRef.current.value;
    const localidadIngresada = localidadInputRef.current.value;

    // Validaciones:
    const direccionIngresadaEsValido = !isEmpty(direccionIngresada);
    const pisoIngresadoEsValido =
      isEmpty(pisoIngresado) ||
      (!isEmpty(pisoIngresado) && soloNumeros(pisoIngresado));
    const departamentoIngresadoEsValido = true;
    const precioIngresadoEsValido =
      !isEmpty(precioIngresado) && soloPrecio(precioIngresado);
    const habitacionesIngresadasEsValido =
      isEmpty(habitacionesIngresadas) ||
      (!isEmpty(habitacionesIngresadas) && soloNumeros(habitacionesIngresadas));
    const bañosIngresadosEsValido =
      isEmpty(bañosIngresados) ||
      (!isEmpty(bañosIngresados) && soloNumeros(bañosIngresados));
    const ambientesIngresadosEsValido =
      isEmpty(ambientesIngresados) ||
      (!isEmpty(ambientesIngresados) && soloNumeros(ambientesIngresados));
    const fechaHastaIngresadaEsValido =
      isFechaValida(fechaHastaIngresada) || !hayFechaHasta;
    const tipoInmuebleIngresadoEsValido = !isEmpty(tipoInmuebleIngresado);
    const localidadIngresadaEsValido = localidadIngresada !== null;

    // setFormInputsValidity((prevState) => {return {...prevState,direccion:false}})
    setFormInputsValidity({
      direccion: direccionIngresadaEsValido,
      piso: pisoIngresadoEsValido,
      departamento: departamentoIngresadoEsValido,
      precio: precioIngresadoEsValido,
      habitaciones: habitacionesIngresadasEsValido,
      baños: bañosIngresadosEsValido,
      ambientes: ambientesIngresadosEsValido,
      fechaHasta: fechaHastaIngresadaEsValido,
      tipoInmueble: tipoInmuebleIngresadoEsValido,
      localidad: localidadIngresadaEsValido,
    });

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
                    ref={direccionInputRef}
                    type="text"
                    id="direccion"
                    onChange={direccionInputChangeHandler}
                    value={direccionIngresada}
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
                    ref={pisoInputRef}
                    type="text"
                    id="piso"
                    onChange={pisoInputChangeHandler}
                    value={pisoIngresado}
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
                    ref={departamentoInputRef}
                    type="text"
                    id="departamento"
                    onChange={departamentoInputChangeHandler}
                    value={departamentoIngresado}
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
                    ref={precioInputRef}
                    type="text"
                    id="precio"
                    onChange={precioInputChangeHandler}
                    value={precioIngresado}
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
                    ref={habitacionesInputRef}
                    type="text"
                    id="habitaciones"
                    onChange={habitacionesInputChangeHandler}
                    value={habitacionesIngresadas}
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
                    ref={bañosInputRef}
                    type="text"
                    id="banos"
                    onChange={bañosInputChangeHandler}
                    value={bañosIngresados}
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
                    ref={ambientesInputRef}
                    type="text"
                    id="ambientes"
                    onChange={ambientesInputChangeHandler}
                    value={ambientesIngresados}
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
                    ref={fechaHastaInputRef}
                    type="date"
                    id="fechaHasta"
                    onChange={fechaHastaInputChangeHandler}
                    value={fechaHastaIngresada}
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
                    ref={tipoInmuebleInputRef}
                    onChange={tipoInmebleInputChangeHandler}
                    value={tipoInmuebleIngresado}
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
                  {/* <Select
                    className={classes.localidad}
                    ref={localidadInputRef}
                    // onInputChange={localidadInputChangeHandler}
                    onChange={localidadInputChangeHandler}
                    options={posiblesLocalidades}
                    formatGroupLabel="Localidades"
                    value={localidadIngresada}
                  /> */}
                  <AsyncSelect
                    ref={localidadInputRef}
                    cacheOptions
                    loadOptions={loadOptions}
                    onChange={onInputChangeHandler}
                    value={localidadIngresada?.value}
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
