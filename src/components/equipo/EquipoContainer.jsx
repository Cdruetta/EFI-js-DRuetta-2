import { useState, useEffect, Fragment } from 'react';
import EquipoView from './EquipoView';

const EquipoContainer = () => {
    const [dataEquipos, setDataEquipos] = useState([]);
    const [loadingEquipos, setLoadingEquipos] = useState(true);

    const token = JSON.parse(localStorage.getItem('token'));

    const getDataEquipos = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/equipos", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                console.error("Hubo un error en la petición");
                return;
            }

            const results = await response.json();
            setDataEquipos(results);
        } catch (error) {
            console.error("Hubo un error en la API", error);
        } finally {
            setLoadingEquipos(false);
        }
    };

    useEffect(() => {
        getDataEquipos();
    }, []);

    return (
        <EquipoView 
            loadingEquipos={loadingEquipos} 
            dataEquipos={dataEquipos} 
            setDataEquipos={setDataEquipos}   
        />
    );
}

export default EquipoContainer;
