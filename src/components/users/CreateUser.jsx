import { Field, ErrorMessage, Formik } from 'formik';
import * as Yup from 'yup';

const CreateUser = () => {
  const token = JSON.parse(localStorage.getItem('token'));

  const RegisterUser = async (values) => {
    const bodyRegisterUser = {
      username: values.username,
      password: values.password,
      isAdmin: false,
    };
    console.log('bodyRegisterUser', bodyRegisterUser);

    try {
      const response = await fetch('http://127.0.0.1:5000/users', {
        method: 'POST',
        body: JSON.stringify(bodyRegisterUser),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al registrar el usuario');
      }

      console.log('Usuario creado exitosamente');
    } catch (error) {
      console.error('Error en el registro', error);
    }
  };

  const ValidationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Este es un campo requerido')
      .min(5, 'La contraseña debe tener al menos 5 caracteres'),
    username: Yup.string()
      .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
      .max(20, 'El nombre de usuario no debe exceder los 20 caracteres')
      .required('El nombre de usuario es requerido'),
  });

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
        isSubmitting,
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
            <ErrorMessage name="username" component="div" />
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
            <ErrorMessage name="password" component="div" />
          </div>
          <button type="submit" disabled={isSubmitting}>
            Crear Usuario
          </button>
        </form>
      )}
    </Formik>
  );
};

export default CreateUser;
