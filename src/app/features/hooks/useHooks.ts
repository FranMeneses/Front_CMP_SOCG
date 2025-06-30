import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/context/DataContext";
import { IValley } from "@/app/models/IValleys";
import { IProcess } from "@/app/models/IProcess";
import { useMutation } from "@apollo/client";
import { REGISTER, LOGIN } from "@/app/api/Auth";
import { ILoginInput, IRegisterInput } from "@/app/models/IAuth";

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
     * @description Inicia sesión al usuario y redirige a la página correspondiente según su rol
     * @param input Objeto de entrada que contiene las credenciales del usuario
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
                
                // Guardar información de autenticación
                localStorage.setItem("token", access_token);
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("rol", user.rol.nombre);

                // Configurar cookie para middleware
                document.cookie = `token=${access_token}; path=/; max-age=86400`; // 24 horas

                setUserRole(user.rol.nombre);
                handleLoginRedirect(user.rol.nombre);
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error during login:", error);
            
            // Manejar diferentes tipos de errores
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
     * @description Registra un nuevo usuario en el sistema y lo autentica automáticamente
     * @param input Datos del usuario a registrar
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
                        // No enviamos id_rol - se asigna automáticamente
                    }
                }
            });
            
            if (data?.register) {
                const { access_token, user } = data.register;
                
                // Auto-login después del registro exitoso
                localStorage.setItem("token", access_token);
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("rol", user.rol.nombre);

                // Configurar cookie para middleware
                document.cookie = `token=${access_token}; path=/; max-age=86400`; // 24 horas

                setUserRole(user.rol.nombre);
                handleLoginRedirect(user.rol.nombre);
                
                return user;
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error during registration:", error);
            
            // Manejar diferentes tipos de errores
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

    /**
    * Manejo del valle actual según el rol del usuario
    */
    useEffect(() => {
        if (valleys && valleys.length > 0 && !currentValley) {
            const roleBasedId = valleyIdByRole[userRole as keyof typeof valleyIdByRole];
            const defaultValley = valleys.find(v => v.id === roleBasedId) || valleys[0];
            setCurrentValley(defaultValley);
        }
    }, [valleys, userRole, valleyIdByRole, currentValley]);

    /**
    * Manejo del proceso actual según el rol del usuario
    */
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

    /**
     *  Manejo de los nombres de los valles
     * @param valleyNameOrObject 
     * @returns 
     */
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


    /**
     * Función para manejar la redirección después del inicio de sesión.
     * @description Redirige al usuario a la página correspondiente según su rol.
     * @param role Rol del usuario para redirigir a la página correspondiente
     */
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
                router.push("/features/documents");
                break;
        }
    };

    /**
     * Verifica si el usuario es un encargado de valle.
     * @description Esta función verifica si el rol del usuario corresponde a un encargado de valle.
     * @returns 
     */
    const isValleyManager = userRole === "Superintendente Relacionamiento" || userRole === 'Jefe Relacionamiento VE' || userRole === 'Jefe Relacionamiento VC' || userRole === 'Jefe Relacionamiento VH';
    
    const isCommunicationsManager = userRole === "Encargado Comunicaciones" || userRole === "Encargado Asuntos Públicos" || userRole === "Superintendente Comunicaciones";

    const isManager = userRole === 'Gerente' || userRole === 'Superintendente Relacionamiento' || userRole === 'Superintendente Comunicaciones';
    
    /**
     * Función para cerrar sesión.
     */
    const handleLogout = () => {
        // Limpiar localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("rol");
        
        // Limpiar cookie
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        
        // Resetear estado
        setUserRole("");
        
        // Redirigir al login
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
        handleLoginRedirect,
        handleLogout, 
        setCurrentValley: handleSetCurrentValley,
        setCurrentProcess: handleSetCurrentProcess,
    };
}