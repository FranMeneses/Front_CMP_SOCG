import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/context/DataContext";

export function useHooks() {
    const router = useRouter();
    const [userRole, setUserRole] = useState<string>("encargado cumplimiento");
    const { valleys } = useData();

    const valleyIdByRole = useMemo(() => {
        return {
            "encargado valle elqui": valleys?.find(v => v.name === "Valle del Elqui")?.id || 3,
            "encargado copiapó": valleys?.find(v => v.name === "Valle de Copiapó")?.id || 1,
            "encargado huasco": valleys?.find(v => v.name === "Valle del Huasco")?.id || 2,
            "Admin": valleys?.find(v => v.name === "Valle de Copiapó")?.id || 1,
        };
    }, [valleys]);

    const valleyNamesByRole = useMemo(() => {
        return {
            "encargado valle elqui": valleys?.find(v => v.name === "Valle del Elqui")?.name || "Valle del Elqui",
            "encargado copiapó": valleys?.find(v => v.name === "Valle de Copiapó")?.name || "Valle de Copiapó",
            "encargado huasco": valleys?.find(v => v.name === "Valle del Huasco")?.name || "Valle del Huasco",
        };
    }
    , [valleys]);

    const currentValleyName = useMemo(() => {
        return valleyNamesByRole[userRole as keyof typeof valleyNamesByRole] || null;
    }
    , [valleyNamesByRole, userRole]);

    const currentValleyId = useMemo(() => {
        return valleyIdByRole[userRole as keyof typeof valleyIdByRole] || null;
    }, [valleyIdByRole, userRole]);

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

    return {
        handleLoginRedirect,
        userRole,
        currentValleyName,
        currentValleyId 
    };
}