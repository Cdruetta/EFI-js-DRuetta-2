import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import UserContainer from './components/users/UserContainer';
import { Menubar } from 'primereact/menubar';
import Home from './components/home';
import LoginUser from './components/users/LoginUser'; 
import Posts from './components/posts/Posts'; 
import Albums from './components/albums/Albums'; 
import CreateUser from './components/users/CreateUser';

function App() {
  const items = [
    { label: 'Home', icon: 'pi pi-home', url: '/home' },
    { label: 'Usuarios', icon: 'pi pi-users', url: '/usuarios' },
    { label: 'Posts', icon: 'pi pi-file', url: '/posts' },
    { label: 'Albums', icon: 'pi pi-images', url: '/albums' }, 
    { label: 'Nuevo Usuario', icon: 'pi pi-user-plus', url: '/nuevo-usuario' }
    
  
  ];

  return (
    <BrowserRouter>
      <Menubar model={items} className="menubar-custom" />
      <div className="content">
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/usuarios" element={<UserContainer />} />
            <Route path="/nuevo-usuario" element={<CreateUser />} />
            <Route path="/inicio-sesion" element={<LoginUser />} />
            <Route path="/posts" element={<Posts />} /> 
            <Route path="/albums" element={<Albums />} /> 
          </Routes>
        </div>
        <div className="background-image" />
      </div>
      <p className="read-the-docs">
        <h1>       DRUETTZILLA</h1>
      </p>
    </BrowserRouter>
  );
}

export default App;
