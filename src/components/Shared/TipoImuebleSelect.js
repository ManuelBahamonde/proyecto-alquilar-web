import * as API from "api/API";
import { useEffect, useState } from "react";
import _ from "lodash";
import Select from "react-select";

const TipoInmuebleSelect = ({ id, onChange, label, value, onBlur, className, labelClassName, containerClassName, ...rest }) => {
  const [posiblesTiposInmuebles, setPosiblesTiposInmuebles] = useState([]);

  useEffect(() => {
    // Nos traemos los posibles tipos de inmueble
    API.get("/tipoInmueble")
      .then((response) => {
        const tiposInmueble = response.data.map((tipoInmueble) => ({
          value: tipoInmueble.idTipoInmueble,
          label: tipoInmueble.nombre,
        }));

        console.log(tiposInmueble)
        setPosiblesTiposInmuebles(tiposInmueble);
      });
  }, []);

  return (
    <div className={containerClassName}>
      <label htmlFor={id} className={labelClassName || 'react-select-label'}>
        {label}
      </label>
      <Select
        className={className || 'react-select'}
        classNamePrefix="select"
        isSearchable={true}
        name="tipoInmueble"
        options={posiblesTiposInmuebles}
        onChange={onChange}
        value={value}
        onBlur={onBlur}
        styles={{
          option: (provided, state) => {
              return {
                  ...provided,
                  color: "black",
              }
          }
      }}
      />
    </div>
  )
};

export default TipoInmuebleSelect;
