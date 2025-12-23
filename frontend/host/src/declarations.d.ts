declare module "auth/Login" {
    const Login: React.ComponentType<{ 
        onLoginSuccess: () => void;
        onSwitchToRegister?: () => void;
    }>;
    export default Login;
}

declare module "auth/Register" {
    const Register: React.ComponentType<{ 
        onRegisterSuccess: () => void;
        onSwitchToLogin: () => void;
    }>;
    export default Register;
}

declare module "tasks/TaskManager" {
    const TaskManager: React.ComponentType;
    export default TaskManager;
}