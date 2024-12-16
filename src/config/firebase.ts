import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { env } from './env';

const app = initializeApp(env.firebase);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);