import { useCallback, useState } from 'react';
import Select from 'react-select';

const Combo = ({ id, required, options, onChange, validate, invalidText, label, value, className, labelClassName, containerClassName, ...rest }) => {
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
    

    let containerClassNames = 'alquilar-control';
    if (containerClassName) containerClassNames += ` ${containerClassName}`;
    if (!isValueValid) containerClassNames += ` invalid`;

    return (
        <div className={containerClassNames}>
            <label htmlFor={id} className={labelClassName || 'react-select-label'}>
                {label}
                {' '}
                {required && <span className="required-marker">*</span>}
            </label>
            <Select
                {...rest}
                id={id}
                classNamePrefix="select"
                isClearable
                isSearchable
                required
                options={options}
                onChange={handleChange}
                value={value}
                onBlur={handleBlur}
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

export default Combo;