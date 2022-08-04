import TextBox from "components/UI/TextBox";
import * as DiaSemana from "consts/DiaSemana";
import { useCallback } from "react";
import { Button, Col, Form } from "react-bootstrap";
import Horario from "./Horario";

const SetupHorariosDisponiblesControl = ({ duracionTurno, horarios, onChange }) => {
    const handleAddNewHorario = useCallback(() => {
        const newHorarios = [
            ...horarios,
            {
                diaSemana: {
                    value: DiaSemana.DOMINGO,
                    label: DiaSemana.DOMINGO
                },
                horaInicio: null,
                horaFin: null,
            },
        ];

        onChange({
            horarios: newHorarios,
            duracionTurno
        });
    }, [horarios, duracionTurno, onChange]);

    const handleHorarioChange = useCallback((index, updatedHorario) => {
        const newHorarios = [...horarios];
        newHorarios[index] = updatedHorario;

        onChange({
            horarios: newHorarios,
            duracionTurno
        });
    }, [horarios, duracionTurno, onChange]);

    const handleHorarioDelete = useCallback((index) => {        
        const newHorarios = horarios.filter((_, i) => index !== i);

        onChange({
            horarios: newHorarios,
            duracionTurno
        });
    }, [horarios, duracionTurno, onChange]);

    const handleDuracionTurnoChange = useCallback((newDuracionTurno) => {
        // If DuracionTurno changes, we must modify horaInicio and horaFin of every horario to avoid weird values
        const newHorarios = horarios.map((horario) => ({
            ...horario,
            horaInicio: null,
            horaFin: null,
        }));

        onChange({
            horarios: newHorarios,
            duracionTurno: newDuracionTurno,
        });
    }, [horarios, onChange]);

    const renderHorarios = useCallback(() => {
        if (horarios.length === 0) {
            return <p>No hay Horarios cargados</p>;
        }

        return horarios.map((horario, index) => {
            const {
                diaSemana,
                horaInicio,
                horaFin
            } = horario;

            return (
                <Horario
                    key={index}
                    id={index}
                    onDelete={handleHorarioDelete}
                    onChange={handleHorarioChange}
                    duracionTurno={duracionTurno}
                    diaSemana={diaSemana}
                    horaInicio={horaInicio}
                    horaFin={horaFin}
                />
            );
        });
    }, [horarios, duracionTurno, handleHorarioChange, handleHorarioDelete]);

    return (
        <div className="horarios-disponibles-container">
            <Form.Group as={Col}>
                <TextBox
                    containerClassName="search-control"
                    type="number"
                    label="Duracion Turno (minutos)"
                    value={duracionTurno}
                    onChange={handleDuracionTurnoChange}
                />
            </Form.Group>
            {renderHorarios()}
            <Button variant="info" onClick={handleAddNewHorario}>Agregar nuevo Horario</Button>
        </div>
    );
};

export default SetupHorariosDisponiblesControl;