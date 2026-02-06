import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';

export default function UserProfile() {
  const { user, isAuthenticated } = useAuth0();
  const [imageError, setImageError] = useState(false);

  if (!isAuthenticated || !user) {
    return null;
  }

  // Get user initials for fallback
  const getInitials = () => {
    if (user.name) {
      return user.name
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email?.charAt(0)?.toUpperCase() || 'U';
  };

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {user.name || user.email}
        </div>
        {user.email_verified && (
          <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Verified
          </div>
        )}
      </div>
      <div className="flex items-center justify-center w-10 h-10 overflow-hidden bg-indigo-500 rounded-full">
        {user.picture && !imageError ? (
          <img 
            src={user.picture} 
            alt={user.name || user.email}
            className="object-cover w-full h-full"
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
          />
        ) : (
          <span className="text-sm font-medium text-white">
            {getInitials()}
          </span>
        )}
      </div>
    </div>
  );
}