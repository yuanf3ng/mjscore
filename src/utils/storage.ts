import { getFirestore, collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Player, GameRecord } from '../types';

export const exportData = async () => {
  const playersSnapshot = await getDocs(collection(db, 'players'));
  const gamesSnapshot = await getDocs(collection(db, 'games'));

  const data = {
    players: playersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    games: gamesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
  };

  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mahjong-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importData = async (file: File) => {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    const batch = writeBatch(db);

    // Import players
    const playersRef = collection(db, 'players');
    data.players.forEach((player: Player) => {
      const docRef = doc(playersRef);
      batch.set(docRef, {
        name: player.name,
        createdAt: player.createdAt,
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
        winnerId: game.winnerId,
      });
    });

    await batch.commit();

    const event = new CustomEvent('showToast', {
      detail: {
        message: 'Data imported successfully!',
        type: 'success'
      }
    });
    window.dispatchEvent(event);
  } catch (error) {
    console.error('Error importing data:', error);
    const event = new CustomEvent('showToast', {
      detail: {
        message: 'Failed to import data',
        type: 'error'
      }
    });
    window.dispatchEvent(event);
    throw error;
  }
};