export type Unit =
  | "Liella!"
  | "CatChu"
  | "KALEIDOSCORE"
  | "5yncri5e!"
  | "Gen1"
  | "Gen2"
  | "Gen3"
  | "Others";

export type Member = string;

export interface Song {
  id: string;
  title: {
    jp: string;
    romaji: string;
  };
  coverUrl: string;
  releaseYear: number;
  units: Unit[];
  members: Member[];
}

export interface BingoCell {
  songId: string | null;
  isFreeSpace: boolean;
}

export interface BingoCard {
  id: string;
  userId: string;
  cells: BingoCell[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface PerformedSong {
  songId: string;
  day: 1 | 2;
}
