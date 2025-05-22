import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/context/DataContext";
import { IValley } from "@/app/models/IValleys";

export function useHooks() {
    const router = useRouter();
    const [userRole, setUserRole] = useState<string>("encargado cumplimiento");	
    const [currentValley, setCurrentValley] = useState<IValley | null>(null);
    const { valleys, faenas } = useData();

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

    useEffect(() => {
        if (valleys && valleys.length > 0 && !currentValley) {
            const roleBasedId = valleyIdByRole[userRole as keyof typeof valleyIdByRole];
            const defaultValley = valleys.find(v => v.id === roleBasedId) || valleys[0];
            setCurrentValley(defaultValley);
        }
    }, [valleys, userRole, valleyIdByRole, currentValley]);


    const currentValleyName = useMemo(() => {
        if (currentValley) {
            return currentValley.name;
        }
        return valleyNamesByRole[userRole as keyof typeof valleyNamesByRole] || "";
    }, [currentValley, valleyNamesByRole, userRole]);


    const currentValleyId = useMemo(() => {
        if (currentValley) {
            return currentValley.id;
        }
        return valleyIdByRole[userRole as keyof typeof valleyIdByRole] || null;
    }, [currentValley, valleyIdByRole, userRole]);


    const valleysName = valleys?.map((valley) => valley.name) || [];
    const faenasName = faenas?.map((faena) => faena.name) || [];

    
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

    const handleLoginRedirect = (role: string) => {
        setUserRole(role);
        switch (role) {
            case "gerente":
                router.push("/features/resume");
                break;
            case "admin":
                router.push("/features/resume");
                break;
            case "superintendente":
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
            default:
                router.push("/features/documents");
                break;
        }
    };

    const isValleyManager = userRole === "encargado valle elqui" || userRole === "encargado copiapó" || userRole === "encargado huasco";

    return {
        handleLoginRedirect,
        userRole,
        setUserRole,
        currentValley,
        currentValleyName, 
        currentValleyId,
        valleysName,
        faenasName,
        isValleyManager,
        faenas,
        valleys,
        setCurrentValley: handleSetCurrentValley,
    };
}