import { useAuth0 } from '@auth0/auth0-react';

export default function AuthenticationButton() {
  const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-8 h-8">
        <div className="w-4 h-4 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <button
        onClick={() => logout({ 
          logoutParams: { 
            returnTo: window.location.origin 
          } 
        })}
        className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
      >
        Sign Out
      </button>
    );
  }

  return (
    <button
      onClick={() => loginWithRedirect()}
      className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
    >
      Sign In
    </button>
  );
}