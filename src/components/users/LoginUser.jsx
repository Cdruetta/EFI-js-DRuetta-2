import { Formik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginUser = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); 

    const onLoginUser = async (values) => {
        const bodyLoginUser = btoa(
            `${values.username}:${values.password}`
        );

        const response = await fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${bodyLoginUser}`  
            },
            body: JSON.stringify({
                username: values.username,
                password: values.password
            })
        });

        if (!response.ok) {
            console.log("Hubo un error en la llamada a la API");
            setMessage('Error en la conexión con el servidor');
            return;
        }

        const data = await response.json();

        if (data.Token) {
            console.log('Token recibido', data.Token);
            localStorage.setItem('token', JSON.stringify(data.Token));
            setMessage('Inicio de sesión exitoso');

            setTimeout(() => {
                navigate('/'); 
            }, 1500);  
        } else {
            console.log('No se recibió el token');
            setMessage('Nombre o usuario incorrecto');
        }

        console.log(data.Token);
    };    

    const ValidationSchema = Yup.object().shape({
        username: Yup.string()
            .required('Debes ingresar un nombre de usuario')
            .min(3, 'minimo 3 caracteres')
            .max(20, 'maximo 20 caracteres'),
        password: Yup.string()
            .required('Requerido')
            .min(5, 'minimo 5 caracteres'),  
    });

    return (
        <Formik
            initialValues={{ password: '', username: '' }}
            validationSchema={ValidationSchema}
            onSubmit={(values, { setSubmitting }) => {
                console.log('Formulario enviado', values);
                onLoginUser(values);
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
                isSubmitting,
                isValid
            }) => (
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            name="username"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.username}
                            placeholder="Nombre de usuario"
                        />
                        {errors.username && touched.username && (
                            <div style={{ color: 'red' }}>{errors.username}</div>
                        )}
                    </div>
                    <div>
                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                            placeholder="Contraseña"
                        />
                        {errors.password && touched.password && (
                            <div style={{ color: 'red' }}>{errors.password}</div>
                        )}
                    </div>
                    <button type="submit" disabled={values.password === '' || values.username === '' || !isValid || isSubmitting}>
                        Iniciar Sesión
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

export default LoginUser;
