import Card from "components/UI/Card";
import FormNoticia from '../../components/noticias/FormNoticia';

const NuevaNoticia = () => {

    return (
        <>
            <p className="page-title">
                Nueva Noticia
            </p>
            <Card>
                <FormNoticia />
            </Card>
        </>
    );
}

export default NuevaNoticia;