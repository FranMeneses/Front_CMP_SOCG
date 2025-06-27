import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/context/DataContext";
import { IValley } from "@/app/models/IValleys";
import { IProcess } from "@/app/models/IProcess";
import { useMutation } from "@apollo/client";
import { CREATE_USER, LOGIN } from "@/app/api/Auth";
import { ILoginInput, IRegisterInput } from "@/app/models/IAuth";

export function useHooks() {
    const router = useRouter();
    
    const [userRole, setUserRole] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const storedRole = localStorage.getItem("rol");
            console.log("Initial userRole from localStorage:", storedRole);
            return storedRole || "";
        }
        return "";
    });
    
    const [currentValley, setCurrentValley] = useState<IValley | null>(null);
    const [currentProcess, setCurrentProcess] = useState<IProcess | null>(null);
    const { valleys, faenas, processes } = useData();
    
    const [login] = useMutation(LOGIN)
    const [register] = useMutation(CREATE_USER);

    useEffect(() => {
        const syncRoleFromStorage = () => {
            if (typeof window !== 'undefined') {
                const storedRole = localStorage.getItem("rol");
                if (storedRole && storedRole !== userRole) {
                    console.log("Syncing userRole from localStorage:", storedRole);
                    setUserRole(storedRole);
                }
            }
        };
        
        syncRoleFromStorage();
        
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "rol") {
                console.log("Storage event detected for rol:", event.newValue);
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
     * @description Inicia sesión al usuario y redirige a la página correspondiente según su
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
            if (data.login) {
                const { access_token, user } = data.login;
                localStorage.setItem("token", access_token);
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("rol", user.rol.nombre);

                document.cookie = `token=${access_token}; path=/;`;

                setUserRole(user.rol.nombre);
                handleLoginRedirect(user.rol.nombre);
            }
        } catch (error) {
            console.error("Error during login:", error);
            throw new Error("Login failed. Please check your credentials.");
        }
    };

    /**
     * Función para manejar el registro de un nuevo usuario.
     * @description Registra un nuevo usuario y redirige al usuario a la página correspondiente
     * @param input Objeto de entrada que contiene los datos del nuevo usuario
     */
    const handleRegister = async (input: IRegisterInput) => {
        try {
            const { data } = await register({
                variables: {
                    createUserInput: {
                        email: input.email,
                        password: input.password,
                        full_name: input.full_name,
                        id_rol: input.id_rol
                    }
                }
            });

            if (data.createUser) {
                const input = {
                    email: data.createUser.email,
                    password: data.createUser.password
                };
                handleLogin(input);
            }
        } catch (error) {
            console.error("Error during registration:", error);
            throw new Error("Registration failed. Please try again.");
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

    const valleysName = valleys?.map((valley) => valley.name) || [];
    const faenasName = faenas?.map((faena) => faena.name) || [];

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
        console.log("Redirecting user with role:", role);
        switch (role) {
            case "Gerente":
                router.push("/features/resume");
                break;
            case "Admin":
                console.log("Redirecting Admin to /features/resume");
                router.push("/features/resume");
                break;
            case "Superintendente Relacionamiento":
                router.push("/features/resume");
                break;
            case "Superintendente Comunicaciones":
                router.push("/features/resume");
                break;
            case "Encargado Cumplimiento":
                router.push("/features/resume");
                break;
            case "Encargado Asuntos Públicos":
                router.push("/features/planification");
                break;
            case "Encargado Comunicaciones":
                router.push("/features/planification");
                break;
            case "Jefe Relacionamiento VE":
                router.push("/features/planification");
                break;
            case "Jefe Relacionamiento VC":
                router.push("/features/planification");
                break;
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
    const isValleyManager = userRole === "encargado elqui" || userRole === "encargado copiapó" || userRole === "encargado huasco" || userRole === "Superintendente Relacionamiento" || userRole === 'Jefe Relacionamiento VE' || userRole === 'Jefe Relacionamiento VC' || userRole === 'Jefe Relacionamiento VH';
    
    const isCommunicationsManager = userRole === "Encargado Comunicaciones" || userRole === "Encargado Asuntos Públicos" || userRole === "Superintendente Comunicaciones";

    const isManager = userRole === 'Gerente' || userRole === 'Superintendente Relacionamiento' || userRole === 'Superintendente Comunicaciones';
    

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("rol");
        setUserRole("");
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
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