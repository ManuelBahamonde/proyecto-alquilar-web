import diasSemana from "consts/DiaSemana";
import Combo from "./Combo";

const items = diasSemana.map((diaSemana) => ({ value: diaSemana, label: diaSemana }));

const DiaSemanaCombo = ({ value, onChange }) => {
    return (
        <Combo
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

export default DiaSemanaCombo;