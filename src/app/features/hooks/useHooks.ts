import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/context/DataContext";
import { IValley } from "@/app/models/IValleys";
import { IProcess } from "@/app/models/IProcess";

export function useHooks() {
    const router = useRouter();
    const [userRole, setUserRole] = useState<string>("encargado valle elqui"); 
    const [currentValley, setCurrentValley] = useState<IValley | null>(null);
    const [currentProcess, setCurrentProcess] = useState<IProcess | null>(null);
    const { valleys, faenas, processes } = useData();

    /**
    * Manejo de los IDs de los valles según el rol del usuario
    */
    const valleyIdByRole = useMemo(() => {
        return {
            "encargado valle elqui": valleys?.find(v => v.name === "Valle del Elqui")?.id || 3,
            "encargado copiapó": valleys?.find(v => v.name === "Valle de Copiapó")?.id || 1,
            "encargado huasco": valleys?.find(v => v.name === "Valle del Huasco")?.id || 2,
            "Admin": valleys?.find(v => v.name === "Transversal")?.id || 4,
            "encargado comunicaciones": valleys?.find(v => v.name === "Transversal")?.id || 4,
            "encargado asuntos públicos": valleys?.find(v => v.name === "Transversal")?.id || 4,
            "encargado cumplimiento": valleys?.find(v => v.name === "Transversal")?.id || 4,
        };
    }, [valleys]);

    const processByRole = useMemo(() => {
        return {
            "encargado valle elqui": processes?.find(p => p.name === "Relacionamiento VE")?.id || 3,
            "encargado copiapó": processes?.find(p => p.name === "Relacionamiento VC")?.id || 1,
            "encargado huasco": processes?.find(p => p.name === "Relacionamiento VH")?.id || 2,
            "jefe elqui": processes?.find(p => p.name === "Relacionamiento VE")?.id || 3,
            "jefe copiapó": processes?.find(p => p.name === "Relacionamiento VC")?.id || 1,
            "jefe huasco": processes?.find(p => p.name === "Relacionamiento VH")?.id || 2,
        };
    }, [processes]);

    /**
    * Manejo de los nombres de los valles según el rol del usuario
    */
    const valleyNamesByRole = useMemo(() => {
        return {
            "encargado valle elqui": valleys?.find(v => v.name === "Valle del Elqui")?.name || "Valle del Elqui",
            "encargado copiapó": valleys?.find(v => v.name === "Valle de Copiapó")?.name || "Valle de Copiapó",
            "encargado huasco": valleys?.find(v => v.name === "Valle del Huasco")?.name || "Valle del Huasco",
            "Admin": valleys?.find(v => v.name === "Transversal")?.name || "Transversal",
            "encargado comunicaciones": valleys?.find(v => v.name === "Transversal")?.name || "Transversal",
            "encargado asuntos públicos": valleys?.find(v => v.name === "Transversal")?.name || "Transversal",
            "encargado cumplimiento": valleys?.find(v => v.name === "Transversal")?.name || "Transversal",
            "gerente": valleys?.find(v => v.name === "Transversal")?.name || "Transversal",
        };
    }, [valleys]);

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
    * Manejo del nombre del valle actual según el rol del usuario
    */
    const currentValleyName = useMemo(() => {
        if (currentValley) {
            return currentValley.name;
        }
        return valleyNamesByRole[userRole as keyof typeof valleyNamesByRole] || "";
    }, [currentValley, valleyNamesByRole, userRole]);

    /**
    * Manejo del ID del valle actual según el rol del usuario
    */
    const currentValleyId = useMemo(() => {
        if (currentValley) {
            return currentValley.id;
        }
        return valleyIdByRole[userRole as keyof typeof valleyIdByRole] || null;
    }, [currentValley, valleyIdByRole, userRole]);

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
        setUserRole(role);
        switch (role) {
            case "gerente":
                router.push("/features/resume");
                break;
            case "admin":
                router.push("/features/resume");
                break;
            case "superintendente de relacionamiento":
                router.push("/features/resume");
                break;
            case "superintendente de comunicaciones":
                router.push("/features/resume");
                break;
            case "encargado cumplimiento":
                router.push("/features/resume");
                break;
            case "encargado asuntos públicos":
                router.push("/features/planification");
                break;
            case "encargado comunicaciones":
                router.push("/features/planification");
                break;
            case "encargado valle elqui":
                router.push("/features/planification");
                break;
            case "encargado copiapó":
                router.push("/features/planification");
                break;
            case "encargado huasco":
                router.push("/features/planification");
                break;
            case "jefe elqui":
                router.push("/features/planification");
                break;
            case "jefe copiapó":
                router.push("/features/planification");
                break;
            case "jefe huasco":
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
    const isValleyManager = userRole === "encargado valle elqui" || userRole === "encargado copiapó" || userRole === "encargado huasco" || userRole === "superintendente de relacionamiento" || userRole === 'jefe elqui' || userRole === 'jefe copiapó' || userRole === 'jefe huasco';
    
    const isCommunicationsManager = userRole === "encargado comunicaciones" || userRole === "encargado asuntos públicos" || userRole === "superintendente de comunicaciones";

    const isManager = userRole === 'gerente' || userRole === 'superintendente de relacionamiento' || userRole === 'superintendente de comunicaciones' ;
    
    return {
        handleLoginRedirect,
        userRole,
        setUserRole,
        currentValley,
        currentProcess,
        currentValleyName, 
        currentValleyId,
        valleysName,
        faenasName,
        isValleyManager,
        isCommunicationsManager,
        isManager,
        faenas,
        valleys,
        processes,
        setCurrentValley: handleSetCurrentValley,
        setCurrentProcess: handleSetCurrentProcess,  
    };
}