import { collection, writeBatch, doc, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Player, GameRecord } from '../types';
import { showToast } from '../lib/toast';

interface ExportData {
  players: Player[];
  games: GameRecord[];
  version: string;
  exportDate: string;
}

const CURRENT_VERSION = '1.0.0';

export const exportToFile = async () => {
  try {
    const [playersSnapshot, gamesSnapshot] = await Promise.all([
      getDocs(collection(db, 'players')),
      getDocs(collection(db, 'games'))
    ]);

    const data: ExportData = {
      version: CURRENT_VERSION,
      exportDate: new Date().toISOString(),
      players: playersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Player)),
      games: gamesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as GameRecord))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mahjong-backup-${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToast('Data exported successfully!');
  } catch (error) {
    console.error('Export error:', error);
    showToast('Failed to export data', 'error');
    throw error;
  }
};

export const importFromFile = async (file: File): Promise<void> => {
  try {
    const text = await file.text();
    const data: ExportData = JSON.parse(text);

    // Validate data structure
    if (!data.version || !data.players || !data.games) {
      throw new Error('Invalid data format');
    }

    const batch = writeBatch(db);

    // Clear existing data
    const [existingPlayers, existingGames] = await Promise.all([
      getDocs(collection(db, 'players')),
      getDocs(collection(db, 'games'))
    ]);

    existingPlayers.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    existingGames.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Import players
    const playersRef = collection(db, 'players');
    data.players.forEach((player: Player) => {
      const docRef = doc(playersRef);
      batch.set(docRef, {
        name: player.name,
        createdAt: player.createdAt
      });
    });

    // Import games
    const gamesRef = collection(db, 'games');
    data.games.forEach((game: GameRecord) => {
      const docRef = doc(gamesRef);
      batch.set(docRef, {
        date: game.date,
        players: game.players,
        scores: game.scores,
        winnerId: game.winnerId
      });
    });

    await batch.commit();
    showToast('Data imported successfully!');
  } catch (error) {
    console.error('Import error:', error);
    showToast('Failed to import data', 'error');
    throw error;
  }
};