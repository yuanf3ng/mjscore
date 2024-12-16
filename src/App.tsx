import React, { useState, useEffect } from 'react';
import { Trophy, Users, BarChart2 } from 'lucide-react';
import PlayerManagement from './components/PlayerManagement';
import GameForm from './components/GameForm';
import Statistics from './components/Statistics';
import DataManagement from './components/DataManagement';
import { Toast } from './components/Toast';
import { usePlayers } from './hooks/usePlayers';
import { useGames } from './hooks/useGames';

function App() {
  const { 
    players, 
    loading: playersLoading, 
    error: playersError,
    addPlayer,
    updatePlayer,
    deletePlayer 
  } = usePlayers();

  const {
    games,
    loading: gamesLoading,
    error: gamesError,
    addGame,
    updateGame,
    deleteGame
  } = useGames();

  const [activeTab, setActiveTab] = useState<'players' | 'game' | 'stats'>('players');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  useEffect(() => {
    const handleToast = (event: CustomEvent<{ message: string; type: 'success' | 'error' | 'warning' }>) => {
      setToast(event.detail);
      setTimeout(() => setToast(null), 3000);
    };

    window.addEventListener('showToast', handleToast as EventListener);
    return () => window.removeEventListener('showToast', handleToast as EventListener);
  }, []);

  if (playersError || gamesError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">
          {playersError || gamesError}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Mahjong Score Tracker</h1>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setActiveTab('players')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                activeTab === 'players' ? 'bg-blue-500 text-white' : 'bg-white'
              }`}
            >
              <Users size={20} />
              Players
            </button>
            <button
              onClick={() => setActiveTab('game')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                activeTab === 'game' ? 'bg-blue-500 text-white' : 'bg-white'
              }`}
            >
              <Trophy size={20} />
              New Game
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                activeTab === 'stats' ? 'bg-blue-500 text-white' : 'bg-white'
              }`}
            >
              <BarChart2 size={20} />
              Statistics
            </button>
            <div className="flex-1" />
            <DataManagement />
          </div>
        </header>

        <main className="bg-white rounded-lg shadow-lg p-6">
          {(playersLoading || gamesLoading) ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : (
            <>
              {activeTab === 'players' && (
                <PlayerManagement
                  players={players}
                  onAddPlayer={addPlayer}
                  onEditPlayer={updatePlayer}
                  onDeletePlayer={deletePlayer}
                />
              )}
              {activeTab === 'game' && (
                <GameForm
                  players={players}
                  games={games}
                  onSaveGame={addGame}
                  onUpdateGame={updateGame}
                  onDeleteGame={deleteGame}
                />
              )}
              {activeTab === 'stats' && (
                <Statistics
                  players={players}
                  games={games}
                />
              )}
            </>
          )}
        </main>
      </div>
      {toast && (
        <Toast 
          message={toast.message}
          type={toast.type}
        />
      )}
    </div>
  );
}

export default App;