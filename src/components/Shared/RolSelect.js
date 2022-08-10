import * as API from "api/API";
import { useEffect, useState } from "react";
import Select from "react-select";

const RolSelect = ({ id, onChange, label, value, onBlur, className, labelClassName, containerClassName, ...rest }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        API.get("/rol/GetRolesPosiblesParaRegistro")
            .then((response) => {
                const roles = response.data.map((rol) => ({
                    value: rol.idRol,
                    label: rol.descripcion,
                }));

                setItems(roles);
            })
            .catch(() => { });
    }, []);

    return (
        <div className={containerClassName}>
            <label htmlFor={id} className={labelClassName || 'react-select-label'}>
                {label}
            </label>
            <Select
                id={id}
                classNamePrefix="select"
                isClearable
                isSearchable
                required
                options={items}
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

export default RolSelect;
