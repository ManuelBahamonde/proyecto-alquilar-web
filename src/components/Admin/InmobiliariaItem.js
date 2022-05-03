import Card from 'components/UI/Card';
import React, { useCallback } from 'react';
import { Button, Col, Row } from 'react-bootstrap';

const InmobiliariaItem = ({ inmobiliaria: { idUsuario, nombre, email, direccion }, onConfirm, onReject }) => {
    const handleConfirm = useCallback(() => {
        onConfirm(idUsuario);
    }, [idUsuario, onConfirm]);

    const handleReject = useCallback(() => {
        onReject(idUsuario);
    }, [idUsuario, onReject]);

    return (
        <Card>
            <Row>
                <Col>
                    <Row>
                        <Col>
                            <h4 className="mb-3">{nombre}</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p>{email}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p>{direccion}</p>
                        </Col>
                    </Row>
                </Col>
                <Col className="flex-grow-0 d-flex flex-column justify-content-around">
                    <Button variant="success" onClick={handleConfirm}>Confirmar</Button>
                    <Button variant="danger" onClick={handleReject}>Rechazar</Button>
                </Col>
            </Row>
        </Card>
    )
};

export default InmobiliariaItem;