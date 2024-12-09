import * as Yup from "yup";

export const LogInValidation = Yup.object({
    user_email: Yup.string().matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|net)$/, "Email must be a valid email").required('Email is required'),
    user_pass: Yup.string().trim().matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&*+=!])(?!.*\s).{8,25}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character and must be 8-25 characters long").required("Required"),
});