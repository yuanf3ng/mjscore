import { useState, useEffect } from 'react';
import { GameRecord } from '../types';
import * as gameService from '../services/gameService';

export function useGames() {
  const [games, setGames] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setLoading(true);
      const data = await gameService.getGames();
      setGames(data);
      setError(null);
    } catch (err) {
      setError('Failed to load games');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addGame = async (gameData: Omit<GameRecord, 'id'>) => {
    try {
      const newGame = await gameService.addGame(gameData);
      setGames(prev => [newGame, ...prev]);
      return newGame;
    } catch (err) {
      setError('Failed to add game');
      throw err;
    }
  };

  const updateGame = async (id: string, gameData: Partial<GameRecord>) => {
    try {
      await gameService.updateGame(id, gameData);
      setGames(prev => prev.map(g => 
        g.id === id ? { ...g, ...gameData } : g
      ));
    } catch (err) {
      setError('Failed to update game');
      throw err;
    }
  };

  const deleteGame = async (id: string) => {
    try {
      await gameService.deleteGame(id);
      setGames(prev => prev.filter(g => g.id !== id));
    } catch (err) {
      setError('Failed to delete game');
      throw err;
    }
  };

  return {
    games,
    loading,
    error,
    addGame,
    updateGame,
    deleteGame,
    refreshGames: loadGames
  };
}