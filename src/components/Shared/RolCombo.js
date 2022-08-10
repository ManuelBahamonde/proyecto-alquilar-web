import * as API from "api/API";
import { useEffect, useState } from "react";
import Combo from "./Combo";

const RolCombo = ({ id, onChange, label, value, onBlur, className, labelClassName, containerClassName, ...rest }) => {
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
        <Combo
            {...rest}
            id={id}
            label={label}
            labelClassName={labelClassName}
            containerClassName={containerClassName}
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
    )
};

export default RolCombo;
