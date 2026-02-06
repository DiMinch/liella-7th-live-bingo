import { create } from "zustand";
import type { BingoCell } from "../types";

interface BingoStore {
  cells: BingoCell[];
  selectedSongs: Set<string>;
  initializeBingo: () => void;
  selectSong: (cellIndex: number, songId: string) => void;
  clearCell: (cellIndex: number) => void;
  getSongIdAtCell: (cellIndex: number) => string | null;
  isSongSelected: (songId: string) => boolean;
  isBingoComplete: () => boolean;
}

const GRID_SIZE = 25;
const FREE_SPACE_INDEX = 12; // Center of 5x5 grid

export const useBingoStore = create<BingoStore>((set, get) => ({
  cells: [],
  selectedSongs: new Set(),

  initializeBingo: () => {
    const cells: BingoCell[] = Array(GRID_SIZE)
      .fill(null)
      .map((_, index) => ({
        songId: null,
        isFreeSpace: index === FREE_SPACE_INDEX,
      }));

    set({ cells, selectedSongs: new Set() });
  },

  selectSong: (cellIndex: number, songId: string) => {
    const { cells, selectedSongs } = get();

    if (cellIndex < 0 || cellIndex >= GRID_SIZE) return;
    if (cells[cellIndex].isFreeSpace) return;

    const oldSongId = cells[cellIndex].songId;
    if (oldSongId) {
      selectedSongs.delete(oldSongId);
    }

    const newCells = [...cells];
    newCells[cellIndex] = { ...newCells[cellIndex], songId };

    const newSelectedSongs = new Set(selectedSongs);
    newSelectedSongs.add(songId);

    set({ cells: newCells, selectedSongs: newSelectedSongs });
  },

  clearCell: (cellIndex: number) => {
    const { cells, selectedSongs } = get();

    if (cellIndex < 0 || cellIndex >= GRID_SIZE) return;
    if (cells[cellIndex].isFreeSpace) return;

    const songId = cells[cellIndex].songId;
    if (songId) {
      selectedSongs.delete(songId);
    }

    const newCells = [...cells];
    newCells[cellIndex] = { ...newCells[cellIndex], songId: null };

    set({ cells: newCells, selectedSongs: new Set(selectedSongs) });
  },

  getSongIdAtCell: (cellIndex: number) => {
    const { cells } = get();
    return cells[cellIndex]?.songId || null;
  },

  isSongSelected: (songId: string) => {
    const { selectedSongs } = get();
    return selectedSongs.has(songId);
  },

  isBingoComplete: () => {
    const { cells } = get();
    return cells.every((cell) => cell.isFreeSpace || cell.songId !== null);
  },
}));
