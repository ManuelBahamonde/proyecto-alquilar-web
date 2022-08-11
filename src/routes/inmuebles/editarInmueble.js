import FormInmueble from 'components/inmuebles/FormInmueble'
import Card from "components/UI/Card";
import { useParams } from 'react-router';

const EditarInmueble = () => {
    const params = useParams();
    const { idInmueble } = params;
    return (
        <>
            <p className="page-title">
                Editar Inmueble
            </p>
            <Card>
                <FormInmueble idInmueble={idInmueble} />
            </Card>
        </>
    );
}

export default EditarInmueble;