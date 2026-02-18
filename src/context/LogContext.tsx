import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LogEntry } from '@/types';
import { storage } from '@/utils/storage';

interface LogContextType {
  entries: LogEntry[];
  addEntry: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  deleteEntry: (id: string) => void;
  updateEntry: (id: string, updates: Partial<LogEntry>) => void;
  refreshEntries: () => void;
}

const LogContext = createContext<LogContextType | undefined>(undefined);

export const LogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<LogEntry[]>([]);

  const refreshEntries = () => {
    setEntries(storage.getEntries());
  };

  useEffect(() => {
    refreshEntries();
  }, []);

  const addEntry = (entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    storage.addEntry(entry);
    refreshEntries();
  };

  const deleteEntry = (id: string) => {
    storage.deleteEntry(id);
    refreshEntries();
  };

  const updateEntry = (id: string, updates: Partial<LogEntry>) => {
    storage.updateEntry(id, updates);
    refreshEntries();
  };

  return (
    <LogContext.Provider
      value={{
        entries,
        addEntry,
        deleteEntry,
        updateEntry,
        refreshEntries,
      }}
    >
      {children}
    </LogContext.Provider>
  );
};

export const useLogs = () => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error('useLogs must be used within a LogProvider');
  }
  return context;
};
