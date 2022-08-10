import React, { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import LocalidadSelect from "components/shared/LocalidadSelect";
import TipoInmuebleSelect from "components/shared/TipoImuebleSelect";
import { BsSearch } from "react-icons/bs";

const Home = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        localidad: null,
        tipoInmueble: null,
    });

    const handleLocalidadChange = (newValue) => {
        setFilters((prevFilters) => ({ ...prevFilters, localidad: newValue }));
    };

    const tipoInmebleInputChangeHandler = (newValue) => {
        setFilters((prevFilters) => ({ ...prevFilters, tipoInmueble: newValue }));
    };

    const handleSearch = () => {
        if (filters.localidad) {
            navigate(`/inmuebles?idLocalidad=${filters.localidad.value}`);
        }
        if (filters.tipoInmueble) {
            navigate(`/inmuebles?idTipoInmueble=${filters.tipoInmueble.value}`);
        }
        if (filters.localidad && filters.tipoInmueble) {
            navigate(`/inmuebles?idLocalidad=${filters.localidad.value}&idTipoInmueble=${filters.tipoInmueble.value}`);
        }
        if (filters.localidad == null && filters.tipoInmueble == null) {
            navigate(`/inmuebles/`);
        }
    }

    return (
        <div className="home">
            <div className="integrantes">
                <Container className="searchContainer">
                    <Row>
                        <h2 className="tittle-labels">¡Bienvenidos a AlquilAr!</h2>
                    </Row>
                    <br />
                    <Row>
                        <h5 className="tittle-labels">Te ayudamos a encontrar esa propiedad que tanto necesitas</h5>
                    </Row>
                    <br />
                    <Row>
                        <Col>
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
                        </Col>
                        <Col>
                            <div className="search-control">
                                <label className="tittle-labels">Tipo</label>
                                <TipoInmuebleSelect
                                    id="tipoInmueble"
                                    placeholder="Departamento"
                                    onChange={tipoInmebleInputChangeHandler}
                                    value={filters.tipoInmueble}
                                />
                            </div>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Container>
                            <Button onClick={handleSearch}>
                                <div className="search-button">
                                    <span>
                                        Buscar <BsSearch className="icon" /> 
                                    </span>
                                </div>
                            </Button>
                        </Container>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default Home;