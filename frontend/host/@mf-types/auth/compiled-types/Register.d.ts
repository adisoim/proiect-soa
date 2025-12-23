import React from "react";
interface RegisterProps {
    onRegisterSuccess: () => void;
    onSwitchToLogin: () => void;
}
declare const Register: React.FC<RegisterProps>;
export default Register;
