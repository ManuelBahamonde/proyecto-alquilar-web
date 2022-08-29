import DiaSemanaSelect from "components/shared/DiaSemanaCombo";
import Card from "components/UI/Card";
import { useCallback, useMemo } from "react";
import DatePicker from "react-datepicker";
import { BsTrash } from "react-icons/bs";

const Horario = ({ id, diaSemana, horaInicio, horaFin, duracionTurno, onChange, onDelete }) => {
    const parsedDuracionTurno = useMemo(() => {
        return +duracionTurno || 0;
    }, [duracionTurno]);

    const handleDiaSemanaChange = useCallback((newDiaSemana) => {
        onChange(id, {
            diaSemana: newDiaSemana,
            horaInicio,
            horaFin,
        });
    }, [id, horaInicio, horaFin, onChange]);

    const handleHoraInicioChange = useCallback((newHoraInicio) => {
        onChange(id, {
            diaSemana,
            horaInicio: newHoraInicio,
            horaFin,
        });
    }, [id, diaSemana, horaFin, onChange]);

    const handleHoraFinChange = useCallback((newHoraFin) => {
        onChange(id, {
            diaSemana,
            horaInicio,
            horaFin: newHoraFin,
        });
    }, [id, diaSemana, horaInicio, onChange]);

    const handleDeleteHorario = useCallback(() => {
        onDelete(id);
    }, [id, onDelete]);

    return (
        <Card className="horario-card">
            <div className="alquilar-control">
                <label>Dia Semana</label>
                <DiaSemanaSelect value={diaSemana} onChange={handleDiaSemanaChange} />
            </div>
            {parsedDuracionTurno > 0 && (
                <>
                    <div className="alquilar-control">
                        <label>Hora Inicio</label>
                        <DatePicker
                            dateFormat="hh:mm a"
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={parsedDuracionTurno}
                            selected={horaInicio}
                            onChange={handleHoraInicioChange}
                        />
                    </div>
                    <div className="alquilar-control">
                        <label>Hora Fin</label>
                        <DatePicker
                            dateFormat="hh:mm a"
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={parsedDuracionTurno}
                            selected={horaFin}
                            onChange={handleHoraFinChange}
                            minDate={horaInicio}
                        />
                    </div>
                </>
            )}
            <BsTrash className="horario-delete-icon" onClick={handleDeleteHorario} />
        </Card>
    );
};

export default Horario;