import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import API from '../../api/API';
import LoadingSpinner from "../../components/LoadingSpinner";
import InmuebleCard from "../../components/InmuebleCard";

const Inmuebles = () => {
    const navigate = useNavigate();
    
    const [inmuebles, setInmuebles] = useState(null);

    useEffect(() => {
        API.get('/inmueble')
            .then((response) => {
                setInmuebles(response.data);
            });
    }, []);

    const handleInmuebleSelected = (inmueble) => {
        navigate(`/inmuebles/${inmueble.idInmueble}`);
    };

    if (inmuebles === null) return <LoadingSpinner className="loading-center" />

    return (
        <div class="inmuebles-container">
            {inmuebles.map((inmueble) => {
                return (
                    <InmuebleCard key={inmueble.idInmueble} inmueble={inmueble} onSelect={() => handleInmuebleSelected(inmueble)} />
                )
            })}
            
            <Outlet />
        </div>
    );
};

export default Inmuebles;