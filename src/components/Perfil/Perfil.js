import * as API from "api/API";
import LocalidadSelect from "components/Shared/LocalidadSelect";
import TextBox from "components/UI/TextBox";
import { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "storage/auth-context";

const Perfil = () => {
  const authCtx = useContext(AuthContext);

  console.log(authCtx);

  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    email: '',
    localidad: null,
    direccion: '',
    piso: null,
  });
  const [currentUserInfo, setCurrentUserInfo] = useState(null);

  useEffect(() => {
    if (authCtx.idUsuario) {
      API.get(`/usuario/${authCtx.idUsuario}`)
        .then((response) => {
          setCurrentUserInfo(response.data);

          setForm({
            nombre: response.data.nombre,
            telefono: response.data.telefono,
            email: response.data.email,
            localidad: response.data.idLocalidad,
            direccion: response.data.direccion,
            piso: response.data.piso,
          });
        });
    }
  }, [authCtx.idUsuario]);

  const {
    nombre,
    telefono,
    email,
    localidad,
    direccion,
    piso
  } = form;

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

  return (
    <div className="perfil-container">
      <TextBox
        containerClassName="search-control"
        type="text"
        label="Nombre"
        value={nombre}
        onChange={handleNombreChange}
      />
      <TextBox
        containerClassName="search-control"
        type="text"
        label="Telefono"
        value={telefono}
        onChange={handleTelefonoChange}
      />
      <TextBox
        containerClassName="search-control"
        type="text"
        label="Email"
        value={email}
        onChange={handleEmailChange}
      />
      <LocalidadSelect
        isClearable
        cacheOptions
        placeholder="Rosario"
        onChange={handleLocalidadChange}
        value={localidad}
      />
      <TextBox
        containerClassName="search-control"
        type="text"
        label="Direccion"
        value={direccion}
        onChange={handleDireccionChange}
      />
      <TextBox
        containerClassName="search-control"
        type="number"
        label="Piso"
        value={piso}
        onChange={handlePisoChange}
      />
    </div>
  );
};
export default Perfil;
