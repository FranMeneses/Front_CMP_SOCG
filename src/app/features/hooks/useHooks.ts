import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/context/DataContext";
import { IValley } from "@/app/models/IValleys";
import { IProcess } from "@/app/models/IProcess";
import { useMutation } from "@apollo/client";
import { REGISTER, LOGIN, REQUEST_PASSWORD_RESET, RESET_PASSWORD } from "@/app/api/Auth";
import { 
    ILoginInput, 
    IRegisterInput, 
    IRequestPasswordResetInput, 
    IResetPasswordInput 
} from "@/app/models/IAuth";

export function useHooks() {
    const router = useRouter();
    
    const [userRole, setUserRole] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const storedRole = localStorage.getItem("rol");
            return storedRole || "";
        }
        return "";
    });
    
    const [currentValley, setCurrentValley] = useState<IValley | null>(null);
    const [currentProcess, setCurrentProcess] = useState<IProcess | null>(null);
    const { valleys, faenas, processes } = useData();
    
    const [login] = useMutation(LOGIN);
    const [register] = useMutation(REGISTER);
    const [requestPasswordReset] = useMutation(REQUEST_PASSWORD_RESET);
    const [resetPassword] = useMutation(RESET_PASSWORD);

    useEffect(() => {
        const syncRoleFromStorage = () => {
            if (typeof window !== 'undefined') {
                const storedRole = localStorage.getItem("rol");
                if (storedRole && storedRole !== userRole) {
                    setUserRole(storedRole);
                }
            }
        };
        
        syncRoleFromStorage();
        
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "rol") {
                if (event.newValue && event.newValue !== userRole) {
                    setUserRole(event.newValue);
                }
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [userRole]);

    /**
     * Función para manejar el inicio de sesión del usuario.
     */
    const handleLogin = async (input: ILoginInput) => {
        try {
            const { data } = await login({
                variables: {
                    loginInput: {
                        email: input.email,
                        password: input.password
                    }
                }
            });
            
            if (data?.login) {
                const { access_token, user } = data.login;
                localStorage.setItem("token", access_token);
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("rol", user.rol.nombre);
                document.cookie = `token=${access_token}; path=/; max-age=86400`;
                setUserRole(user.rol.nombre);
                handleLoginRedirect(user.rol.nombre);
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error during login:", error);
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                const graphQLError = error.graphQLErrors[0];
                if (graphQLError.message.includes("Credenciales inválidas")) {
                    throw new Error("Email o contraseña incorrectos.");
                } else if (graphQLError.message.includes("Usuario desactivado")) {
                    throw new Error("Su cuenta ha sido desactivada. Contacte al administrador.");
                } else {
                    throw new Error(graphQLError.message);
                }
            } else if (error.networkError) {
                throw new Error("Error de conexión. Verifique su conexión a internet.");
            } else {
                throw new Error("Error al iniciar sesión. Intente nuevamente.");
            }
        }
    };

    /**
     * Función para manejar el registro de un nuevo usuario.
     */
    const handleRegister = async (input: IRegisterInput) => {
        try {
            const { data } = await register({
                variables: {
                    registerInput: {
                        email: input.email,
                        password: input.password,
                        full_name: input.full_name,
                        organization: input.organization
                    }
                }
            });
            
            if (data?.register) {
                const { access_token, user } = data.register;
                localStorage.setItem("token", access_token);
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("rol", user.rol.nombre);
                document.cookie = `token=${access_token}; path=/; max-age=86400`;
                setUserRole(user.rol.nombre);
                handleLoginRedirect(user.rol.nombre);
                return user;
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error during registration:", error);
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                const graphQLError = error.graphQLErrors[0];
                if (graphQLError.message.includes("El email ya está registrado")) {
                    throw new Error("Este email ya está registrado. Intente con otro email.");
                } else if (graphQLError.message.includes("El email proporcionado no es válido")) {
                    throw new Error("El email proporcionado no es válido o no existe.");
                } else {
                    throw new Error(graphQLError.message);
                }
            } else if (error.networkError) {
                throw new Error("Error de conexión. Verifique su conexión a internet.");
            } else {
                throw new Error("Error al registrar usuario. Intente nuevamente.");
            }
        }
    };

    /**
     * Función para solicitar recuperación de contraseña.
     */
    const handleRequestPasswordReset = async (input: IRequestPasswordResetInput) => {
        try {
            const { data } = await requestPasswordReset({
                variables: {
                    input: {
                        email: input.email,
                        frontendUrl: input.frontendUrl
                    }
                }
            });
            if (data?.requestPasswordReset) {
                return data.requestPasswordReset;
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error during password reset request:", error);
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                const graphQLError = error.graphQLErrors[0];
                if (graphQLError.message.includes("Usuario no encontrado")) {
                    throw new Error("No se encontró una cuenta con este email.");
                } else if (graphQLError.message.includes("Usuario desactivado")) {
                    throw new Error("Su cuenta ha sido desactivada. Contacte al administrador.");
                } else if (graphQLError.message.includes("Email service not configured")) {
                    throw new Error("El servicio de email no está configurado. Contacte al administrador.");
                } else {
                    throw new Error(graphQLError.message);
                }
            } else if (error.networkError) {
                throw new Error("Error de conexión. Verifique su conexión a internet.");
            } else {
                throw new Error("Error al procesar la solicitud. Intente nuevamente.");
            }
        }
    };

    /**
     * Función para restablecer contraseña con token.
     */
    const handleResetPassword = async (input: IResetPasswordInput) => {
        try {
            const { data } = await resetPassword({
                variables: {
                    input: {
                        token: input.token,
                        newPassword: input.newPassword
                    }
                }
            });
            if (data?.resetPassword) {
                return data.resetPassword;
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error during password reset:", error);
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                const graphQLError = error.graphQLErrors[0];
                if (graphQLError.message.includes("Token inválido")) {
                    throw new Error("El enlace de recuperación no es válido.");
                } else if (graphQLError.message.includes("Token ya utilizado")) {
                    throw new Error("Este enlace de recuperación ya ha sido utilizado.");
                } else if (graphQLError.message.includes("Token expirado")) {
                    throw new Error("El enlace de recuperación ha expirado. Solicite uno nuevo.");
                } else if (graphQLError.message.includes("Usuario desactivado")) {
                    throw new Error("Su cuenta ha sido desactivada. Contacte al administrador.");
                } else {
                    throw new Error(graphQLError.message);
                }
            } else if (error.networkError) {
                throw new Error("Error de conexión. Verifique su conexión a internet.");
            } else {
                throw new Error("Error al cambiar la contraseña. Intente nuevamente.");
            }
        }
    };

    /**
     * Manejo de los IDs de los valles según el rol del usuario
     */
    const valleyIdByRole = useMemo(() => {
        return {
            "Jefe Relacionamiento VE": valleys?.find(v => v.name === "Valle del Elqui")?.id || 3,
            "Jefe Relacionamiento VC": valleys?.find(v => v.name === "Valle de Copiapó")?.id || 1,
            "Jefe Relacionamiento VH": valleys?.find(v => v.name === "Valle del Huasco")?.id || 2,
            "Admin": valleys?.find(v => v.name === "Transversal")?.id || 4,
            "Encargado Comunicaciones": valleys?.find(v => v.name === "Transversal")?.id || 4,
            "Encargado Asuntos Públicos": valleys?.find(v => v.name === "Transversal")?.id || 4,
            "Encargado Cumplimiento": valleys?.find(v => v.name === "Transversal")?.id || 4,
        };
    }, [valleys]);

    const processByRole = useMemo(() => {
        return {
            "Jefe Relacionamiento VE": processes?.find(p => p.name === "Relacionamiento VE")?.id || 3,
            "Jefe Relacionamiento VC": processes?.find(p => p.name === "Relacionamiento VC")?.id || 1,
            "Jefe Relacionamiento VH": processes?.find(p => p.name === "Relacionamiento VH")?.id || 2,
        };
    }, [processes]);

    useEffect(() => {
        if (valleys && valleys.length > 0 && !currentValley) {
            const roleBasedId = valleyIdByRole[userRole as keyof typeof valleyIdByRole];
            const defaultValley = valleys.find(v => v.id === roleBasedId) || valleys[0];
            setCurrentValley(defaultValley);
        }
    }, [valleys, userRole, valleyIdByRole, currentValley]);

    useEffect(() => {
        if (processes && processes.length > 0 && !currentProcess) {
            const roleBasedProcessId = processByRole[userRole as keyof typeof processByRole];
            const defaultProcess = processes.find(p => p.id === roleBasedProcessId) || processes[0];
            setCurrentProcess(defaultProcess);
        }
    }, [processes, userRole, processByRole, currentProcess]);

    const valleysName = useMemo(() => {
        if (!valleys) return [];
        return valleys.map(valley => valley.name);
    }, [valleys]);

    const faenasName = useMemo(() => {
        if (!faenas) return [];
        return faenas.map(faena => faena.name);
    }, [faenas]);

    const handleSetCurrentValley = (valleyNameOrObject: string | IValley) => {
        if (!valleys) return;
        let newValley: IValley | undefined;
        if (typeof valleyNameOrObject === 'string') {
            newValley = valleys.find(v => v.name === valleyNameOrObject);
        } else {
            newValley = valleyNameOrObject;
        }
        if (newValley) {
            setCurrentValley(newValley);
        }
    };

    const handleSetCurrentProcess = (processNameOrObject: string | IProcess) => {
        if (!processes) return;
        let newProcess: IProcess | undefined;
        if (typeof processNameOrObject === 'string') {
            newProcess = processes.find(p => p.name === processNameOrObject);
        } else {
            newProcess = processNameOrObject;
        }
        if (newProcess) {
            setCurrentProcess(newProcess);
        }
    };

    const handleLoginRedirect = (role: string) => {
        switch (role) {
            case "Gerente":
            case "Admin":
            case "Superintendente Relacionamiento":
            case "Superintendente Comunicaciones":
            case "Encargado Cumplimiento":
                router.push("/features/resume");
                break;
            case "Encargado Asuntos Públicos":
            case "Encargado Comunicaciones":
            case "Jefe Relacionamiento VE":
            case "Jefe Relacionamiento VC":
            case "Jefe Relacionamiento VH":
                router.push("/features/planification");
                break;
            default:
                router.push("/features/noAccess");
                break;
        }
    };

    const isValleyManager = userRole === "Superintendente Relacionamiento" || userRole === 'Jefe Relacionamiento VE' || userRole === 'Jefe Relacionamiento VC' || userRole === 'Jefe Relacionamiento VH';
    const isCommunicationsManager = userRole === "Encargado Comunicaciones" || userRole === "Encargado Asuntos Públicos" || userRole === "Superintendente Comunicaciones";
    const isManager = userRole === 'Gerente' || userRole === 'Superintendente Relacionamiento' || userRole === 'Superintendente Comunicaciones';

    /**
     * Función para cerrar sesión.
     */
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("rol");
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        setUserRole("");
        router.push("/");
    };

    return {
        userRole,
        currentValley,
        currentProcess,
        valleysName,
        faenasName,
        isValleyManager,
        isCommunicationsManager,
        isManager,
        faenas,
        valleys,
        processes,
        handleLogin,
        handleRegister,
        handleRequestPasswordReset,
        handleResetPassword,
        handleLoginRedirect,
        handleLogout, 
        setCurrentValley: handleSetCurrentValley,
        setCurrentProcess: handleSetCurrentProcess,
    };
}