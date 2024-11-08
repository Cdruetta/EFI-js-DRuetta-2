import { Field, ErrorMessage, Formik } from 'formik'
import * as Yup from 'yup'

const LoginUser = () => {
    const onLoginUser = async (values) => {
        const bodyLoginUser = btoa(`${values.username}:${values.password}`)
        

        try {
            const response = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Basic ${bodyLoginUser}` 
                } 
            })

            if(!response.ok) {
                console.log("Error en la solicitud")
            }            
            
            const data = await response.json()

            if (response.ok) {
                localStorage.setItem('token', JSON.stringify(data.Token))
            } else {
                console.error("Login failed", data)
            }
        } catch (error) {
            console.error("An error occurred", error)
        }
    }

    const ValidationSchema = Yup.object().shape({
        password: Yup.string()
            .required('Este es un campo requerido')
            .min(3, 'Esta contraseña debe tener al menos 5 caracteres'),  // Cambiado el mínimo a 5
        username: Yup.string()
            .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')  // Corregido el mensaje mínimo
            .max(20, 'El nombre de usuario no debe exceder los 20 caracteres')
            .required('El nombre de usuario es requerido'),
    })

    return (
        <Formik
            initialValues={{ password: '', username: '' }}
            validationSchema={ValidationSchema}
            onSubmit={(values, { setSubmitting }) => {
                onLoginUser(values)
                setSubmitting(false)
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
                    <button type="submit" disabled={isSubmitting || !isValid}>
                        Iniciar Sesión
                    </button>
                </form>
            )}
        </Formik>
    )
}

export default LoginUser
