import React, { useState, useEffect, useRef, useContext } from "react";
import { Form, Row, Col } from "react-bootstrap";
import LoadingSpinner from "components/UI/LoadingSpinner";
import LocalidadAuto from 'components/shared/LocalidadAuto';
import * as API from "api/API";
import { NotificationManager } from "react-notifications";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router";
import ImageGallery from "react-image-gallery";
import AuthContext from "storage/auth-context";
import { app } from "storage/fb";

import classes from "./FormInmueble.module.css";
import TextBox from "components/UI/TextBox";
import Checkbox from "components/shared/Checkbox";
import TipoInmuebleCombo from "components/shared/TipoInmuebleCombo";

// Validation Helpers:
const isEmpty = (value) => value.toString().trim() === "";

const isFechaValida = (value) => {
  var today = new Date();
  var date = new Date(value);

  return date > today;
};

const soloNumeros = (value) => {
  // return value.toString().match(/^[0-9]+$/);
  return /^[0-9]+$/.test(value.toString());
};

const soloPrecio = (value) => {
  // return value.toString().match(/^-?[0-9]+([.,][0-9]+)?$/);
  return /^-?[0-9]+([.,][0-9]+)?$/.test(value.toString());
};

const soloImagenes = (imagenes) => {
  var validez = true;
  for (let i = 0; i < imagenes.length; i++) {
    const archivo = imagenes[i];
    const extension = archivo.name.split(".").pop();

    if (
      extension === "png" ||
      extension === "gif" ||
      extension === "jpeg" ||
      extension === "jpg"
    ) {
    } else {
      validez = false;
    }
  }
  return validez;
};

const FormInmueble = ({ idInmueble }) => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

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
  const [imagenesIngresadas, setImagenesIngresadas] = useState([]);

  const [imagenesPorCargar, setImagenesPorCargar] = useState([]);

  const imagesRef = useRef();

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
    imagenes: true,
  });

  useEffect(() => {
    setLoading(true);
    if (idInmueble) {
      API.get(`/inmueble/${idInmueble}`)
        .then((response) => {
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
            setHayFechaHasta(true);
            setFechaHastaIngresada(new Date(response.data.fechaHastaAlquilada));
          }
        })
        .catch(() => { });
    }
    setLoading(false)
  }, [idInmueble]);

  const direccionInputChangeHandler = (newValue) => {
    setDireccionIngresada(newValue);
  };
  const pisoInputChangeHandler = (newValue) => {
    setPisoIngresado(newValue);
  };
  const departamentoInputChangeHandler = (newValue) => {
    setDepartamentoIngresado(newValue);
  };
  const precioInputChangeHandler = (newValue) => {
    setPrecioIngresado(newValue);
  };
  const habitacionesInputChangeHandler = (newValue) => {
    setHabitacionesIngresadas(newValue);
  };
  const bañosInputChangeHandler = (newValue) => {
    setBañosIngresados(newValue);
  };
  const ambientesInputChangeHandler = (newValue) => {
    setAmbientesIngresados(newValue);
  };
  const fechaHastaInputChangeHandler = (newValue) => {
    setFechaHastaIngresada(newValue);
  };
  const tipoInmebleInputChangeHandler = (value) => {
    setTipoInmuebleIngresado(value);
  };
  const localidadInputChangeHandler = (value) => {
    setLocalidadIngresada(value);
  };
  const imagesInputChangeHandler = (value) => {
    const imagenes = value.target.files;
    setImagenesPorCargar(imagenes);
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
    setImagenesIngresadas([]);
    setImagenesPorCargar([]);
  };

  const cargarImagenes = async () => {
    // enlazace a los servicios de storage
    const storageRef = app.storage().ref();
    let imagenes = imagenesIngresadas;
    for (let i = 0; i < imagenesPorCargar.length; i++) {
      const imagen = imagenesPorCargar[i];
      const imagenPath = storageRef.child(imagen.name);
      await imagenPath.put(imagen);
      const enlaceUrl = await imagenPath.getDownloadURL();
      imagenes.push({
        idImagen: null,
        url: enlaceUrl,
        idUsuario: null,
        idInmueble: idInmueble,
      });

      // Por las dudas tambien las guardo en el useState actualizadas
      setImagenesIngresadas((images) => [
        ...images,
        {
          idImagen: null,
          url: enlaceUrl,
          idUsuario: null,
          idInmueble: idInmueble,
        },
      ]);
    }
    return imagenes;
  };

  const guardarNuevoInmueble = async (inmuebleData) => {
    setLoading(true);

    const imagenesCargadas = await cargarImagenes();
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
      imagenes: imagenesCargadas,
      idTipoInmueble: parseInt(inmuebleData.idTipoInmueble),
      idLocalidad: parseInt(inmuebleData.idLocalidad),
      idUsuario: inmuebleData.idUsuario,
    };
    API.post("/inmueble", rq)
      .then(() => {
        NotificationManager.success("El inmueble fue creado correctamente.");
        limpiarForm();
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  const editarInmueble = async (inmuebleData) => {
    setLoading(true);

    const imagenesCargadas = await cargarImagenes();
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
      imagenes: imagenesCargadas,
      idTipoInmueble: parseInt(inmuebleData.idTipoInmueble),
      idLocalidad: parseInt(inmuebleData.idLocalidad),
      idUsuario: inmuebleData.idUsuario,
    };
    API.put(`/inmueble/${idInmueble}`, rq)
      .then(() => {
        NotificationManager.success("El inmueble fue editado correctamente.");
        navigate(`/inmuebles/${idInmueble}`);
      })
      .catch(() => { })
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

  const validarImagenes = () => {
    const imagenesPorCargarEsValido = soloImagenes(imagenesPorCargar);
    setFormInputsValidity((prevState) => {
      return { ...prevState, imagenes: imagenesPorCargarEsValido };
    });
    return imagenesPorCargarEsValido;
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

    const imagenesIngresadasSonValidas = validarImagenes();

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
      localidadIngresadaEsValido &&
      imagenesIngresadasSonValidas;

    if (!formIsValid) {
      return;
    }

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
        imagenes: imagenesIngresadas,
        idTipoInmueble: tipoInmuebleIngresado.value,
        idLocalidad: localidadIngresada.value,
        idUsuario: authCtx.idUsuario,
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
        idUsuario: authCtx.idUsuario,
      });
    }
  };

  const fechaHastaControlClasses = `${classes.control} ${formInputsValidity.fechaHasta ? "" : classes.invalid
    }`;
  const localidadControlClassesLabel = `${classes.controlSelectLabel} ${formInputsValidity.localidad ? "" : classes.invalidSelectLabel
    }`;
  const tipoInmuebleControlClassesSelect = `${classes.controlSelect} ${formInputsValidity.tipoInmueble ? "" : classes.invalidSelectInput
    }`;
  const localidadControlClassesSelect = `${classes.controlSelect} ${formInputsValidity.localidad ? "" : classes.invalidSelectInput
    }`;

  const imagenesControlClassesSelect = `${classes.control} ${formInputsValidity.imagenes ? "" : classes.invalid
    }`;

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


  const onDeleteImageHandler = (event) => {
    event.preventDefault();

    setImagenesIngresadas((prevState) =>
      prevState.filter((_, i) => i !== imagesRef.current.getCurrentIndex())
    );
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
                <TextBox
                  id="direccion"
                  type="text"
                  label="Direccion"
                  containerClassName={classes.control}
                  value={direccionIngresada}
                  onChange={direccionInputChangeHandler}
                  validate={validarDireccion}
                  invalidText="Por favor ingrese una dirección válida"
                />
              </Form.Group>
              <Form.Group as={Col}>
                <TextBox
                  id="piso"
                  type="text"
                  label="Piso"
                  containerClassName={classes.control}
                  value={pisoIngresado}
                  onChange={pisoInputChangeHandler}
                  validate={validarPiso}
                  invalidText="Por favor ingrese un piso válido (solo números)"
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <TextBox
                  id="departamento"
                  type="text"
                  label="Departamento"
                  containerClassName={classes.control}
                  value={departamentoIngresado}
                  onChange={departamentoInputChangeHandler}
                  validate={validarDepartamento}
                  invalidText="Por favor ingrese un depto válido"
                />
              </Form.Group>
              <Form.Group as={Col}>
                <TextBox
                  id="precio"
                  type="text"
                  label="Precio"
                  containerClassName={classes.control}
                  value={precioIngresado}
                  onChange={precioInputChangeHandler}
                  validate={validarPrecio}
                  invalidText="Por favor ingrese un precio válido (solo números)"
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <TextBox
                  id="numHabitaciones"
                  type="text"
                  label="Habitaciones"
                  containerClassName={classes.control}
                  value={habitacionesIngresadas}
                  onChange={habitacionesInputChangeHandler}
                  validate={validarHabitaciones}
                  invalidText="Por favor ingrese un número de habitaciones válido"
                />
              </Form.Group>
              <Form.Group as={Col}>
                <TextBox
                  id="banos"
                  type="text"
                  label="Baños"
                  containerClassName={classes.control}
                  value={bañosIngresados}
                  onChange={bañosInputChangeHandler}
                  validate={validarBaños}
                  invalidText="Por favor ingrese un número de baños válido (solo números)"
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <TextBox
                  id="ambientes"
                  type="text"
                  label="Ambientes"
                  containerClassName={classes.control}
                  value={ambientesIngresados}
                  onChange={ambientesInputChangeHandler}
                  validate={validarAmbientes}
                  invalidText="Por favor ingrese un número de ambientes válido (solo números)"
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Checkbox
                  label="Alquilada"
                  checked={hayFechaHasta}
                  onToggle={checkBoxHandler}
                  containerClassName={classes.control}
                />
              </Form.Group>
              {hayFechaHasta && (
                <Form.Group as={Col}>
                  <div className={fechaHastaControlClasses}>
                    <label>Fecha hasta alquilada</label>
                    <DatePicker
                      disabled={!hayFechaHasta}
                      dateFormat="dd/MM/yyyy"
                      selected={fechaHastaIngresada}
                      onChange={fechaHastaInputChangeHandler}
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
                <TipoInmuebleCombo
                  id="tipoInmueble"
                  label="Tipo de inmueble"
                  className={tipoInmuebleControlClassesSelect}
                  onChange={tipoInmebleInputChangeHandler}
                  value={tipoInmuebleIngresado}
                  validate={() => !isEmpty()}
                  invalidText="Por favor ingrese un tipo de inmueble de la lista"
                />
              </Form.Group>
              <Form.Group as={Col}>
                <div>
                  <label
                    className={localidadControlClassesLabel}
                    htmlFor="localidad"
                    posiblesTiposInmuebles
                  >
                    Localidad
                  </label>
                  <LocalidadAuto
                    cacheOptions
                    className={localidadControlClassesSelect}
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
              <Form.Group as={Col}>
                <div className={imagenesControlClassesSelect}>
                  <label htmlFor="imagenes">Imagenes</label>
                  <input
                    type="file"
                    id="imagen"
                    multiple="multiple"
                    accept="image/png, image/gif, image/jpeg"
                    onChange={imagesInputChangeHandler}
                    onBlur={validarImagenes}
                  />
                  {!formInputsValidity.imagenes && (
                    <p>
                      Por favor ingrese imagenes válidas (solo PNG/GIF/JPEG){" "}
                    </p>
                  )}
                  <p>
                    (*) Las imagenes {idInmueble ? "nuevas" : ""} serán
                    agregadas una vez finalizada la{" "}
                    {idInmueble ? "edición" : "creación del inmueble"}.{" "}
                  </p>
                </div>
              </Form.Group>
            </Row>
            {imagenesIngresadas.length > 0 && (
              <Col md={8}>
                <ImageGallery
                  ref={imagesRef}
                  items={getFormattedImages(imagenesIngresadas)}
                  showPlayButton={false}
                  showFullscreenButton={false}
                  showBullets={true}
                  showIndex={true}
                />
                <button
                  className={classes.buttonDelete}
                  onClick={onDeleteImageHandler}
                >
                  Eliminar imagen
                </button>
              </Col>
            )}
            <div className={classes.actions}>
              <button className={classes.submit}>
                {idInmueble ? "Editar Inmueble" : "Agregar Inmueble"}
              </button>
            </div>
          </Form>
        </div>
      )}
    </>
  );
};

export default FormInmueble;
