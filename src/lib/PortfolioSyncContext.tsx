'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PortfolioSyncContextType {
  globalImageIndex: number;
  setGlobalImageIndex: (index: number) => void;
}

const PortfolioSyncContext = createContext<PortfolioSyncContextType | undefined>(undefined);

export const usePortfolioSync = () => {
  const context = useContext(PortfolioSyncContext);
  if (context === undefined) {
    throw new Error('usePortfolioSync must be used within a PortfolioSyncProvider');
  }
  return context;
};

interface PortfolioSyncProviderProps {
  children: ReactNode;
}

export const PortfolioSyncProvider: React.FC<PortfolioSyncProviderProps> = ({ children }) => {
  const [globalImageIndex, setGlobalImageIndex] = useState(0);

  // Global auto-advance timer that always runs
  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalImageIndex(prev => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <PortfolioSyncContext.Provider 
      value={{ 
        globalImageIndex, 
        setGlobalImageIndex
      }}
    >
      {children}
    </PortfolioSyncContext.Provider>
  );
};
