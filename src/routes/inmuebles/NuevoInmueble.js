import FormInmueble from 'components/inmuebles/FormInmueble'
import Card from "components/UI/Card";

const NuevoInmueble = () => {

    return (
        <>
            <p className="page-title">
                Nuevo Inmueble
            </p>
            <Card>
                <FormInmueble />
            </Card>
        </>
    );
}

export default NuevoInmueble;