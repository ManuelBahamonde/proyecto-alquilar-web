import FormInmueble from 'components/Inmuebles/FormInmueble'
import Card from "components/UI/Card";
import { useParams } from 'react-router';

const EditarInmueble = () => {
    const params = useParams();
    const {idInmueble} = params;
    return (
        <Card>
            <FormInmueble idInmueble={idInmueble} />
        </Card>
    );
}

export default EditarInmueble;