import _ from "lodash";
import { useCallback, useState } from "react";
import AsyncSelect from "react-select/async";

const Auto = ({ loader, required, onChange, validate, invalidText, label, value, className, labelClassName, containerClassName, ...rest }) => {
  const [isValueValid, setisValueValid] = useState(true);

  const handleBlur = useCallback(() => {
    if (validate) {
      setisValueValid(validate(value));
    }
  }, [validate, value]);

  const handleChange = useCallback((newValue) => {
    if (!isValueValid) setisValueValid(true);

    onChange(newValue);
  }, [isValueValid, onChange]);

  const loadOptions = _.debounce(loader, 1000);

  let containerClassNames = 'alquilar-control';
  if (containerClassName) containerClassNames += ` ${containerClassName}`;
  if (!isValueValid) containerClassNames += ` invalid`;

  return (
    <div className={containerClassNames}>
      <label className={labelClassName || 'react-select-label'}>
        {label}
        {' '}
        {required && <span className="required-marker">*</span>}
      </label>
      <AsyncSelect
        {...rest}
        className={className || 'react-select'}
        cacheOptions
        loadOptions={loadOptions}
        onChange={handleChange}
        value={value}
        onBlur={handleBlur}
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
      {!isValueValid && (
        <p>{invalidText}</p>
      )}
    </div>
  )
};

export default Auto;
