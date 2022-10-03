import React, { useEffect, useState } from "react";
import * as API from "api/API";
import NoticiaStyledCard from "components/noticias/NoticiaStyledCard";
import classes from "./NewsList.module.css";

const NewsList = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    API.get("/noticia")
      .then((response) => {
        setNews(response.data);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <p className={classes.newsListTitle}>Noticias</p>
      <div>
        {news.map((noticia) => {
          return (
            <NoticiaStyledCard
              key={noticia.idNoticia}
              noticia={noticia}
              btnVisibility={false}
            />
          );
        })}
      </div>
    </>
  );
};

export default NewsList;
