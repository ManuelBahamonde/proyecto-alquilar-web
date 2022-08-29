import * as API from "api/API";
import { useEffect, useState } from "react";
import Combo from "./Combo";

const TipoInmuebleCombo = ({ id, onChange, label, value, onBlur, className, labelClassName, containerClassName, ...rest }) => {
  const [posiblesTiposInmuebles, setPosiblesTiposInmuebles] = useState([]);

  useEffect(() => {
    API.get("/tipoInmueble")
      .then((response) => {
        const tiposInmueble = response.data.map((tipoInmueble) => ({
          value: tipoInmueble.idTipoInmueble,
          label: tipoInmueble.nombre,
        }));

        setPosiblesTiposInmuebles(tiposInmueble);
      });
  }, []);

  return (
    <Combo
      {...rest}
      label={label}
      labelClassName={labelClassName}
      containerClassName={containerClassName}
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
  )
};

export default TipoInmuebleCombo;
