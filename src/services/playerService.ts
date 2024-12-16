import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Player } from '../types';

const COLLECTION_NAME = 'players';
const playersCollection = collection(db, COLLECTION_NAME);

export const getPlayers = async (): Promise<Player[]> => {
  const q = query(playersCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Player));
};

export const addPlayer = async (name: string): Promise<Player> => {
  const player: Omit<Player, 'id'> = {
    name,
    createdAt: new Date().toISOString(),
  };
  
  const docRef = await addDoc(playersCollection, player);
  return {
    id: docRef.id,
    ...player
  };
};

export const updatePlayer = async (id: string, name: string): Promise<void> => {
  const playerRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(playerRef, { name });
};

export const deletePlayer = async (id: string): Promise<void> => {
  const playerRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(playerRef);
};