import React, { useState, useEffect, useCallback, } from "react";
import LoadingSpinner from "components/UI/LoadingSpinner";
import * as API from "api/API";
import { NotificationManager } from "react-notifications";
import {  Outlet, useNavigate } from "react-router";
import NoticiaStyledCard from "components/noticias/NoticiaStyledCard";

const Noticias = ({ idNoticia }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [noticias, setNoticias] = useState(null);

    const handleNoticiaEdit = (noticia) => {
        navigate(`/noticiaEditMode/${noticia.idNoticia}`);
    };
    
    const handleNoticiaDelete = (noticia) => {
        setLoading(true);
      
        API.del(`/noticia/${noticia.idNoticia}`)
          .then(() => {
            NotificationManager.success('La noticia fue eliminada correctamente!');
            getNoticias();
          })
          .catch(() => { });
    };

    const getNoticias = useCallback(() => {
      setLoading(true);
      
      API.get("/noticia").then((response) => {
        setNoticias(response.data)
        setLoading(false);
      })
    }, []);

    useEffect(() => {
      getNoticias();
      },[getNoticias]);

    if (loading || !noticias) return <LoadingSpinner className="loading-center" />;

return(
    <>
    {loading ? (
      <div className="centered">
        <LoadingSpinner />
      </div>
    ) : (
      <div>
           <p className="page-title">
             Noticias
           </p>
           <div className="noticias-container">
      {noticias.map((noticia) => {
        return (
          <NoticiaStyledCard
            key={noticia.idNoticia}
            noticia={noticia}
            onEdit={() => handleNoticiaEdit(noticia)}
            onDelete={() => handleNoticiaDelete(noticia)}
          />
        );
      })}
       <Outlet /> 
    </div>
      </div>
    )}
  </>
);
};
export default Noticias;