import * as API from "api/API";
import Checkbox from "components/shared/Checkbox";
import LocalidadAuto from "components/shared/LocalidadAuto";
import Card from "components/UI/Card";
import LoadingSpinner from "components/UI/LoadingSpinner";
import TextBox from "components/UI/TextBox";
import { isDropdownItemValid, isTextValid } from "helpers/Validators";
import { useCallback, useContext, useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import AuthContext from "storage/auth-context";
import SetupHorariosDisponiblesControl from "./SetupHorariosDisponiblesControl";

const Perfil = () => {
  const authCtx = useContext(AuthContext);

  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    email: '',
    localidad: null,
    direccion: '',
    piso: null,
    horarios: [],
    duracionTurno: null,
    showHorarios: false,
  });
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authCtx.idUsuario) {
      setLoading(true);
      API.get(`/usuario/${authCtx.idUsuario}`)
        .then((response) => {
          setCurrentUserInfo(response.data);

          const parseHorarios = (horarios) => horarios.map((horario) => ({
            ...horario,
            diaSemana: { value: horario.diaSemana, label: horario.diaSemana },
            horaInicio: new Date(horario.horaInicio),
            horaFin: new Date(horario.horaFin),
          }));

          setForm({
            nombre: response.data.nombre,
            telefono: response.data.telefono,
            email: response.data.email,
            localidad: { value: response.data.idLocalidad, label: response.data.nombreCompletoLocalidad },
            direccion: response.data.direccion,
            piso: response.data.piso,
            horarios: parseHorarios(response.data.horarios),
            duracionTurno: response.data.duracionTurno,
            showHorarios: response.data.horarios.length > 0,
          });

          setLoading(false);
        });
    }
  }, [authCtx.idUsuario]);

  const handleNombreChange = useCallback((newValue) => {
    setForm((prevForm) => ({
      ...prevForm,
      nombre: newValue,
    }));
  }, []);

  const handleTelefonoChange = useCallback((newValue) => {
    setForm((prevForm) => ({
      ...prevForm,
      telefono: newValue,
    }));
  }, []);

  const handleEmailChange = useCallback((newValue) => {
    setForm((prevForm) => ({
      ...prevForm,
      email: newValue,
    }));
  }, []);

  const handleLocalidadChange = useCallback((newValue) => {
    setForm((prevForm) => ({
      ...prevForm,
      localidad: newValue,
    }));
  }, []);

  const handleDireccionChange = useCallback((newValue) => {
    setForm((prevForm) => ({
      ...prevForm,
      direccion: newValue,
    }));
  }, []);

  const handlePisoChange = useCallback((newValue) => {
    setForm((prevForm) => ({
      ...prevForm,
      piso: newValue,
    }));
  }, []);

  const handleShowHorariosToggle = useCallback(() => {
    setForm((prevForm) => ({
      ...prevForm,
      showHorarios: !prevForm.showHorarios,
    }));
  }, []);

  const handleHorariosSetupChange = useCallback(({ horarios, duracionTurno }) => {
    setForm((prevForm) => ({
      ...prevForm,
      horarios,
      duracionTurno,
    }));
  }, []);

  const formSubmissionHandler = useCallback((e) => {
    e.preventDefault();

    if (!form.nombre || !form.telefono || !form.email || !form.localidad || !form.direccion) {
      NotificationManager.error('Revise los campos requeridos.');
      return;
    }

    setLoading(true);

    const parseHorarios = (horarios) => {
      return horarios.map((horario) => ({
        ...horario,
        diaSemana: horario.diaSemana.value,
        horaInicio: new Date(horario.horaInicio.getTime() - (horario.horaInicio.getTimezoneOffset() * 60000)),
        horaFin: new Date(horario.horaFin.getTime() - (horario.horaFin.getTimezoneOffset() * 60000)),
      }));
    };

    const rq = {
      nombre: form.nombre,
      telefono: form.telefono,
      email: form.email,
      idLocalidad: form.localidad?.value,
      direccion: form.direccion,
      piso: form.piso,
      duracionTurno: form.showHorarios ? form.duracionTurno : null,
      horarios: form.showHorarios ? parseHorarios(form.horarios) : [],
    };

    API.put(`/usuario/${currentUserInfo.idUsuario}`, rq)
      .then(() => {
        NotificationManager.success('Tu perfil fue editado correctamente!');
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [currentUserInfo, form]);

  if (loading) {
    return <LoadingSpinner />
  }

  const {
    nombre,
    telefono,
    email,
    localidad,
    direccion,
    piso,
    horarios,
    duracionTurno,
    showHorarios,
  } = form;

  return (
    <>
      <p className="page-title">
        Mi perfil
      </p>
      <Card className="perfil-card">
        <Form onSubmit={formSubmissionHandler}>
          <Form.Group as={Col}>
            <TextBox
              required
              containerClassName="alquilar-control"
              type="text"
              label="Nombre"
              value={nombre}
              onChange={handleNombreChange}
              validate={isTextValid}
              invalidText="El Nombre especificado no es valido"
            />
          </Form.Group>
          <Form.Group as={Col}>
            <TextBox
              required
              containerClassName="alquilar-control"
              type="text"
              label="Telefono"
              value={telefono}
              onChange={handleTelefonoChange}
              validate={isTextValid}
              invalidText="El Telefono especificado no es valido"
            />
          </Form.Group>
          <Form.Group as={Col}>
            <TextBox
              required
              containerClassName="alquilar-control"
              type="text"
              label="Email"
              value={email}
              onChange={handleEmailChange}
              validate={isTextValid}
              invalidText="El Email especificado no es valido"
            />
          </Form.Group>
          <Form.Group as={Col}>
            <LocalidadAuto
              required
              label="Localidad"
              isClearable
              cacheOptions
              placeholder="Rosario"
              onChange={handleLocalidadChange}
              value={localidad}
              validate={isDropdownItemValid}
              invalidText="La Localidad especificada no es valida"
            />
          </Form.Group>
          <Form.Group as={Col}>
            <TextBox
              required
              containerClassName="alquilar-control"
              type="text"
              label="Direccion"
              value={direccion}
              onChange={handleDireccionChange}
              validate={isTextValid}
              invalidText="La Direccion especificada no es valido"
            />
          </Form.Group>
          <Form.Group as={Col}>
            <TextBox
              containerClassName="alquilar-control"
              type="number"
              label="Piso"
              value={piso}
              onChange={handlePisoChange}
            />
          </Form.Group>
          <Form.Group as={Col} className="alquilar-control">
            <Checkbox
              label="Muestra inmuebles?"
              checked={showHorarios}
              onToggle={handleShowHorariosToggle}
            />
          </Form.Group>
          {showHorarios && (
            <SetupHorariosDisponiblesControl
              currentUserInfo={currentUserInfo}
              horarios={horarios}
              duracionTurno={duracionTurno}
              onChange={handleHorariosSetupChange}
            />
          )}
          <div className="footer">
            <button className="submit">
              Actualizar
            </button>
          </div>
        </Form>
      </Card>
    </>
  );
};
export default Perfil;
