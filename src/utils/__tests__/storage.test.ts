import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storage } from '../storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('saves and retrieves entries', () => {
    const entry = storage.addEntry({
      message: 'Test message',
      tags: ['test'],
      category: 'work',
    });

    const entries = storage.getEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0].message).toBe('Test message');
    expect(entries[0].id).toBe(entry.id);
  });

  it('deletes an entry', () => {
    const entry = storage.addEntry({
      message: 'Test message',
      tags: [],
    });

    storage.deleteEntry(entry.id);
    const entries = storage.getEntries();
    expect(entries).toHaveLength(0);
  });

  it('updates an entry', () => {
    const entry = storage.addEntry({
      message: 'Test message',
      tags: [],
    });

    storage.updateEntry(entry.id, { message: 'Updated message' });
    const entries = storage.getEntries();
    expect(entries[0].message).toBe('Updated message');
  });

  it('calculates statistics correctly', () => {
    storage.addEntry({ message: 'Entry 1', tags: ['react'], category: 'work' });
    storage.addEntry({ message: 'Entry 2', tags: ['react', 'typescript'], category: 'work' });
    storage.addEntry({ message: 'Entry 3', tags: ['vue'], category: 'personal' });

    const stats = storage.getStatistics();
    expect(stats.totalEntries).toBe(3);
    expect(stats.totalTags).toBe(3);
    expect(stats.totalCategories).toBe(2);
    expect(stats.mostUsedTags[0][0]).toBe('react');
    expect(stats.mostUsedTags[0][1]).toBe(2);
  });
});
