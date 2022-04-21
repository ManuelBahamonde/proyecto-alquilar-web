import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import LoadingSpinner from "components/UI/LoadingSpinner";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import * as API from "api/API";
import _ from "lodash";
import { NotificationManager } from "react-notifications";
import { useNavigate } from "react-router";
import ImageGallery from 'react-image-gallery';
import classes from "./FormInmueble.module.css";

// Validation Helpers:
const isEmpty = (value) => value.toString().trim() === "";

const isFechaValida = (value) => {
  var today = new Date();
  var date = new Date(value);

  return date > today;
};

const soloNumeros = (value) => {
  return value.toString().match(/^[0-9]+$/);
};

const soloPrecio = (value) => {
  return value.toString().match(/^-?[0-9]+([.,][0-9]+)?$/);
};

const FormInmueble = ({ idInmueble }) => {
  const navigate = useNavigate();

  const [posiblesTiposInmuebles, setPosiblesTiposInmuebles] = useState([]);
  const [hayFechaHasta, setHayFechaHasta] = useState(false);

  const [loading, setLoading] = useState(false);

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
  const [imagenesIngresadas, setImagenesIngresadas] = useState("");

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
    setLoading(true);
    // Si estamos editando nos llegará un id
    if (idInmueble) {
      API.get(`/inmueble/${idInmueble}`)
        .then((response) => {
          console.log(response.data);
          setDireccionIngresada(response.data.direccion);
          setPisoIngresado(response.data.piso ?? "");
          setDepartamentoIngresado(response.data.departamento ?? "");
          setPrecioIngresado(response.data.precio);
          setHabitacionesIngresadas(response.data.habitaciones ?? "");
          setBañosIngresados(response.data.baños ?? "");
          setAmbientesIngresados(response.data.ambientes ?? "");
          setImagenesIngresadas(response.data.imagenes ?? []);
          setTipoInmuebleIngresado({
            value: response.data.idTipoInmueble,
            label: response.data.nombreTipoInmueble,
          });
          setLocalidadIngresada({
            value: response.data.idLocalidad,
            label: response.data.nombreCompletoLocalidad,
          });
          if (!isEmpty(response.data.fechaHastaAlquilada)) {
            const date = new Date(response.data.fechaHastaAlquilada)
              .toISOString()
              .split("T")[0];
            setHayFechaHasta(true);
            setFechaHastaIngresada(date);
          }
        })
        .catch(() => {});
    }

    // Nos traemos los posibles tipos de inmueble
    API.get("/tipoInmueble")
      .then((response) => {
        const tiposInmueble = response.data.map((tipoInmueble) => ({
          value: tipoInmueble.idTipoInmueble,
          label: tipoInmueble.nombre,
        }));

        setPosiblesTiposInmuebles(tiposInmueble);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
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
  const tipoInmebleInputChangeHandler = (value) => {
    setTipoInmuebleIngresado(value);
  };
  const localidadInputChangeHandler = (value) => {
    setLocalidadIngresada(value);
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
    setLoading(true);

    const rq = {
      idInmueble: 0,
      direccion: inmuebleData.direccion,
      piso: parseInt(inmuebleData.piso),
      departamento: inmuebleData.departamento,
      precio: parseFloat(inmuebleData.precio),
      habitaciones: parseInt(inmuebleData.habitaciones),
      baños: parseInt(inmuebleData.baños),
      ambientes: parseInt(inmuebleData.ambientes),
      fechaHastaAlquilada: inmuebleData.fechaHastaAlquilada || null,
      imagenes: inmuebleData.imagenes,
      idTipoInmueble: parseInt(inmuebleData.idTipoInmueble),
      idLocalidad: parseInt(inmuebleData.idLocalidad),
      idUsuario: inmuebleData.idUsuario,
    };
    API.post("/inmueble", rq)
      .then(() => {
        NotificationManager.success("El inmueble fue creado correctamente.");
        limpiarForm();
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  const editarInmueble = async (inmuebleData) => {
    setLoading(true);

    const rq = {
      idInmueble: parseInt(inmuebleData.idInmueble),
      direccion: inmuebleData.direccion,
      piso: parseInt(inmuebleData.piso),
      departamento: inmuebleData.departamento,
      precio: parseFloat(inmuebleData.precio),
      habitaciones: parseInt(inmuebleData.habitaciones),
      baños: parseInt(inmuebleData.baños),
      ambientes: parseInt(inmuebleData.ambientes),
      fechaHastaAlquilada: inmuebleData.fechaHastaAlquilada || null,
      imagenes: inmuebleData.imagenes,
      idTipoInmueble: parseInt(inmuebleData.idTipoInmueble),
      idLocalidad: parseInt(inmuebleData.idLocalidad),
      idUsuario: inmuebleData.idUsuario,
    };
    API.put(`/inmueble/${idInmueble}`, rq)
      .then(() => {
        NotificationManager.success("El inmueble fue editado correctamente.");
        navigate(`/inmuebles/${idInmueble}`);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
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
      return { ...prevState, tipoInmueble: tipoInmuebleIngresadoEsValido };
    });
    return tipoInmuebleIngresadoEsValido;
  };
  const validarLocalidad = () => {
    const localidadIngresadaEsValido = !isEmpty(localidadIngresada);
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
    if (!idInmueble) {
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
        idTipoInmueble: tipoInmuebleIngresado.value,
        idLocalidad: localidadIngresada.value,
        idUsuario: 4, // CAMBIAR
      });
    } else {
      editarInmueble({
        idInmueble: idInmueble,
        direccion: direccionIngresada,
        piso: pisoIngresado,
        departamento: departamentoIngresado,
        precio: precioIngresado,
        habitaciones: habitacionesIngresadas,
        baños: bañosIngresados,
        ambientes: ambientesIngresados,
        fechaHastaAlquilada: fechaHastaIngresada,
        imagenes: imagenesIngresadas,
        idTipoInmueble: tipoInmuebleIngresado.value,
        idLocalidad: localidadIngresada.value,
        idUsuario: 4, // CAMBIAR
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
  const tipoInmuebleControlClassesLabel = `${classes.controlSelectLabel} ${
    formInputsValidity.tipoInmueble ? "" : classes.invalidSelectLabel
  }`;
  const localidadControlClassesLabel = `${classes.controlSelectLabel} ${
    formInputsValidity.localidad ? "" : classes.invalidSelectLabel
  }`;
  const tipoInmuebleControlClassesSelect = `${classes.controlSelect} ${
    formInputsValidity.tipoInmueble ? "" : classes.invalidSelectInput
  }`;
  const localidadControlClassesSelect = `${classes.controlSelect} ${
    formInputsValidity.localidad ? "" : classes.invalidSelectInput
  }`;

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

  const checkBoxHandler = () => {
    setHayFechaHasta((a) => {
      return !a;
    });

    if (hayFechaHasta) {
      setFechaHastaIngresada("");
      setFormInputsValidity((prevState) => ({
        ...prevState,
        fechaHasta: true,
      }));
    }
  };

  const getFormattedImages = (images) => {
    return images.map((image) => ({
        original: image.url,
        originalWidth: 100,
        originalHeight: 100,
    }));
};

  return (
    <>
      {loading ? (
        <div className="centered">
          <LoadingSpinner />
        </div>
      ) : (
        <div>
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
                      Por favor ingrese un número de ambientes válido (solo
                      números)
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
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <div className={classes.control}>
                  <label htmlFor="alquilada">Alquilada</label>
                  <input
                    name="alquilada"
                    type="checkbox"
                    style={{ width: 15, marginRight: 5 }}
                    checked={hayFechaHasta}
                    onChange={checkBoxHandler}
                  />
                </div>
              </Form.Group>
              {hayFechaHasta && (
                <Form.Group as={Col}>
                  <div className={fechaHastaControlClasses}>
                    <label htmlFor="fechaHasta">Fecha hasta alquilada</label>
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
              )}
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <div>
                  <label
                    className={tipoInmuebleControlClassesLabel}
                    htmlFor="tipoInmueble"
                  >
                    Tipo de inmueble
                  </label>
                  <Select
                    className={tipoInmuebleControlClassesSelect}
                    classNamePrefix="select"
                    isSearchable={true}
                    name="tipoInmueble"
                    options={posiblesTiposInmuebles}
                    onChange={tipoInmebleInputChangeHandler}
                    value={tipoInmuebleIngresado}
                    onBlur={validarTipoInmueble}
                  />
                  {!formInputsValidity.tipoInmueble && (
                    <p>Por favor ingrese un tipo de inmueble de la lista</p>
                  )}
                </div>
              </Form.Group>
              <Form.Group as={Col}>
                <div>
                  <label
                    className={localidadControlClassesLabel}
                    htmlFor="localidad"
                  >
                    Localidad
                  </label>
                  <AsyncSelect
                    className={localidadControlClassesSelect}
                    cacheOptions
                    loadOptions={loadOptions}
                    onChange={localidadInputChangeHandler}
                    value={localidadIngresada}
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
              <button className={classes.submit}>
                {idInmueble ? "Editar Inmueble" : "Agregar Inmueble"}
              </button>
            </div>
            {imagenesIngresadas.length > 0 && <Col md={8}>
              <ImageGallery
                items={getFormattedImages(imagenesIngresadas)}
                showPlayButton={false}
                showFullscreenButton={false}
                
              />
            </Col>}
          </Form>
        </div>
      )}
    </>
  );
};

export default FormInmueble;
