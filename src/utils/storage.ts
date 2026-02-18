import { LogEntry, Statistics } from '@/types';
import { SecureStorage, generateSecureId } from './security';
import { validateEntryId, validateTimestamp, validateTags, validateAndSanitizeText, validateAndSanitizeCategory } from './validation';

const STORAGE_KEY = 'entries';

export const storage = {
  getEntries(): LogEntry[] {
    try {
      const stored = SecureStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      
      // Validate data structure
      if (!Array.isArray(parsed)) {
        throw new Error('Invalid data format');
      }

      // Validate and sanitize each entry
      return parsed.map((entry: unknown) => {
        if (typeof entry !== 'object' || entry === null) {
          throw new Error('Invalid entry format');
        }

        const e = entry as Record<string, unknown>;

        // Validate required fields
        if (typeof e.id !== 'string' || typeof e.message !== 'string') {
          throw new Error('Missing required fields');
        }

        return {
          id: validateEntryId(e.id),
          message: validateAndSanitizeText(e.message),
          tags: Array.isArray(e.tags) ? validateTags(e.tags) : [],
          category: e.category ? validateAndSanitizeCategory(e.category) : undefined,
          timestamp: validateTimestamp(e.timestamp),
        };
      });
    } catch (error) {
      // Log error but don't expose details to prevent information leakage
      console.error('Failed to load entries');
      // Clear corrupted data
      SecureStorage.removeItem(STORAGE_KEY);
      return [];
    }
  },

  saveEntries(entries: LogEntry[]): void {
    try {
      // Validate all entries before saving
      const validatedEntries = entries.map(entry => ({
        id: validateEntryId(entry.id),
        message: validateAndSanitizeText(entry.message),
        tags: validateTags(entry.tags),
        category: entry.category ? validateAndSanitizeCategory(entry.category) : undefined,
        timestamp: validateTimestamp(entry.timestamp).toISOString(),
      }));

      const serialized = JSON.stringify(validatedEntries);
      SecureStorage.setItem(STORAGE_KEY, serialized);
    } catch (error) {
      console.error('Failed to save entries:', error);
      throw error;
    }
  },

  addEntry(entry: Omit<LogEntry, 'id' | 'timestamp'>): LogEntry {
    // Validate input
    const validatedEntry = {
      message: validateAndSanitizeText(entry.message),
      tags: validateTags(entry.tags),
      category: entry.category ? validateAndSanitizeCategory(entry.category) : undefined,
    };

    const entries = this.getEntries();
    
    // Check storage limits (prevent DoS)
    if (entries.length >= 10000) {
      throw new Error('Maximum number of entries reached');
    }

    // Use secure ID generation
    const id = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID()
      : generateSecureId();

    const newEntry: LogEntry = {
      ...validatedEntry,
      id,
      timestamp: new Date(),
    };
    
    entries.push(newEntry);
    this.saveEntries(entries);
    return newEntry;
  },

  deleteEntry(id: string): void {
    const validatedId = validateEntryId(id);
    const entries = this.getEntries();
    const filtered = entries.filter((entry) => entry.id !== validatedId);
    this.saveEntries(filtered);
  },

  updateEntry(id: string, updates: Partial<LogEntry>): void {
    const validatedId = validateEntryId(id);
    const entries = this.getEntries();
    const index = entries.findIndex((entry) => entry.id === validatedId);
    
    if (index === -1) {
      throw new Error('Entry not found');
    }

    // Validate updates
    const validatedUpdates: Partial<LogEntry> = {};
    if (updates.message !== undefined) {
      validatedUpdates.message = validateAndSanitizeText(updates.message);
    }
    if (updates.tags !== undefined) {
      validatedUpdates.tags = validateTags(updates.tags);
    }
    if (updates.category !== undefined) {
      validatedUpdates.category = updates.category ? validateAndSanitizeCategory(updates.category) : undefined;
    }

    entries[index] = { ...entries[index], ...validatedUpdates };
    this.saveEntries(entries);
  },

  getStatistics(): Statistics {
    const entries = this.getEntries();
    const tagCounts: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};

    entries.forEach((entry) => {
      entry.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
      if (entry.category) {
        categoryCounts[entry.category] = (categoryCounts[entry.category] || 0) + 1;
      }
    });

    const mostUsedTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10) as [string, number][];

    const mostUsedCategories = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10) as [string, number][];

    return {
      totalEntries: entries.length,
      totalTags: Object.keys(tagCounts).length,
      totalCategories: Object.keys(categoryCounts).length,
      mostUsedTags,
      mostUsedCategories,
    };
  },
};
