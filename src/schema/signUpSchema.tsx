import * as yup from 'yup';

export const signUpSchema = yup.object().shape({
    first_name: yup.string().required('First name is required'),
    last_name: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone_number: yup
        .string()
        .matches(/^[0-9()+\-\s]*$/, 'Invalid phone number')
        .required('Phone number is required'),
    password: yup
        .string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[\S]{8,}$/,
            'Password must be at least 8 characters and include lowercase, uppercase, number, and symbol.'
        ),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], "Passwords don't match")
        .required('Confirm password is required')

});
