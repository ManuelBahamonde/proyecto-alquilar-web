import API from 'api/API';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import diasSemana from 'consts/DiaSemana';

import 'react-datepicker/dist/react-datepicker.css';
import { NotificationManager } from 'react-notifications';
import LoadingSpinner from 'components/UI/LoadingSpinner';
import months from 'temp/Months';

const TurnosForm = ({ idInmueble }) => {
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [offeredHorarios, setOfferedHorarios] = useState([]);
    const [reservedDates, setReservedDates] = useState([]);
    const [currentHorario, setCurrentHorario] = useState(null);

    const getHorarios = useCallback(() => {
        setLoading(true);

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
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [idInmueble]);

    useEffect(() => {
        getHorarios();
    }, [idInmueble, getHorarios]);

    const handleSelectedDateChange = useCallback((newDate) => {
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

    const handleReservar = useCallback(() => {
        if (!selectedDate) NotificationManager.error('Debes seleccionar una fecha disponible!');

        setLoading(true);

        const formattedFecha = selectedDate;
        formattedFecha.setMinutes(formattedFecha.getMinutes() - formattedFecha.getTimezoneOffset()); // non UTC fix

        const rq = {
            idUsuario: 4, // TODO: get it from token
            idInmueble: idInmueble,
            fecha: formattedFecha,
        };

        API.post('turnoAsignado', rq)
            .then(() => {
                NotificationManager.success("El inmueble fue creado correctamente.");
                setSelectedDate(null);
                setCurrentHorario(null);
                getHorarios();
            })
            .catch(() => {})
            .finally(() => setLoading(false));

    }, [selectedDate, idInmueble, getHorarios]);

    if (loading) return <LoadingSpinner />

    const now = new Date();
    const formattedSelectedDate = selectedDate 
        ? `${selectedDate.getDate()} de ${months[selectedDate.getMonth()]} del ${selectedDate.getFullYear()} a las ${selectedDate.toTimeString().substring(0, 5)} horas`
        : null;

    return (
        <>
            <Row>
                <Col>
                    <h3>Te interesa? Reserva un turno para verlo!</h3>
                </Col>
            </Row>
            <Row>
                <Col>
                    <b>{formattedSelectedDate}</b>
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
                        minDate={now}
                        minTime={currentHorario?.horaInicio}
                        maxTime={currentHorario?.horaFin}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button variant="primary" onClick={handleReservar}>
                        Reservar
                    </Button>
                </Col>
            </Row>
        </>
    )
};

export default TurnosForm;