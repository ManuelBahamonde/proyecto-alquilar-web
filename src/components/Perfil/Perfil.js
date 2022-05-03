import { useContext } from "react";
import AuthContext from "Storage/auth-context";

const Perfil = () => {
  const authCtx = useContext(AuthContext);
  return <h1>Bienvenido a tu perfil {authCtx.nombre} sos un usuario del tipo {authCtx.nombreRol}</h1>;
};
export default Perfil;
