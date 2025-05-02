import { useState } from "react";
import { useRouter } from "next/navigation";

export function useHooks () {
    const router = useRouter();

    const [userRole, setUserRole] = useState<string>("encargado cumplimiento"); 

    const handleLoginRedirect = (role: string) => {
        setUserRole(role);
        switch (role) {
            case "gerente":
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
    }

    return {
        userRole,
        handleLoginRedirect
    };
};