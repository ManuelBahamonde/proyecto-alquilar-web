import API from 'api/API';
import React, { useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import diasSemana from 'consts/DiaSemana';

import 'react-datepicker/dist/react-datepicker.css';

const TurnosForm = ({ idInmueble }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [offeredHorarios, setOfferedHorarios] = useState([]);
    const [reservedDates, setReservedDates] = useState([]);
    const [currentHorario, setCurrentHorario] = useState(null);

    useEffect(() => {
        API.get(`horario/${idInmueble}`)
            .then((response) => {
                const { horarios, fechasReservadas } = response.data;
                const formattedHorarios = horarios.map((h) => ({
                    ...h,
                    horaInicio: new Date(h.horaInicio),
                    horaFin: new Date(h.horaFin),
                }));
                const formattedFechasReservadas = fechasReservadas.map((fr) => new Date(fr));

                setOfferedHorarios(formattedHorarios);
                setReservedDates(formattedFechasReservadas);
            })
    }, [idInmueble]);

    const handleSelectedDateChange = useCallback((newDate) => {
        console.log(newDate);
        const newDiaSemana = diasSemana[newDate.getDay()];

        setSelectedDate(newDate);
        setCurrentHorario(offeredHorarios.find((h) => h.diaSemana === newDiaSemana) || null);
    }, [offeredHorarios]);

    const shouldDateBeSelectable = useCallback((date) => {
        // Filtering dates so we only show the ones that are included in offeredHorarios
        const dateDiaSemana = diasSemana[date.getDay()];

        return offeredHorarios.some(h => h.diaSemana === dateDiaSemana);
    }, [offeredHorarios]);

    const shouldTimeBeSelectable = useCallback((dateTime) => {
        // Filtering times so we only show the ones that are not reserved yet
        return !reservedDates.some(rd => new Date(rd).getTime() === dateTime.getTime());
    }, [reservedDates]);

    return (
        <>
            <Row>
                <Col>
                    <h3>Te interesa? Reserva un turno para verlo!</h3>
                </Col>
            </Row>
            <Row>
                <Col>
                    <DatePicker 
                        selected={selectedDate}
                        onChange={handleSelectedDateChange}
                        showTimeSelect
                        inline
                        filterDate={shouldDateBeSelectable}
                        filterTime={shouldTimeBeSelectable}
                        minTime={currentHorario?.horaInicio}
                        maxTime={currentHorario?.horaFin}
                    />
                </Col>
            </Row>
        </>
    )
};

export default TurnosForm;