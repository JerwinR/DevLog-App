import { useLogs } from '@/context/LogContext';
import EntryCard from '@/components/EntryCard';
import { format } from 'date-fns';

export default function Home() {
  const { entries, deleteEntry } = useLogs();
  const sortedEntries = [...entries].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  if (sortedEntries.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          No entries yet
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Start tracking your development journey by adding your first entry!
        </p>
      </div>
    );
  }

  // Group entries by date
  const entriesByDate = sortedEntries.reduce((acc, entry) => {
    const dateKey = format(entry.timestamp, 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(entry);
    return acc;
  }, {} as Record<string, typeof sortedEntries>);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Your Entries
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {sortedEntries.length} {sortedEntries.length === 1 ? 'entry' : 'entries'}
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(entriesByDate).map(([date, dateEntries]) => (
          <div key={date}>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              {format(new Date(date), 'EEEE, MMMM d, yyyy')}
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {dateEntries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} onDelete={deleteEntry} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
