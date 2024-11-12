import { useState } from 'react'
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UsersContainer from './components/users/UserContainer';
import { Menubar } from 'primereact/menubar';
import Home from './components/home';
import LoginUser from './components/users/LoginUser'; 
import CreateUser from './components/users/CreateUser';
import EquipoContainer from './components/Equipo/EquipoContainer';

function App() {
    const [count, setCount] = useState(0)

  const items = [
    { label: 'Home', icon: 'pi pi-home', url: '/home' },
    { label: 'Iniciar Sesión', icon: 'pi pi-sign-in', url: '/inicio-sesion' },
    { label: 'Usuarios', icon: 'pi pi-users', url: '/usuarios' },
    { label: 'Nuevo Usuario', icon: 'pi pi-user-plus', url: '/nuevo-usuario' },
    { label: 'Equipo', icon: 'pi pi-mobile', url: '/equipos' },
  ]

  return (
    <BrowserRouter>
      <Menubar model={items} />
      <Routes>
        <Route path='/usuarios' element={<UsersContainer />} />
        <Route path='/nuevo-usuario' element={<CreateUser />} />
        <Route path='/inicio-sesion' element={<LoginUser />} />
        <Route path='/equipos' element={<EquipoContainer/>} />
        <Route path='/' element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
