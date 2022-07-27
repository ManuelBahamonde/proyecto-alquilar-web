import React, { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import * as API from "api/API";
import LoadingSpinner from "components/UI/LoadingSpinner";
import InmuebleCard from "components/Inmuebles/InmuebleCard";
import TextBox from "components/UI/TextBox";
import { Button } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import LocalidadSelect from "components/Shared/LocalidadSelect";

const Inmuebles = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [inmuebles, setInmuebles] = useState(null);
  const [filters, setFilters] = useState({
    habitaciones: null,
    ambientes: null,
    fechaDisponibilidad: null,
    localidad: null,
  });

  const search = useCallback(() => {
    setLoading(true);

    const rq = {
      habitaciones: filters.habitaciones,
      banos: filters.banos,
      ambientes: filters.ambientes,
      fechaDisponibilidad: filters.fechaDisponibilidad,
      idLocalidad: filters.localidad?.value,
    };

    API.get("/inmueble", rq)
      .then((response) => {
        console.log(response);
        setInmuebles(response.data);
        setLoading(false);
      })
      .catch(() => { });
  }, [filters]);

  useEffect(() => {
    if (inmuebles === null) search();
  }, [inmuebles, search]);

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

  const handleHabitacionesChange = (newValue) => {
    setFilters((prevFilters) => ({ ...prevFilters, habitaciones: newValue }));
  };

  const handleBanosChange = (newValue) => {
    setFilters((prevFilters) => ({ ...prevFilters, banos: newValue }));
  };

  const handleAmbientesChange = (newValue) => {
    setFilters((prevFilters) => ({ ...prevFilters, ambientes: newValue }));
  };

  const handleFechaDisponibilidadChange = (newValue) => {
    setFilters((prevFilters) => ({ ...prevFilters, fechaDisponibilidad: newValue }));
  };

  const handleLocalidadChange = (newValue) => {
    setFilters((prevFilters) => ({ ...prevFilters, localidad: newValue }));
  };

  if (loading || !inmuebles) return <LoadingSpinner className="loading-center" />;

  return (
    <div className="inmuebles-search">
      <div className="filters-container">
        <TextBox
          containerClassName="search-control"
          type="number"
          label="Cantidad de Habitaciones"
          value={filters.habitaciones}
          onChange={handleHabitacionesChange}
        />
        <TextBox
          containerClassName="search-control"
          type="number"
          label="Cantidad de Baños"
          value={filters.banos}
          onChange={handleBanosChange}
        />
        <TextBox
          containerClassName="search-control"
          type="number"
          label="Cantidad de Ambientes"
          value={filters.ambientes}
          onChange={handleAmbientesChange}
        />
        <div className="search-control">
          <label>Fecha Disponibilidad</label>
          <DatePicker
            selected={filters.fechaDisponibilidad}
            onChange={handleFechaDisponibilidadChange}
            minDate={new Date()}
          />
        </div>
        <div className="search-control">
          <label>Localidad</label>
          <LocalidadSelect
            isClearable
            cacheOptions
            placeholder="Rosario"
            onChange={handleLocalidadChange}
            value={filters.localidad}
          />
        </div>
        <Button onClick={search}>
          Buscar
        </Button>
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
