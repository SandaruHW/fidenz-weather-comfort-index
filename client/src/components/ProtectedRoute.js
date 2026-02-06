import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, loginWithRedirect, error } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 border-b-2 border-indigo-600 dark:border-indigo-400 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Authenticating...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="p-6 text-center bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 rounded-lg shadow-sm dark:shadow-gray-700/30 max-w-md">
          <div className="w-12 h-12 mx-auto mb-4 text-red-500 dark:text-red-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Authentication Error</h3>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{error.message}</p>
          <button
            onClick={() => loginWithRedirect()}
            className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="p-8 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-gray-700/30 max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 text-indigo-500 dark:text-indigo-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Authentication Required</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">Please sign in to access the Weather Comfort Dashboard</p>
          <button
            onClick={() => loginWithRedirect()}
            className="px-6 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return children;
}