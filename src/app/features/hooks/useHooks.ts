import { useState } from "react";

export const useHooks = () => {
    const [userRole, setUserRole] = useState<string>("gerente"); 

    return {userRole};
};