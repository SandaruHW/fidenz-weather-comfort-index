import { ArrowPathIcon } from '@heroicons/react/24/outline';

export default function RefreshButton({ onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50"
    >
      <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
      Refresh
    </button>
  );
}