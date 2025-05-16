'use client'
import React, { createContext, useContext } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_FAENAS, GET_ALL_VALLEYS } from '@/app/api/tasks';
import { IValley } from '@/app/models/IValleys';
import { IFaena } from '@/app/models/IFaena';

interface DataContextType {
  valleys: IValley[];
  faenas: IFaena[];
  loadingValleys: boolean;
  loadingFaenas: boolean;
  errorValleys: any;
  errorFaenas: any;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const {data: valleyData, loading: loadingValleys, error: errorValleys} = useQuery(GET_ALL_VALLEYS);
  const {data: faenaData, loading: loadingFaenas, error: errorFaenas} = useQuery(GET_ALL_FAENAS);
  
  const valleys = valleyData?.valleys || [];
  const faenas = faenaData?.faenas || [];

  return (
    <DataContext.Provider value={{ 
      valleys, 
      faenas, 
      loadingValleys, 
      loadingFaenas, 
      errorValleys, 
      errorFaenas 
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