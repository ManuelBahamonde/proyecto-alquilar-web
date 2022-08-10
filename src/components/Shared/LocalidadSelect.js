import * as API from "api/API";
import _ from "lodash";
import AsyncSelect from "react-select/async";

const LocalidadSelect = ({ onChange, label, value, onBlur, className, labelClassName, containerClassName, ...rest }) => {
  const loadOptions = _.debounce((input, callback) => {
    API.get("/localidad", { searchText: input })
      .then((response) => {
        const localidades = response.data.map((localidad) => ({
          value: localidad.idLocalidad,
          label: localidad.label,
        }));

        callback(localidades);
      })
      .catch(() => { });
  }, 1000);

  return (
    <div className={containerClassName}>
      <label className={labelClassName || 'react-select-label'}>
        {label}
      </label>
      <AsyncSelect
        {...rest}
        className={className || 'react-select'}
        cacheOptions
        loadOptions={loadOptions}
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
    </div>
  )
};

export default LocalidadSelect;
