'use client'
import React, { createContext, useContext } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_FAENAS, GET_ALL_PROCESSES, GET_ALL_VALLEYS } from '@/app/api/tasks';
import { IValley } from '@/app/models/IValleys';
import { IFaena } from '@/app/models/IFaena';
import { IProcess } from '@/app/models/IProcess';

interface DataContextType {
  valleys: IValley[];
  faenas: IFaena[];
  processes: IProcess[];
  loadingValleys: boolean;
  loadingFaenas: boolean;
  loadingProcesses: boolean;
  errorValleys: any;
  errorFaenas: any;
  errorProcesses: any;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const {data: valleyData, loading: loadingValleys, error: errorValleys} = useQuery(GET_ALL_VALLEYS);
  const {data: faenaData, loading: loadingFaenas, error: errorFaenas} = useQuery(GET_ALL_FAENAS);
  const {data: processData, loading: loadingProcesses, error: errorProcesses} = useQuery(GET_ALL_PROCESSES);

  const valleys = valleyData?.valleys || [];
  const faenas = faenaData?.faenas || [];
  const processes = processData?.processes || [];

  return (
    <DataContext.Provider value={{ 
      valleys, 
      faenas, 
      processes,
      loadingValleys, 
      loadingFaenas, 
      loadingProcesses,
      errorValleys, 
      errorFaenas,
      errorProcesses
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};