import React from "react";
import { Card, Col, Row, Button, Container } from "react-bootstrap";
import { MdOutlineBathtub,MdBed } from "react-icons/md"; 
import { MdEdit,MdDelete } from "react-icons/md";
import classes from "./InmuebleStyledCard.module.css";

const InmuebleStyledCard = ({
  inmueble,
  onSelect,
  onEdit,
  onDelete,
  btnVisibility = true,
}) => {
  const {
    direccion,
    nombreVendedor,
    nombreTipoInmueble,
    ubicacion,
    urlImagenPresentacion,
    precio,
    baños,
    ambientes,
  } = inmueble;

  return (
    <Card className="inmueble-card" onClick={onSelect}>
      <div>
        <Card.Body>
          <Container>
            <Row>
              <Col sm={4}>
                <Card.Img
                  variant="top"
                  src={urlImagenPresentacion}
                  width={250}
                  height={250}
                />
              </Col>
              <Col sm={6}>
                <Row>
                  <p className={classes.tittleStyled}>
                    {nombreTipoInmueble} en {direccion}
                  </p>
                </Row>
                <Row>
                  <p className={classes.priceStyled}>$ {precio}</p>
                </Row>
                <Row>
                  <p className={classes.locationStyled}>{ubicacion}</p>
                </Row>
                <Row>
                  <span className={classes.features}>
                  <MdBed /> {ambientes} ambientes
                  </span>
                  <span className={classes.features}>
                  <MdOutlineBathtub /> {baños} baños
                  </span>
                </Row>
                <br />
                <Row>
                  <p className={classes.seller}>{nombreVendedor}</p>
                </Row>
              </Col>
              <Col sm={2}>
              {btnVisibility && (
                  <>
                    <Button className={classes.buttonStyled} variant="secondary" onClick={onEdit}>
                      <MdEdit />
                    </Button>
                    <Button className={classes.buttonStyled} variant="danger" onClick={onDelete}>
                      <MdDelete />
                    </Button>
                  </>
                )}
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </div>
    </Card>
  );
};

export default InmuebleStyledCard;
