import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, HashRouter  } from "react-router-dom";
import App from "./App";
import { AuthContextProvider } from "storage/auth-context";

const Router = process.env.NODE_ENV === 'development' ? BrowserRouter : HashRouter;

ReactDOM.render(
  <AuthContextProvider>
    <Router>
      <App />
    </Router>
  </AuthContextProvider>,
  document.getElementById('root')
);

