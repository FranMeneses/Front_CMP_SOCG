import { ICompliance } from "@/app/models/ICompliance";

export const useComplianceTable = () => {

const handleRemainingDays = (compliance: ICompliance): number => {
    const startDate = new Date(compliance.registries[0].startDate);
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 35);
    
    const today = new Date();
    const timeDiff = endDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return daysDiff >= 0 ? daysDiff : 0;
}

    return {
        handleRemainingDays,
    };
}