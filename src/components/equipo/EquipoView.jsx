import { Fragment, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ToggleButton } from 'primereact/togglebutton';
import { Formik, Field, Form } from "formik";
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

const EquipoView = ({ loadingEquipos, dataEquipos, setLoadingEquipos, setDataEquipos}) => {
    const token = JSON.parse(localStorage.getItem('token'));
    const navigate = useNavigate(); 
    const [openDialog, setOpenDialog] = useState(false);
    const [editEquipo, setEditEquipo] = useState({});
    const [message, setMessage] = useState('');

    const bodyActions = (rowData) => {
        return (
            <div>
                <Button icon='pi pi-pencil' label='Editar' onClick={() => (setEditEquipo(rowData), setOpenDialog(true))} />
                <Button icon='pi pi-trash' label='Borrar' onClick={() => onDeleteEquipo(rowData.id)} />
            </div>
        );
    };

    const onEditEquipo = async (values) => {
        const bodyEditEquipo = {
            id: editEquipo.id,
            nombre: values.nombre,
            modelo_id: values.modelo_id,
            categoria_id: values.categoria_id,
            costo: values.costo,
            stock_id: values.stock_id,
            marca_id: values.marca_id,
            activo: 1,
        };

        const response = await fetch(`http://127.0.0.1:5000/equipos/actualizar`, {
            method: 'PUT',
            body: JSON.stringify(bodyEditEquipo),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            setMessage("Error al actualizar el equipo.");
            return;
        }

        const data = await response.json();
        console.log('Equipo actualizado:', data);
        setMessage('Equipo actualizado correctamente.');

        setDataEquipos(prevData =>
            prevData.map(equipo => equipo.id === bodyEditEquipo.id ? { ...equipo, ...bodyEditEquipo } : equipo)
        );
    };

    const onDeleteEquipo = async (id) => {
        const response = await fetch(`http://127.0.0.1:5000/equipos/eliminar`, {
            method: 'DELETE',
            body: JSON.stringify({ id }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            setMessage("Error al eliminar el equipo.");
            return;
        }

        console.log('Equipo eliminado');
        setMessage('Equipo eliminado correctamente.');
        setDataEquipos(prevData => prevData.filter(equipo => equipo.id !== id));
    };

    return (
        <Fragment>
            <div style={{ marginBottom: "1em" }}>
                {/* Botón para redirigir a la página de creación de equipo */}
                <Button label="Crear Nuevo Equipo" icon="pi pi-plus" onClick={() => navigate('/crear-equipo')} />
            </div>

            {loadingEquipos ? 
                <ProgressSpinner />
                :
                <DataTable value={dataEquipos} paginator rows={10}>
                    <Column field="id" header="ID" />
                    <Column field="nombre" header="Nombre" />
                    <Column field="modelo_id" header="Modelo ID" />
                    <Column field="categoria_id" header="Categoría ID" />
                    <Column field="costo" header="Costo" />
                    <Column field="acciones" header="Acciones" body={bodyActions} />
                </DataTable>
            }

            <Dialog
                visible={openDialog}
                onHide={() => setOpenDialog(false)}
                header="Editar Equipo"
            >
                <Formik
                    initialValues={{
                        id: editEquipo.id,
                        nombre: editEquipo.nombre || '',
                        modelo_id: editEquipo.modelo_id || '',
                        categoria_id: editEquipo.categoria_id || '',
                        costo: editEquipo.costo || '',
                        stock_id: editEquipo.stock_id || '',
                        marca_id: editEquipo.marca_id || '',
                        activo: 1,
                    }}
                    validationSchema={Yup.object().shape({
                        nombre: Yup.string().required('El nombre es obligatorio'),
                        costo: Yup.number().required('El costo es obligatorio').positive(),
                    })}
                    onSubmit={onEditEquipo}
                >
                    {() => (
                        <Form>
                            <div>
                                <label htmlFor="nombre">Nombre:</label>
                                <Field name="nombre" type="text" />
                            </div>
                            <div>
                                <label htmlFor="modelo_id">Modelo ID:</label>
                                <Field name="modelo_id" type="number" />
                            </div>
                            <div>
                                <label htmlFor="categoria_id">Categoría ID:</label>
                                <Field name="categoria_id" type="number" />
                            </div>
                            <div>
                                <label htmlFor="costo">Costo:</label>
                                <Field name="costo" type="number" />
                            </div>
                            <div>
                                <label htmlFor="stock_id">Stock ID:</label>
                                <Field name="stock_id" type="number" />
                            </div>
                            <div>
                                <label htmlFor="marca_id">Marca ID:</label>
                                <Field name="marca_id" type="number" />
                            </div>
                            <Button type="submit" label="Guardar" />
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </Fragment>
    );
};

export default EquipoView;
