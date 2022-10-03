import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import LoadingSpinner from "components/UI/LoadingSpinner";
import * as API from "api/API";
import { NotificationManager } from "react-notifications";
import { useNavigate } from "react-router";

import classes from "./FormNoticia.module.css";
import TextBox from "components/UI/TextBox";

// Validation Helper:
const isEmpty = (value) => value.toString().trim() === "";

const FormNoticia = ({ idNoticia }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tituloIngresado, setTituloIngresado] = useState("");
  const [descripcionIngresada, setDescripcionIngresada] = useState("");

  useEffect(() => {
    setLoading(true);
    if (idNoticia) {
      API.get(`/noticia/${idNoticia}`)
        .then((response) => {
          setTituloIngresado(response.data.titulo);
          setDescripcionIngresada(response.data.descripcion);
        })
        .catch(() => {});
    }
    setLoading(false);
  }, [idNoticia]);

  const tituloInputChangeHandler = (newValue) => {
    setTituloIngresado(newValue);
  };
  const descripcionInputChangeHandler = (newValue) => {
    setDescripcionIngresada(newValue);
  };

  const limpiarForm = () => {
    setTituloIngresado("");
    setDescripcionIngresada("");
  };

  const guardarNuevaNoticia = async (noticiaData) => {
    setLoading(true);

    const noticia = {
      idNoticia: 0,
      titulo: noticiaData.titulo,
      descripcion: noticiaData.descripcion,
    };
    API.post("/noticia", noticia)
      .then(() => {
        NotificationManager.success("La noticia fue creada correctamente.");
        limpiarForm();
        navigate(`/admin/listadoNoticias`);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const editarNoticia = async (noticiaData) => {
    setLoading(true);

    const rq = {
      idNoticia: parseInt(noticiaData.idNoticia),
      titulo: noticiaData.titulo,
      descripcion: noticiaData.descripcion,
    };
    API.put(`/noticia/${idNoticia}`, rq)
      .then(() => {
        NotificationManager.success("La noticia fue editada correctamente.");
        navigate(`/admin/listadoNoticias`);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  // Validaciones individuales por campo
  const validarTitulo = () => {
    const tituloIngresadoEsValido = !isEmpty(tituloIngresado);
    return tituloIngresadoEsValido;
  };
  const validarDescripcion = () => {
    const descripcionIngresadaEsValida = !isEmpty(descripcionIngresada);
    return descripcionIngresadaEsValida;
  };

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    // Validaciones:
    const tituloIngresadoEsValido = validarTitulo();
    const descripcionIngresadaEsValida = validarDescripcion();

    const formIsValid = tituloIngresadoEsValido && descripcionIngresadaEsValida;

    if (!formIsValid) {
      return;
    }

    if (!idNoticia) {
      guardarNuevaNoticia({
        idNoticia: 0,
        titulo: tituloIngresado,
        descripcion: descripcionIngresada,
      });
    } else {
      editarNoticia({
        idNoticia: idNoticia,
        titulo: tituloIngresado,
        descripcion: descripcionIngresada,
      });
    }
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
              <Col sm={4}>
                <Form.Group>
                  <TextBox
                    id="titulo"
                    type="text"
                    label="Titulo"
                    containerClassName={classes.control}
                    value={tituloIngresado}
                    onChange={tituloInputChangeHandler}
                    validate={validarTitulo}
                    invalidText="Por favor ingrese un titulo válido"
                  />
                </Form.Group>
              </Col>
              <Col sm={8}>
                <Form.Group>
                  <div className={classes.textEditorDescription}>
                    <TextBox
                      id="descripcion"
                      type="text"
                      label="Descripcion"
                      containerClassName={classes.control}
                      value={descripcionIngresada}
                      onChange={descripcionInputChangeHandler}
                      validate={validarDescripcion}
                      invalidText="Por favor ingrese una descripcion válida"
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <div className={classes.actions}>
              <button className={classes.submit}>
                {idNoticia ? "Editar Noticia" : "Agregar Noticia"}
              </button>
            </div>
          </Form>
        </div>
      )}
    </>
  );
};

export default FormNoticia;
