import { useCallback, useContext } from "react";
import AuthContext from "storage/auth-context";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import * as API from "api/API";
import LoadingSpinner from "components/UI/LoadingSpinner";
import InmuebleStyledCard from "components/inmuebles/InmuebleStyledCard";
import { NotificationManager } from "react-notifications";


const MisPropiedades = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [inmuebles, setInmuebles] = useState(null);

  const getUserInmuebles = useCallback(() => {
    setLoading(true);

    const rq = {
      idUsuario: authCtx.idUsuario
    };

    API.get("/inmueble", rq)
      .then((response) => {
        setInmuebles(response.data);
        setLoading(false);
      })
      .catch(() => { });
  }, [authCtx.idUsuario]);

  useEffect(() => {
    getUserInmuebles();
  }, [getUserInmuebles]);

  const handleInmuebleEdit = (inmueble) => {
    navigate(`/inmueblesEditMode/${inmueble.idInmueble}`);
  };
  const handleInmuebleDelete = (inmueble) => {
    setLoading(true);

    API.del(`/inmueble/${inmueble.idInmueble}`)
      .then(() => {
        NotificationManager.success('El Inmueble fue eliminado correctamente!');
        getUserInmuebles();
      })
      .catch(() => { });
  };
  if (loading || !inmuebles) return <LoadingSpinner className="loading-center" />;

  return (
    <>
      <p className="page-title">
        Mis propiedades
      </p>
      ;
      <div className="inmuebles-container">
        {inmuebles.map((inmueble) => {
          return (
            <InmuebleStyledCard
              key={inmueble.idInmueble}
              inmueble={inmueble}
              onEdit={() => handleInmuebleEdit(inmueble)}
              onDelete={() => handleInmuebleDelete(inmueble)}
            />
          );
        })}

        <Outlet />
      </div>
    </>
  );
};
export default MisPropiedades;
