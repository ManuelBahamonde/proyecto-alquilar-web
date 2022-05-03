import React, { useEffect, useState, useCallback } from "react";

// Hacemos una variable global para poder modificarla si se hace un logout manual y no porque se vencio el logoutTimer
let logoutTimer;

const AuthContext = React.createContext({
  token: "",
  idUsuario: "",
  nombre: "",
  email: "",
  nombreUsuario: "",
  nombreRol: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

// Helper function:
const calculateRemainingTime = (expirationTime) => {
  const currenTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currenTime;

  return remainingDuration;
};

// Helper function para recuperar el token guardado en el localstorage
const retrieveStored = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationDate = localStorage.getItem("expirationTime");
  const storedIdUsuario = localStorage.getItem("idUsuario");
  const storedNombre = localStorage.getItem("nombre");
  const storedEmail = localStorage.getItem("email");
  const storedNombreUsuario = localStorage.getItem("nombreUsuario");
  const storedNombreRol = localStorage.getItem("nombreRol");

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 60000) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    localStorage.removeItem("idUsuario");
    localStorage.removeItem("nombre");
    localStorage.removeItem("email");
    localStorage.removeItem("nombreUsuario");
    localStorage.removeItem("nombreRol");
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
    idUsuario: storedIdUsuario,
    nombre: storedNombre,
    email: storedEmail,
    nombreUsuario: storedNombreUsuario,
    nombreRol: storedNombreRol,
  };
};

export const AuthContextProvider = (props) => {
  // Guardamos el token en localStorage por lo que vamos a buscarlo para ver si lo tenemos y no se vencio.
  const storedData = retrieveStored();
  let initialToken;
  let initialIdUsuario;
  let initialNombre;
  let initialEmail;
  let initialNombreUsuario;
  let initialNombreRol;
  if (storedData) {
    initialToken = storedData.token;
    initialIdUsuario = storedData.idUsuario;
    initialNombre = storedData.nombre;
    initialEmail = storedData.email;
    initialNombreUsuario = storedData.nombreUsuario;
    initialNombreRol = storedData.nombreRol;
  }
  const [token, setToken] = useState(initialToken);
  const [idUsuario, setIdUsuario] = useState(initialIdUsuario);
  const [nombre, setNombre] = useState(initialNombre);
  const [email, setEmail] = useState(initialEmail);
  const [nombreUsuario, setNombreUsuario] = useState(initialNombreUsuario);
  const [nombreRol, setNombreRol] = useState(initialNombreRol);

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    setIdUsuario(null);
    setNombre(null);
    setEmail(null);
    setNombreUsuario(null);
    setNombreRol(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    localStorage.removeItem("idUsuario");
    localStorage.removeItem("nombre");
    localStorage.removeItem("email");
    localStorage.removeItem("nombreUsuario");
    localStorage.removeItem("nombreRol");

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (data, expirationTime) => {
    setToken(data.bearer);
    setIdUsuario(data.idUsuario);
    setNombre(data.nombre);
    setEmail(data.email);
    setNombreUsuario(data.nombreUsuario);
    setNombreRol(data.nombreRol);
    // Guardamos en localStorage el token y la fecha(con hora) de la expiración del mismo.
    localStorage.setItem("token", data.bearer);
    localStorage.setItem("expirationTime", expirationTime);
    localStorage.setItem("idUsuario", data.idUsuario);
    localStorage.setItem("nombre", data.nombre);
    localStorage.setItem("email", data.email);
    localStorage.setItem("nombreUsuario",data.nombreUsuario);
    localStorage.setItem("nombreRol", data.nombreRol);

    const remainingTime = calculateRemainingTime(expirationTime);

    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (storedData) {
      console.log(storedData.duration);
      logoutTimer = setTimeout(logoutHandler, storedData.duration);
    }
  }, [storedData, logoutHandler]);

  const contextValue = {
    token: token,
    idUsuario: idUsuario,
    nombre: nombre,
    email: email,
    nombreUsuario: nombreUsuario,
    nombreRol: nombreRol,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
