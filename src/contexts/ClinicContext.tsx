import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Clinic {
  id: string | null;
  name: string | null;
}

interface ClinicContextProps {
  clinic: Clinic;
  registerClinic: (clinic: Clinic) => void;
}

const ClinicContext = createContext<ClinicContextProps | undefined>(undefined);

export const ClinicProvider = ({ children }: { children: ReactNode }) => {
  const [clinic, setClinic] = useState<Clinic>({ id: null, name: null });

  const registerClinic = (newClinic: Clinic) => {
    setClinic(newClinic);
  };

  return (
    <ClinicContext.Provider value={{ clinic, registerClinic }}>
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
