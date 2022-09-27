import Card from "components/UI/Card";
import { useParams } from 'react-router';
import FormNoticia from "../../components/noticias/FormNoticia";

const EditarNoticia = () => {
    const params = useParams();
    const { idNoticia } = params;
    return (
        <>
            <p className="page-title">
                Editar Noticia
            </p>
            <Card>
                <FormNoticia idNoticia={idNoticia} />
            </Card>
        </>
    );
}

export default EditarNoticia;