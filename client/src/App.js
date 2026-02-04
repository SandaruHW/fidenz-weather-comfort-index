import { useState } from 'react';
import SkyScoreDashboard from './components/SkyScoreDashboard';
import RefreshButton from './components/RefreshButton';
import AuthenticationButton from './components/AuthenticationButton';
import UserProfile from './components/UserProfile';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="p-8 text-4xl font-bold text-center">Weather Comfort Dashboard</h1>
      <p className="text-center text-gray-600">Testing - this should be visible!</p>
    </div>
  );
}

export default App;