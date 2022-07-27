import { useEffect, useState } from "react";


const TextBox = ({ label, value, onChange, validate, invalidText, containerClassName, inputClassName, ...rest }) => {
    const [isValueValid, setisValueValid] = useState(true);

    useEffect(() => {
        if (validate) {
            setisValueValid(validate(value));
        }
    }, [value, validate]);

    const handleChange = (e) => {
        const newValue = e.target.value;

        onChange(newValue);
    };

    return (
        <div className={containerClassName}>
            <label>{label}</label>
            <input
                {...rest}
                className={inputClassName}
                type={rest.type || 'text'}
                onChange={handleChange}
                value={value}
            />
            {!isValueValid && (
                <p>{invalidText}</p>
            )}
        </div>
    )
};

export default TextBox;