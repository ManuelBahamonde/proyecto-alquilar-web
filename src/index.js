import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Home from './routes/Home';
import { Inmuebles, Inmueble } from './routes/inmuebles';
import NotFound from './components/NotFound';
import NuevoInmueble from './routes/inmuebles/nuevoInmueble';
import EditarInmueble from 'routes/inmuebles/editarInmueble';

// React Notifications
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="inmuebles" element={<Inmuebles />} />
          <Route path="inmuebles/:idInmueble" element={<Inmueble />} />
          <Route path="inmueblesEditMode/:idInmueble" element={<EditarInmueble />} />
          <Route path="nuevoInmueble" element={<NuevoInmueble />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>

    <NotificationContainer />
  </React.StrictMode>,
  document.getElementById('root')
);
