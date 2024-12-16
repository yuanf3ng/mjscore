import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { GameRecord } from '../types';

const COLLECTION_NAME = 'games';
const gamesCollection = collection(db, COLLECTION_NAME);

export const getGames = async (): Promise<GameRecord[]> => {
  const q = query(gamesCollection, orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as GameRecord));
};

export const addGame = async (game: Omit<GameRecord, 'id'>): Promise<GameRecord> => {
  const docRef = await addDoc(gamesCollection, game);
  return {
    id: docRef.id,
    ...game
  };
};

export const updateGame = async (id: string, game: Partial<GameRecord>): Promise<void> => {
  const gameRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(gameRef, game);
};

export const deleteGame = async (id: string): Promise<void> => {
  const gameRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(gameRef);
};