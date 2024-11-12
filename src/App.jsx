import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserContainer from './components/users/UserContainer';
import { Menubar } from 'primereact/menubar';
import CreateUser from './components/users/CreateUser';
import Home from './components/home';
import LoginUser from './components/users/LoginUser'; 
import EquipoView from './components/equipo/EquipoView';
import CreateEquipo from './components/equipo/CreateEquipo';
import EquipoContainer from './components/equipo/EquipoContainer';

function App() {
  const items = [
    { label: 'Home', icon: 'pi pi-home', url: '/home' },
    { label: 'Inicio Sesion', icon: 'pi pi-sign-in', url: '/inicio-sesion' },
    { label: 'Usuarios', icon: 'pi pi-users', url: '/usuarios' },
    { label: 'Nuevo Usuario', icon: 'pi pi-user-plus', url: '/nuevo-usuario' },    
    {label: 'Equipos', icon:'pi pi-mobile', url:'/equipos'},
    { label: '', icon:'', url:'/nuevo-equipo'},
  ];

  return (
    <BrowserRouter>
      <Menubar model={items} className="menubar-custom" />
      <h1>Octavio - Cristian</h1>
      <h3>EFI Java Script</h3>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inicio-sesion" element={<LoginUser />} />
            <Route path="/nuevo-usuario" element={<CreateUser />} />
            <Route path="/usuarios" element={<UserContainer />} />
            <Route path="/equipos" element={<EquipoContainer />} />
            <Route path="/crear-equipo" element={<CreateEquipo />} />
          </Routes>
        
       {/* Footer */}
        <footer className="footer">
          <p>© 2024 Proyecto Final - Consumo de API - venta de celulares - Todos los derechos reservados.</p>
        </footer>
      
    </BrowserRouter>
  );
}
export default App;