import { useState } from "react";

export const useHooks = () => {
    const [userRole, setUserRole] = useState<string>("encargado huasco"); 

    return {userRole};
};