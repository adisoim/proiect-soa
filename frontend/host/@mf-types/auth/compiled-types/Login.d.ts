import React from "react";
interface LoginProps {
    onLoginSuccess: () => void;
    onSwitchToRegister?: () => void;
}
declare const Login: React.FC<LoginProps>;
export default Login;
