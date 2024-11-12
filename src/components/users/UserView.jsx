import { Fragment, useState, useRef, useEffect } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from "primereact/dialog";
import { ToggleButton } from 'primereact/togglebutton';
import { InputText } from 'primereact/inputtext';
import { Formik } from "formik";
import * as Yup from 'yup';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const UsersView = ({ data, loadingData }) => {
    const token = localStorage.getItem('token');
    const toast = useRef(null);

    const [openDialogEditUser, setOpenDialogEditUser] = useState(false);
    const [editUser, setEditUser] = useState({});

    useEffect(() => {
        if (!openDialogEditUser) {
            setEditUser({});
        }
    }, [openDialogEditUser]);

    const bodyIsAdmin = (rowData) => {
        return rowData.is_admin ? <span>Si</span> : <span>No</span>;
    };

    const bodyActions = (rowData) => {
        return (
            <div>
                <Button
                    icon='pi pi-pencil'
                    label='Editar'
                    onClick={() => {
                        setEditUser(rowData);
                        setOpenDialogEditUser(true);
                    }}
                />
                <Button
                    icon='pi pi-trash'
                    label='Borrar'
                    onClick={() => confirmDeleteUser(rowData)}
                />
            </div>
        );
    };

    const confirmDeleteUser = (rowData) => {
        confirmDialog({
            message: "¿Estás seguro de eliminar este usuario?",
            header: "Confirmación de Eliminación",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: () => onDeleteUser(rowData),
            reject: () => toast.current.show({ severity: 'info', summary: 'Cancelado', detail: 'Operación cancelada', life: 3000 }),
        });
    };

    const onDeleteUser = async (rowData) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/users/${rowData.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                toast.current.show({ severity: 'success', summary: 'Usuario Eliminado', detail: 'El usuario ha sido eliminado', life: 3000 });
                // Aquí puedes actualizar la lista de usuarios si es necesario
            } else {
                const errorData = await response.json();
                toast.current.show({ severity: 'error', summary: 'Error', detail: errorData.message || 'Error al eliminar el usuario', life: 3000 });
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error en la solicitud', life: 3000 });
        }
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

        try {
            const response = await fetch(`http://127.0.0.1:5000/users/${values.id}`, {
                method: 'PUT',
                body: JSON.stringify(bodyEditUser),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                toast.current.show({ severity: 'success', summary: 'Usuario Modificado', detail: 'El usuario ha sido modificado', life: 3000 });
                setOpenDialogEditUser(false);
                // Aquí puedes actualizar la lista de usuarios si es necesario
            } else {
                const errorData = await response.json();
                toast.current.show({ severity: 'error', summary: 'Error', detail: errorData.message || 'Error al modificar el usuario', life: 3000 });
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error en la solicitud', life: 3000 });
        }
    };

    return (
        <Fragment>
            <h1>Usuarios</h1>
            {loadingData ? (
                <ProgressSpinner />
            ) : (
                <DataTable value={data} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="username" header="Nombre de usuario" />
                    <Column field="is_admin" body={bodyIsAdmin} header="¿Es administrador?" />
                    <Column body={bodyActions} header="Acciones" />
                </DataTable>
            )}

            <Toast ref={toast} />
            <ConfirmDialog />

            <Dialog
                visible={openDialogEditUser}
                onHide={() => setOpenDialogEditUser(false)}
                header="Editar usuario"
            >
                <Formik
                    initialValues={{ id: editUser.id, is_admin: editUser.is_admin, username: editUser.username }}
                    validationSchema={ValidationSchema}
                    onSubmit={onEditUser}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isValid,
                    }) => (
                        <form onSubmit={handleSubmit} style={{ display: 'inline-grid' }}>
                            <label>Nombre de usuario</label>
                            <InputText
                                type="text"
                                name="username"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.username}
                            />
                            {errors.username && touched.username && (
                                <div style={{ color: 'red' }}>{errors.username}</div>
                            )}

                            <label>¿Es administrador?</label>
                            <ToggleButton
                                name="is_admin"
                                checked={values.is_admin}
                                onChange={(e) => handleChange({ target: { name: 'is_admin', value: e.value } })}
                                onLabel="Si"
                                offLabel="No"
                            />

                            <Button type="submit" label="Modificar usuario" disabled={!isValid || !values.username} />
                        </form>
                    )}
                </Formik>
            </Dialog>
        </Fragment>
    );
};

export default UsersView;
