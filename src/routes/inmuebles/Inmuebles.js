import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import * as API from "api/API";
import LoadingSpinner from "components/UI/LoadingSpinner";
import InmuebleCard from "components/Inmuebles/InmuebleCard";

const Inmuebles = () => {
  const navigate = useNavigate();
  const [inmuebles, setInmuebles] = useState(null);

  useEffect(() => {
    API.get("/inmueble")
      .then((response) => {
        setInmuebles(response.data);
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
      .then((response) => {
        window.location.reload(false);
      })
      .catch(() => { });
  };

  if (inmuebles === null) return <LoadingSpinner className="loading-center" />;

  return (
    <div className="inmuebles-search">
      <div className="filters-container">
      </div>
      <div className="inmuebles-container">
        {inmuebles.map((inmueble) => {
          return (
            <InmuebleCard
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
    </div>
  );
};

export default Inmuebles;
