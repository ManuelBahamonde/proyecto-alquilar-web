import React from "react";
import { Card, Col, Row, Button } from "react-bootstrap";

const InmuebleCard = ({ inmueble, onSelect, onEdit, onDelete }) => {
  const {
    direccion,
    nombreVendedor,
    nombreTipoInmueble,
    ubicacion,
    urlImagenPresentacion,
    precio,
  } = inmueble;

  return (
    <Card className="inmueble-card">
      <div onClick={onSelect}>
        <Card.Img
          variant="top"
          src={urlImagenPresentacion}
          width={100}
          height={100}
        />
        <Card.Body>
          <Card.Title>
            {nombreTipoInmueble} en {ubicacion}
          </Card.Title>
          <Row>
            <Col>
              <Card.Text>{direccion}</Card.Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card.Text>{nombreVendedor}</Card.Text>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          <Card.Text>$ {precio}</Card.Text>
        </Card.Footer>
      </div>
      <Button variant="secondary" onClick={onEdit}>E D I T A R</Button>
      <Button variant="danger" onClick={onDelete}>B O R R A R</Button>
    </Card>
  );
};

export default InmuebleCard;
