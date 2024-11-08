import { Fragment, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from "primereact/dialog";
import { ToggleButton } from 'primereact/togglebutton';
import { Formik } from "formik";
import * as Yup from 'yup';

const UsersView = ({ data, loadingData }) => {
    const token = JSON.parse(localStorage.getItem('token'));

    const [openDialogEditUser, setOpenDialogEditUser] = useState(false);
    const [editUser, setEditUser] = useState({});
    
    const bodyIsAdmin = (rowData) => {
        return (
            rowData.is_admin ? <span>Si</span> : <span>No</span>
        );
    };

    const bodyActions = (rowData) => {
        return (
            <div>
                <Button icon='pi pi-pencil' label='Editar' onClick={() => (setEditUser(rowData), setOpenDialogEditUser(true))} />
                <Button icon='pi pi-trash' label='Borrar' onClick={() => onDeleteUser(rowData)} />
            </div>
        );
    };

    const ValidationSchema = Yup.object().shape({
        username: Yup.string()
            .required('Este campo es requerido')
            .max(50, 'El username no debe ser mayor a 50 caracteres'),
    });

    const onEditUser = async (values) => {
        const bodyEditUser = {
            username: values.username,
            is_admin: values.is_admin
        };

        const response = await fetch(`http://127.0.0.1:5000/users/${editUser.id}`, {
            method: 'PUT',
            body: JSON.stringify(bodyEditUser),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            setOpenDialogEditUser(false);
            console.log("Usuario modificado");
            // Aquí puedes actualizar la lista de usuarios, si es necesario
        }
    };

    const onDeleteUser = async (rowData) => {
        const response = await fetch(`http://127.0.0.1:5000/users/${rowData.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            console.log("Usuario eliminado");
            // Aquí puedes actualizar la lista de usuarios, si es necesario
        }
    };

    return (
        <Fragment>
            <h1>Usuarios</h1>
            {loadingData ? (
                <ProgressSpinner />
            ) : (
                <DataTable value={data} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="username" header="Nombre de usuario"></Column>
                    <Column field="is_admin" body={bodyIsAdmin} header="¿Es administrador?"></Column>
                    <Column body={bodyActions} header="Acciones"></Column>
                </DataTable>
            )}

            <Dialog
                visible={openDialogEditUser}
                onHide={() => setOpenDialogEditUser(false)}
                header='Editar usuario'
            >
                <Formik
                    initialValues={{ is_admin: editUser.is_admin, username: editUser.username }}
                    validationSchema={ValidationSchema}
                    onSubmit={(values) => onEditUser(values)}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isValid
                    }) => (
                        <form onSubmit={handleSubmit} style={{ display: 'inline-grid' }}>
                            <label>Nombre de usuario</label>
                            <input
                                type="text"
                                name="username"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.username}
                            />
                            {errors.username && touched.username && errors.username}

                            <label>¿Es administrador?</label>
                            <ToggleButton
                                name='is_admin'
                                checked={values.is_admin}
                                onChange={(e) => handleChange({ target: { name: 'is_admin', value: e.value } })}
                                onLabel="Si"
                                offLabel="No"
                            />

                            <Button type="submit" label="Modificar usuario" disabled={!isValid} />
                        </form>
                    )}
                </Formik>
            </Dialog>
        </Fragment>
    );
};

export default UsersView;
