import React, { createContext, useContext, useState } from 'react';

interface ClickContextType {
  clickCount: number;
  incrementClick: () => void;
}

const ClickContext = createContext<ClickContextType | undefined>(undefined);

export const ClickProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clickCount, setClickCount] = useState(0);

  const incrementClick = () => setClickCount((prev) => prev + 1);

  return (
    <ClickContext.Provider value={{ clickCount, incrementClick }}>
      {children}
    </ClickContext.Provider>
  );
};

export const useClickContext = (): ClickContextType => {
  const context = useContext(ClickContext);
  if (!context) throw new Error('useClickContext must be used within a ClickProvider');
  return context;
};
