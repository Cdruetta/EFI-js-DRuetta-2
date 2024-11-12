import { Fragment, useState } from "react"
import { ProgressSpinner } from "primereact/progressspinner"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ToggleButton } from 'primereact/togglebutton';
import { Formik } from "formik";
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup'

const UsersView = ({ loadingUsers, dataUsers, setDataUsers }) => {
    const token = JSON.parse(localStorage.getItem('token'))
    const [openDialogEditUser, setOpenDialogEditUser] = useState(false)
    const [editUser, setEditUser ] = useState({})
    const [message, setMessage] = useState('');

    const bodyIsAdmin = (rowData) => {
        return (
            rowData.is_admin ? <span>Si</span> : <span>No</span>
        )
    }
    const bodyActions = (rowData) => {
        return (
            <div>
                <Button icon='pi pi-pencil' label='Editar' onClick={() => (setEditUser(rowData), setOpenDialogEditUser(true))} />
                <Button icon='pi pi-trash' label='Borrar' onClick={() => (onDeletUser(rowData))} />
            </div>
        )
    }
    const ValidationSchema = Yup.object().shape({
        username: Yup.string()
            .required('Este campo es requerido')
            .max(20, 'maximo 20 caracteres'),
    })
    const onEditUser = async (values) => {
        const bodyEditUser = {
            id: editUser.id,
            usuario: values.username,
            is_admin: values.is_admin
        }

        const response = await fetch(`http://127.0.0.1:5000/user/actualizar`, {
            method: 'PUT',
            body: JSON.stringify({
                id: bodyEditUser.id,
                usuario: bodyEditUser.usuario,
                is_admin: bodyEditUser.is_admin
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if (!response.ok) {
            setMessage("Error al actualizar el usuario.");
            return;
        }
        
        const data = await response.json();
        console.log('Usuario actualizado:', data)
        setMessage('Usuario actualizado correctamente.')

        // Actualizar la lista de usuarios
        setDataUsers(prevData => {
            return prevData.map(user =>
                user.id === editUser.id ? { ...user, usuario: values.username, is_admin: values.is_admin } : user
            );
        });

        setTimeout(() => setOpenDialogEditUser(false), 1500)
    } 

    const onDeletUser = async (values) => {
        const response = await fetch(`http://127.0.0.1:5000/user/eliminar`, {
            method: 'DELETE',
            body: JSON.stringify({ id: values.id }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if (!response.ok) {
            setMessage("Error al eliminar el usuario.");
            return;
        }

        const data = await response.json();
        console.log('Usuario eliminado:', data);
        setMessage('Usuario desactivado correctamente.')

        setDataUsers(prevData => prevData.filter(user => user.id !== values.id));
    } 
    return (
        <Fragment>
            {loadingUsers ?
                <ProgressSpinner />
                :
                <DataTable value={dataUsers} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="username" header="Nombre de usuario"></Column>
                    <Column field="is_admin" body={bodyIsAdmin} header="¿Es administrador?"></Column>
                    <Column body={bodyActions} header="Acciones"></Column>
                </DataTable>
            }
            <Dialog
                visible={openDialogEditUser}
                onHide={() => setOpenDialogEditUser(false)}
                header='Editar usuario'
            >
                <Formik
                    initialValues={{ is_admin: editUser.is_admin, username: editUser.username }}
                    validationSchema={ValidationSchema}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        isSubmitting,
                        isValid
                    }) => (
                        <form style={{ display: 'inline-grid'  }}>
                            <label>
                                Nombre de usuario
                            </label>
                            <input
                                type="text"
                                name="username"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.username}
                            />
                            {errors.username && touched.username && errors.username}
                            <label>
                                Es administrador?
                            </label>
                            <ToggleButton
                                name='is_admin'
                                checked={values.is_admin}
                                onChange={handleChange}
                                onLabel="Si"
                                offLabel="No"
                            />
                            <button type="button" onClick={() => onEditUser(values)} disabled={values.password === '' || values.username === '' || !isValid}>
                                Modificar usuario
                            </button>
                        </form>
                    )}
                </Formik>

            </Dialog>
        </Fragment>
    )
}
export default UsersView