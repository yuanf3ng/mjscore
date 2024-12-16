import { useState, useEffect } from 'react';
import { Player } from '../types';
import * as playerService from '../services/playerService';

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      setLoading(true);
      const data = await playerService.getPlayers();
      setPlayers(data);
      setError(null);
    } catch (err) {
      setError('Failed to load players');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addPlayer = async (name: string) => {
    try {
      const newPlayer = await playerService.addPlayer(name);
      setPlayers(prev => [newPlayer, ...prev]);
      return newPlayer;
    } catch (err) {
      setError('Failed to add player');
      throw err;
    }
  };

  const updatePlayer = async (id: string, name: string) => {
    try {
      await playerService.updatePlayer(id, name);
      setPlayers(prev => prev.map(p => 
        p.id === id ? { ...p, name } : p
      ));
    } catch (err) {
      setError('Failed to update player');
      throw err;
    }
  };

  const deletePlayer = async (id: string) => {
    try {
      await playerService.deletePlayer(id);
      setPlayers(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError('Failed to delete player');
      throw err;
    }
  };

  return {
    players,
    loading,
    error,
    addPlayer,
    updatePlayer,
    deletePlayer,
    refreshPlayers: loadPlayers
  };
}