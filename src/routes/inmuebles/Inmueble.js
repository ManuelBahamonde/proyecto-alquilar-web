import React, { useEffect, useState } from "react";
import { Badge, Card, Col, Row } from "react-bootstrap";
import ImageGallery from 'react-image-gallery';
import { useParams } from "react-router";
import API from "../../api/API";
import LoadingSpinner from "../../components/LoadingSpinner";
import months from "../../temp/Months";

const Inmueble = () => {
    const { idInmueble } = useParams();
    const [inmuebleInfo, setInmuebleInfo] = useState(null);

    useEffect(() => {
        API.get(`/inmueble/${idInmueble}`)
            .then((response) => {
                setInmuebleInfo(response.data);
            });
    }, [idInmueble]);

    const getFormattedImages = (images) => {
        return images.map((image) => ({
            original: image.url,
            originalWidth: 500,
            originalHeight: 500,
        }));
    };

    const renderEstado = (fechaHastaAlquilada) => {
        if (fechaHastaAlquilada) {
            const date = new Date(fechaHastaAlquilada);
            const formattedDate = `${date.getDate()} de ${months[date.getMonth()]} del ${date.getFullYear()}`;
            return (
                <>
                    <Badge bg="danger">ALQUILADO</Badge>
                    <br />
                    hasta el {formattedDate}
                </>
            );
        }

        return <Badge bg="success">LIBRE</Badge>;
    };

    if (inmuebleInfo === null) return <LoadingSpinner className="loading-center" />

    const {
        direccion,
        piso,
        departamento,
        precio,
        habitaciones,
        baños,
        ambientes,
        fechaHastaAlquilada,
        imagenes,
        nombreTipoInmueble,
        nombreVendedor,
        emailVendedor,
        telefonoVendedor,
    } = inmuebleInfo;

    console.log(imagenes);

    return (
        <div className="inmueble-summary p-3">
            <Row>
                <Col>
                    <p className="title">{nombreTipoInmueble} en venta</p>
                </Col>
            </Row>
            <Row>
                <Col md={8}>
                    <ImageGallery items={getFormattedImages(imagenes)} showPlayButton={false} showFullscreenButton={false} />
                </Col>
                <Col md={4}>
                    <Row className="mb-3">
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Contacto</Card.Title>
                                    <Card.Text>{nombreVendedor}</Card.Text>
                                    <Card.Text><a href={`mailto:${emailVendedor}`}>Enviar un correo</a></Card.Text>
                                    <Card.Text>Teléfono: {telefonoVendedor}</Card.Text>
                                </Card.Body>
                                <Card.Footer className="precio">
                                    <Card.Text>$ {precio}</Card.Text>
                                </Card.Footer>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Descripción de la propiedad</Card.Title>
                                    <Card.Text>Direccion: {direccion} </Card.Text>
                                    {piso && <Card.Text>Piso: {piso}</Card.Text>}
                                    {departamento && <Card.Text>Departamento: {departamento} </Card.Text>}
                                    {habitaciones && <Card.Text>Cantidad de habitaciones: {habitaciones}</Card.Text>}
                                    {baños && <Card.Text>Cantidad de baños: {baños}</Card.Text>}
                                    {ambientes && <Card.Text>Cantidad de ambientes: {ambientes}</Card.Text>}
                                </Card.Body>
                                <Card.Footer>
                                    <Card.Text>{renderEstado(fechaHastaAlquilada)}</Card.Text>
                                </Card.Footer>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
};

export default Inmueble;