import React from "react";
import { Card, Col, Row, Button, Container } from "react-bootstrap";
import classes from "./NoticiaStyledCard.module.css";
import { MdEdit,MdDelete } from "react-icons/md";


const NoticiaStyledCard = ({
 noticia,
 onEdit,
 onDelete,
 btnVisibility = true,
  }) => {
    const {
     titulo,
     descripcion,
  } = noticia;
  
    return (
      <>  
        <br />                                              
        <Card >
        <div>
          <Card.Header className={classes.header}>
            <p className={classes.headerContent}>
              {titulo}
            </p> 
          </Card.Header>
          <Card.Body>
            <Container>
              <Row>
                <Col sm={10}>
                      <Row>
                        <p className={classes.tittleStyled}>
                          {descripcion}
                        </p>
                      </Row>
                </Col>
                <Col sm={2}>
                      <Row>
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
                      </Row>
                </Col>
            </Row>
            </Container>
          </Card.Body>
        </div>
      </Card>
      </>
     );
};

export default NoticiaStyledCard;