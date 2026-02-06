import {
  collection,
  doc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type { BingoCard, BingoCell, PerformedSong } from "../types";

const BINGO_CARDS_COLLECTION = "bingoCards";
const PERFORMED_SONGS_COLLECTION = "performedSongs";

export const saveBingoCard = async (
  userId: string,
  cells: BingoCell[]
): Promise<string> => {
  const existingCard = await getUserBingoCard(userId);

  if (existingCard) {
    const cardRef = doc(db, BINGO_CARDS_COLLECTION, existingCard.id);
    await updateDoc(cardRef, {
      cells,
      updatedAt: serverTimestamp(),
    });
    return existingCard.id;
  } else {
    const cardRef = doc(collection(db, BINGO_CARDS_COLLECTION));
    await setDoc(cardRef, {
      userId,
      cells,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return cardRef.id;
  }
};

export const getUserBingoCard = async (
  userId: string
): Promise<BingoCard | null> => {
  const q = query(
    collection(db, BINGO_CARDS_COLLECTION),
    where("userId", "==", userId)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
  const data = doc.data();

  return {
    id: doc.id,
    userId: data.userId,
    cells: data.cells,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
};

export const getPerformedSongs = async (): Promise<PerformedSong[]> => {
  const querySnapshot = await getDocs(
    collection(db, PERFORMED_SONGS_COLLECTION)
  );
  return querySnapshot.docs.map((doc) => doc.data() as PerformedSong);
};

export const addPerformedSong = async (
  songId: string,
  day: 1 | 2
): Promise<void> => {
  const songRef = doc(db, PERFORMED_SONGS_COLLECTION, songId);
  await setDoc(songRef, { songId, day });
};

export const removePerformedSong = async (songId: string): Promise<void> => {
  try {
    const songRef = doc(db, PERFORMED_SONGS_COLLECTION, songId);
    await deleteDoc(songRef);
  } catch (error) {
    console.error("Error removing performed song:", error);
    throw error;
  }
};
