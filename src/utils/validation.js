import * as yup from 'yup';

export const registerSchema = yup.object().shape({
  FullName: yup.string().required('Full name is required'),
  Email: yup.string().email('Invalid email').required('Email is required'),
  Password: yup.string().min(8, 'Password must be at least 8 characters').required(),
  Role: yup.string().required('Role is required').oneOf(['student', 'instructor'], 'Invalid role'),
});

export const loginSchema = yup.object().shape({
  Email: yup.string().email('Invalid email').required('Email is required'),
  Password: yup.string().required('Password is required'),
});