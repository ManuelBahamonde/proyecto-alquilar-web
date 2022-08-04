import diasSemana from "consts/DiaSemana";
import Select from "react-select";

const items = diasSemana.map((diaSemana) => ({ value: diaSemana, label: diaSemana }));

const DiaSemanaSelect = ({ value, onChange }) => {
    return (
        <Select
            classNamePrefix="select"
            isSearchable={true}
            name="Dia Semana"
            required
            options={items}
            onChange={onChange}
            value={value}
            styles={{
                option: (provided, state) => {
                    return {
                        ...provided,
                        color: "black",
                    }
                }
            }}
        />
    );
};

export default DiaSemanaSelect;