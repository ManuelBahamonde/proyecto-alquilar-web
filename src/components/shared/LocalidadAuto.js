import * as API from "api/API";
import Auto from "./Auto";

const LocalidadAuto = ({ onChange, label, value, onBlur, className, labelClassName, containerClassName, ...rest }) => {
  const loader = (input, callback) => {
    API.get("/localidad", { searchText: input })
      .then((response) => {
        const localidades = response.data.map((localidad) => ({
          value: localidad.idLocalidad,
          label: localidad.label,
        }));

        callback(localidades);
      })
      .catch(() => { });
  };

  return (
    <Auto
      {...rest}
      label={label}
      labelClassName={labelClassName}
      containerClassName={containerClassName}
      className={className || 'react-select'}
      cacheOptions
      loader={loader}
      onChange={onChange}
      value={value}
      onBlur={onBlur}
      isClearable
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

export default LocalidadAuto;
