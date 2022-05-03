import { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "components/UI/Layout";
import Home from "routes/Home";
import { Inmueble, Inmuebles } from "routes/Inmuebles/Index";
import EditarInmueble from "routes/Inmuebles/EditarInmueble";
import NuevoInmueble from "routes/Inmuebles/NuevoInmueble";
import NotFound from "components/NotFound";
import { NotificationContainer } from "react-notifications";
import AuthContext from "./Storage/auth-context";
import AuthPagina from "routes/Login/AuthPagina";
import "react-notifications/lib/notifications.css";
import Perfil from "components/Perfil/Perfil";
import VerificarInmobiliaria from "routes/VerificarInmobiliaria";

const App = () => {
  const authCtx = useContext(AuthContext);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate replace to="/home" />}/>
        <Route path="/home" element={<Home />} />
        {!authCtx.isLoggedIn && <Route path="/auth" element={<AuthPagina />} />}
        {authCtx.isLoggedIn && <Route path="/perfil" element={<Perfil />} />}
        {!authCtx.isLoggedIn && <Route path="/perfil" element={<Navigate replace to="/auth" />} />}
        <Route path="inmuebles" element={<Inmuebles />} />
        <Route path="inmuebles/:idInmueble" element={<Inmueble />} />
        <Route
          path="inmueblesEditMode/:idInmueble"
          element={<EditarInmueble />}
        />
        <Route path="nuevoInmueble" element={<NuevoInmueble />} />
        {authCtx.isLoggedIn && authCtx.nombreRol==="Administrador" && <Route path="admin/verificacion" element={<VerificarInmobiliaria />} />}
        {authCtx.isLoggedIn && !authCtx.nombreRol==="Administrador" && <Route path="admin/verificacion" element={<Navigate replace to="/home" />} />}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <NotificationContainer />
    </Layout>
  );
};
export default App;
