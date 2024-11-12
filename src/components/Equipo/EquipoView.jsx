import { Fragment, useRef, useState, useEffect } from "react";
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ToggleButton } from 'primereact/togglebutton';
import { InputText } from 'primereact/inputtext';
import { Formik } from "formik";
import * as Yup from 'yup';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const EquiposView = ({ loadingData, data }) => {
    const token = localStorage.getItem('token');
    const toast = useRef(null);
    
    const [openDialogEditUser, setOpenDialogEditUser] = useState(false);
    const [editUser, setEditUser] = useState({});

    // Reset form when dialog is closed
    useEffect(() => {
        if (!openDialogEditUser) {
            setEditUser({});
        }
    }, [openDialogEditUser]);

    // Render the active status
    const bodyActivo = (rowData) => {
        return rowData.activo ? <span>Inactivo</span> : <span>Activo</span>;
    };

    // Function to handle editing a user (equipo)
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

    // Function to handle confirmation of user deletion
    const confirmDeleteUser = (rowData) => {
        confirmDialog({
            message: `¿Estás seguro de que quieres eliminar este equipo?`,
            header: 'Confirmación de eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => deleteUser(rowData),
        });
    };

    // Function to delete a user (equipo)
    const deleteUser = async (rowData) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/equipos/${rowData.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                toast.current.show({ severity: 'success', summary: 'Eliminado', detail: 'El equipo ha sido eliminado.' });
            } else {
                throw new Error('Error al eliminar');
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
        }
    };

    return (
        <Fragment>
            <h1>Equipos</h1>
            {loadingData ? (
                <ProgressSpinner />
            ) : (
                <DataTable value={data} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="categoria.nombre" header="Categoría"></Column>
                    <Column field="marca.nombre" header="Marca"></Column>
                    <Column field="modelo.nombre" header="Modelo"></Column>
                    <Column field="accesorio.cargador" header="Cargador"></Column>
                    <Column field="accesorio.auriculares" header="Auriculares"></Column>
                    <Column field="activo" body={bodyActivo} header="Estado"></Column>
                    <Column body={bodyActions} header="Acciones"></Column>
                </DataTable>
            )}

            {/* Dialog for editing a team */}
            <Dialog
                visible={openDialogEditUser}
                style={{ width: '50vw' }}
                header="Editar Equipo"
                modal
                onHide={() => setOpenDialogEditUser(false)}
            >
                <Formik
                    initialValues={{
                        categoria: editUser.categoria?.nombre || '',
                        marca: editUser.marca?.nombre || '',
                        modelo: editUser.modelo?.nombre || '',
                        cargador: editUser.accesorio?.cargador || '',
                        auriculares: editUser.accesorio?.auriculares || '',
                    }}
                    validationSchema={Yup.object({
                        categoria: Yup.string().required('Campo requerido'),
                        marca: Yup.string().required('Campo requerido'),
                        modelo: Yup.string().required('Campo requerido'),
                        cargador: Yup.string().required('Campo requerido'),
                        auriculares: Yup.string().required('Campo requerido'),
                    })}
                    onSubmit={async (values, { setSubmitting }) => {
                        await handleEditUser(values);
                        setSubmitting(false);
                    }}
                >
                    {({
                        values,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        errors,
                        touched,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <InputText
                                id="categoria"
                                name="categoria"
                                value={values.categoria}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Categoría"
                            />
                            {errors.categoria && touched.categoria && <small>{errors.categoria}</small>}

                            <InputText
                                id="marca"
                                name="marca"
                                value={values.marca}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Marca"
                            />
                            {errors.marca && touched.marca && <small>{errors.marca}</small>}

                            <InputText
                                id="modelo"
                                name="modelo"
                                value={values.modelo}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Modelo"
                            />
                            {errors.modelo && touched.modelo && <small>{errors.modelo}</small>}

                            <InputText
                                id="cargador"
                                name="cargador"
                                value={values.cargador}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Cargador"
                            />
                            {errors.cargador && touched.cargador && <small>{errors.cargador}</small>}

                            <InputText
                                id="auriculares"
                                name="auriculares"
                                value={values.auriculares}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Auriculares"
                            />
                            {errors.auriculares && touched.auriculares && <small>{errors.auriculares}</small>}

                            <Button type="submit" label="Guardar" icon="pi pi-check" />
                        </form>
                    )}
                </Formik>
            </Dialog>

            <Toast ref={toast} />
            <ConfirmDialog />
        </Fragment>
    );
};

export default EquiposView;
