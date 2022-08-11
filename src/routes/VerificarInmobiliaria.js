import * as API from 'api/API';
import InmobiliariaItem from 'components/admin/InmobiliariaItem';
import Card from 'components/UI/Card';
import LoadingSpinner from 'components/UI/LoadingSpinner';
import React, { useCallback, useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { NotificationManager } from 'react-notifications';

const VerificarInmobiliaria = () => {
    const [loading, setLoading] = useState(false);
    const [inmobiliarias, setInmobiliarias] = useState([]);

    const refreshInmobiliarias = useCallback(() => {
        setLoading(true);
        API.get('/usuario/verificacion')
            .then((response) => {
                setInmobiliarias(response.data);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        refreshInmobiliarias();
    }, [refreshInmobiliarias]);

    const handleConfirmInmobiliaria = useCallback((idUsuario) => {
        setLoading(true);

        API.post(`/usuario/verificacion/${idUsuario}`)
            .then(() => {
                NotificationManager.success('El Usuario fue verificado correctamente!');
                refreshInmobiliarias();
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [refreshInmobiliarias]);

    const handleRejectInmobiliaria = useCallback((idUsuario) => {
        setLoading(true);

        API.post(`/usuario/rechazar/${idUsuario}`)
            .then(() => {
                NotificationManager.success('El Usuario fue rechazado correctamente!');
                refreshInmobiliarias();
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [refreshInmobiliarias]);

    const renderInmobiliarias = useCallback(() => {
        if (inmobiliarias.length === 0) return <p className="mt-5 text-center">No hay ninguna Inmobiliaria esperando a ser confirmada!</p>;

        return inmobiliarias.map((inmobiliaria) => <InmobiliariaItem inmobiliaria={inmobiliaria} onConfirm={handleConfirmInmobiliaria} onReject={handleRejectInmobiliaria} />)
    }, [inmobiliarias, handleConfirmInmobiliaria, handleRejectInmobiliaria]);

    return (
        <>

            <p className="page-title">
                Inmobiliarias por verificar
            </p>
            ;
            <Card>
                {loading
                    ? <LoadingSpinner />
                    : (
                        <Scrollbars style={{ height: 500 }}>
                            {renderInmobiliarias()}
                        </Scrollbars>
                    )}
            </Card>
        </>
    );
};

export default VerificarInmobiliaria;