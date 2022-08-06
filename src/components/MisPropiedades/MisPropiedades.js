import { useContext } from "react";
import AuthContext from "storage/auth-context";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import * as API from "api/API";
import LoadingSpinner from "components/UI/LoadingSpinner";
import InmuebleCard from "components/Inmuebles/InmuebleCard";
import InmuebleStyledCard from "components/Inmuebles/InmuebleStyledCard";
import classes from "./MisPropiedades.module.css";


const MisPropiedades = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [inmuebles, setInmuebles] = useState(null);

  useEffect(() => {
    setLoading(true);

    const rq = {
      idUsuario: authCtx.idUsuario
    };

    API.get("/inmueble", rq)
      .then((response) => {
        console.log(response);
        setInmuebles(response.data);
        setLoading(false);
      })
      .catch(() => { });
  }, []);

  const handleInmuebleSelected = (inmueble) => {
    navigate(`/inmuebles/${inmueble.idInmueble}`);
  };

  const handleInmuebleEdit = (inmueble) => {
    navigate(`/inmueblesEditMode/${inmueble.idInmueble}`);
  };
  const handleInmuebleDelete = (inmueble) => {
    API.del(`/inmueble/${inmueble.idInmueble}`)
      .then(() => {
        window.location.reload(false);
      })
      .catch(() => { });
  };
  if (loading || !inmuebles) return <LoadingSpinner className="loading-center" />;
  
  return (
    <>
      <p className={classes.tittle}>
        Mis propiedades
      </p>
      ;
      <div className="inmuebles-container">
        {inmuebles.map((inmueble) => {
          return (
            <InmuebleStyledCard
              key={inmueble.idInmueble}
              inmueble={inmueble}
              onSelect={() => handleInmuebleSelected(inmueble)}
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
