import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate} from 'react-router-dom';

const CreateUser = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  const ValidationSchema = Yup.object().shape({
    username: Yup.string()
      .required('Deber tener un nombre de usuario')
      .min(5, 'minimo 5 caracteres')
      .max(20, 'maximo 20 caracteres'),
    password: Yup.string()
      .required('Requerido')
      .min(5, 'minimo 5 caracteres')
      .max(20, 'maximo 20 caracteres'),
  })

  const token = JSON.parse(localStorage.getItem('token'))

  const RegisterUser = async (values) => {

    const bodyRegisterUser = {
      usuario: values.username,
      contrasenia: values.password,
    }
    const response = await fetch('http://127.0.0.1:5000/users', {
        method: 'POST',
        body: JSON.stringify(bodyRegisterUser),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
    })
    console.log(response);
    if (!response.ok) {
      console.log("Hubo un error en la llamada a la API");
      setMessage('Error en la conexión con el servidor');
      return;
    }
  }

  return (
    <Formik
      initialValues={{ password: '', username: '' }}
      validationSchema={ValidationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        await RegisterUser(values);
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
        isValid
      }) => (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Nombre de Usuario:</label>
            <Field
              type="text"
              name="username"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.username}
            />
            {errors.username && touched.username && errors.username}
            <div style={{ color: 'red' }}>{errors.password}</div>
          </div>
          <div>
            <label htmlFor="password">Contraseña:</label>
            <Field
              type="password"
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />
            {errors.password && touched.password && errors.password}
            <div style={{ color: 'red' }}>{errors.password}</div>
          </div>
          <button onClick={() => RegisterUser(values)} type="submit" disabled={values.password === '' || values.username === '' || !isValid}>
            Crear Usuario
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

export default CreateUser;
