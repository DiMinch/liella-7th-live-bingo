import type { BingoCell } from "../types";

export const calculateBingoLines = (
  cells: BingoCell[],
  performedSongIds: string[]
): number => {
  const performedSet = new Set(performedSongIds);
  let lines = 0;

  const isMarked = (cell: BingoCell): boolean => {
    return (
      cell.isFreeSpace ||
      (cell.songId !== null && performedSet.has(cell.songId))
    );
  };

  // Check horizontal lines
  for (let row = 0; row < 5; row++) {
    const start = row * 5;
    if (cells.slice(start, start + 5).every(isMarked)) {
      lines++;
    }
  }

  // Check vertical lines
  for (let col = 0; col < 5; col++) {
    const column = [0, 1, 2, 3, 4].map((row) => cells[row * 5 + col]);
    if (column.every(isMarked)) {
      lines++;
    }
  }

  // Check diagonal (top-left to bottom-right)
  const diagonal1 = [0, 6, 12, 18, 24].map((i) => cells[i]);
  if (diagonal1.every(isMarked)) {
    lines++;
  }

  // Check diagonal (top-right to bottom-left)
  const diagonal2 = [4, 8, 12, 16, 20].map((i) => cells[i]);
  if (diagonal2.every(isMarked)) {
    lines++;
  }

  return lines;
};

export const getMatchedSongs = (
  cells: BingoCell[],
  performedSongIds: string[]
): string[] => {
  const performedSet = new Set(performedSongIds);
  return cells
    .filter((cell) => cell.songId !== null && performedSet.has(cell.songId))
    .map((cell) => cell.songId!);
};
