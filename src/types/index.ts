export interface LogEntry {
  id: string;
  message: string;
  tags: string[];
  category?: string;
  timestamp: Date;
}

export interface LogEntryFormData {
  message: string;
  tags: string[];
  category: string;
}

export interface Statistics {
  totalEntries: number;
  totalTags: number;
  totalCategories: number;
  mostUsedTags: [string, number][];
  mostUsedCategories: [string, number][];
}
