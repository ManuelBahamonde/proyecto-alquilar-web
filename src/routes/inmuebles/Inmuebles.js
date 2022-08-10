import React, { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import * as API from "api/API";
import LoadingSpinner from "components/UI/LoadingSpinner";
import TextBox from "components/UI/TextBox";
import { Button, Col, Row } from "react-bootstrap";
import LocalidadSelect from "components/shared/LocalidadSelect";
import InmuebleStyledCard from "components/inmuebles/InmuebleStyledCard";
import { useSearchParams } from "react-router-dom";

const Inmuebles = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [inmuebles, setInmuebles] = useState(null);
  const [filters, setFilters] = useState({
    habitacionesMin: null,
    habitacionesMax: null,
    banosMin: null,
    banosMax: null,
    ambientesMin: null,
    ambientesMax: null,
    precioMin: null,
    precioMax: null,
    localidad: null,
    tipoInmueble: null,
  });

  const search = useCallback((overrideFilters) => {
    setLoading(true);
    const searchFilters = overrideFilters || filters;
    const rq = {
      habitacionesMin: searchFilters.habitacionesMin,
      habitacionesMax: searchFilters.habitacionesMax,
      banosMin: searchFilters.banosMin,
      banosMax: searchFilters.banosMax,
      ambientesMin: searchFilters.ambientesMin,
      ambientesMax: searchFilters.ambientesMax,
      precioMin: searchFilters.precioMin,
      precioMax: searchFilters.precioMax,
      idLocalidad: searchFilters.localidad?.value,
      idTipoInmueble: searchFilters.tipoInmueble?.value,
    };

    API.get("/inmueble", rq)
      .then((response) => {
        setInmuebles(response.data);
        setLoading(false);
      })
      .catch(() => {});
  }, [filters]);

  useEffect(() => {
    if (inmuebles === null) {
      let presetFilters = null;
      let localidadFilter = searchParams.get('idLocalidad')
      console.log(localidadFilter)
      let tipoInmuebleFilter = searchParams.get('idTipoInmueble')
      console.log(tipoInmuebleFilter)
      if (localidadFilter || tipoInmuebleFilter ){
        presetFilters = {
          localidad:  { value: localidadFilter },
          tipoInmueble: { value: tipoInmuebleFilter},
        }
      }
      search(presetFilters);
    } 
  }, [inmuebles, search, searchParams]);

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
      .catch(() => {});
  };

  const handleHabitacionesMinChange = (newValue) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      habitacionesMin: newValue,
    }));
  };
  const handleHabitacionesMaxChange = (newValue) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      habitacionesMax: newValue,
    }));
  };

  const handleBanosMinChange = (newValue) => {
    setFilters((prevFilters) => ({ ...prevFilters, banosMin: newValue }));
  };

  const handleBanosMaxChange = (newValue) => {
    setFilters((prevFilters) => ({ ...prevFilters, banosMax: newValue }));
  };

  const handleAmbientesMinChange = (newValue) => {
    setFilters((prevFilters) => ({ ...prevFilters, ambientesMin: newValue }));
  };

  const handleAmbientesMaxChange = (newValue) => {
    setFilters((prevFilters) => ({ ...prevFilters, ambientesMax: newValue }));
  };

  const handlePrecioMinChange = (newValue) => {
    setFilters((prevFilters) => ({ ...prevFilters, precioMin: newValue }));
  };

  const handlePrecioMaxChange = (newValue) => {
    setFilters((prevFilters) => ({ ...prevFilters, precioMax: newValue }));
  };

  const handleLocalidadChange = (newValue) => {
    setFilters((prevFilters) => ({ ...prevFilters, localidad: newValue }));
  };

  if (loading || !inmuebles)
    return <LoadingSpinner className="loading-center" />;

  return (
    <div>
      <Row>
        <Col md={2}>
          <p className="tittle-filter">Filtros</p>
          <div className="filters-container">
            <Row>
              <label className="tittle-labels">
                Habitaciones
              </label>
              <Col>
                <TextBox
                  containerClassName="search-control"
                  type="number"
                  value={filters.habitacionesMin}
                  onChange={handleHabitacionesMinChange}
                  placeholder={"Min"}
                />
              </Col>
              <Col>
                <TextBox
                  containerClassName="search-control"
                  type="number"
                  value={filters.habitacionesMax}
                  onChange={handleHabitacionesMaxChange}
                  placeholder={"Max"}
                />
              </Col>
            </Row>
            <br />
            <Row>
              <label className="tittle-labels">Baños</label>
              <Col>
                <TextBox
                  containerClassName="search-control"
                  type="number"
                  value={filters.banosMin}
                  onChange={handleBanosMinChange}
                  placeholder={"Min"}
                />
              </Col>
              <Col>
                <TextBox
                  containerClassName="search-control"
                  type="number"
                  value={filters.banosMax}
                  onChange={handleBanosMaxChange}
                  placeholder={"Max"}
                />
              </Col>
            </Row>
            <br />
            <Row>
              <label className="tittle-labels">Ambientes</label>
              <Col>
                <TextBox
                  containerClassName="search-control"
                  type="number"
                  value={filters.ambientesMin}
                  onChange={handleAmbientesMinChange}
                  placeholder={"Min"}
                />
              </Col>
              <Col>
                <TextBox
                  containerClassName="search-control"
                  type="number"
                  value={filters.ambientesMax}
                  onChange={handleAmbientesMaxChange}
                  placeholder={"Max"}
                />
              </Col>
            </Row>
            <br />
            <Row>
              <label className="tittle-labels">Precio</label>
              <Col>
                <TextBox
                  containerClassName="search-control"
                  type="number"
                  value={filters.precioMin}
                  onChange={handlePrecioMinChange}
                  placeholder={"Min"}
                />
              </Col>
              <Col>
                <TextBox
                  containerClassName="search-control"
                  type="number"
                  value={filters.precioMax}
                  onChange={handlePrecioMaxChange}
                  placeholder={"Max"}
                />
              </Col>
            </Row>
            <br />
            <div className="search-control">
              <label className="tittle-labels">Localidad</label>
              <LocalidadSelect
                isClearable
                cacheOptions
                placeholder="Rosario"
                onChange={handleLocalidadChange}
                value={filters.localidad}
              />
            </div>
            <br />
            <div className="button-filter" >
              <Button className="button-filter" onClick={search}>Buscar</Button>
            </div>
          </div>
        </Col>
        <Col>
          <div className="inmuebles-container">
            {inmuebles.map((inmueble) => {
              return (
                <InmuebleStyledCard
                  key={inmueble.idInmueble}
                  inmueble={inmueble}
                  onSelect={() => handleInmuebleSelected(inmueble)}
                  onEdit={() => handleInmuebleEdit(inmueble)}
                  onDelete={() => handleInmuebleDelete(inmueble)}
                  btnVisibility={false}
                />
              );
            })}

            <Outlet />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Inmuebles;
