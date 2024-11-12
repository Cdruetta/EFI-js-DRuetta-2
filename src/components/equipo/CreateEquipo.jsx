import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateEquipo = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

  // Validación de los campos con Yup
    const ValidationSchema = Yup.object().shape({
        nombre: Yup.string()
        .required('Debe tener un nombre')
        .min(3, 'Mínimo 3 caracteres')
        .max(50, 'Máximo 50 caracteres'),
        modelo_id: Yup.number().required('Debe seleccionar un modelo'),
        categoria_id: Yup.number().required('Debe seleccionar una categoría'),
        costo: Yup.number().required('Debe ingresar el costo'),
        stock_id: Yup.number().required('Debe seleccionar el stock'),
        marca_id: Yup.number().required('Debe seleccionar la marca'),
    });

    const token = JSON.parse(localStorage.getItem('token'));

    const RegisterEquipo = async (values) => {
        const bodyRegisterEquipo = {
        nombre: values.nombre,
        modelo_id: values.modelo_id,
        categoria_id: values.categoria_id,
        costo: values.costo,
        stock_id: values.stock_id,
        marca_id: values.marca_id,
        activo: 1,
        };

        const response = await fetch('http://127.0.0.1:5000/equipos/crear', {
        method: 'POST',
        body: JSON.stringify(bodyRegisterEquipo),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        });

        if (!response.ok) {
        console.log('Hubo un error en la llamada a la API');
        setMessage('Error en la conexión con el servidor');
        return;
        }

        navigate('/equipos'); // Redirige a la lista de equipos después de crear
    };

    return (
        <Formik
        initialValues={{
            nombre: '',
            modelo_id: '',
            categoria_id: '',
            costo: '',
            stock_id: '',
            marca_id: '',
        }}
        validationSchema={ValidationSchema}
        onSubmit={async (values, { setSubmitting }) => {
            await RegisterEquipo(values);
            setSubmitting(false);
        }}
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
            <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="nombre">Nombre del Equipo:</label>
                <Field
                type="text"
                name="nombre"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.nombre}
                />
                {errors.nombre && touched.nombre && <div>{errors.nombre}</div>}
            </div>

            <div>
                <label htmlFor="modelo_id">Modelo ID:</label>
                <Field
                type="number"
                name="modelo_id"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.modelo_id}
                />
                {errors.modelo_id && touched.modelo_id && <div>{errors.modelo_id}</div>}
            </div>

            <div>
                <label htmlFor="categoria_id">Categoría ID:</label>
                <Field
                type="number"
                name="categoria_id"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.categoria_id}
                />
                {errors.categoria_id && touched.categoria_id && <div>{errors.categoria_id}</div>}
            </div>

            <div>
                <label htmlFor="costo">Costo:</label>
                <Field
                type="number"
                name="costo"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.costo}
                />
                {errors.costo && touched.costo && <div>{errors.costo}</div>}
            </div>

            <div>
                <label htmlFor="stock_id">Stock ID:</label>
                <Field
                type="number"
                name="stock_id"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.stock_id}
                />
                {errors.stock_id && touched.stock_id && <div>{errors.stock_id}</div>}
            </div>

            <div>
                <label htmlFor="marca_id">Marca ID:</label>
                <Field
                type="number"
                name="marca_id"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.marca_id}
                />
                {errors.marca_id && touched.marca_id && <div>{errors.marca_id}</div>}
            </div>

            <button
                type="submit"
                disabled={Object.values(values).some(val => val === '') || !isValid}
            >
                Crear Equipo
            </button>

            {message && (
                <div style={{ padding: '5px', marginTop: '20px', backgroundColor: 'red', border: '2px solid white' }}>
                {message}
                </div>
            )}
            </form>
        )}
        </Formik>
    );
};

export default CreateEquipo;
