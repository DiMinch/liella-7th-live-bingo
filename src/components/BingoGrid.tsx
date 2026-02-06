import { useState } from "react";
import { useBingoStore } from "../hooks/useBingoStore";
import { SongSelectorModal } from "./SongSelectorModal";
import { SONGS, LIVE_7TH_LOGO_URL } from "../data/songs";
import type { Song } from "../types";
import { X } from "lucide-react";

export const BingoGrid = () => {
  const { cells, selectSong, clearCell, selectedSongs } = useBingoStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCellIndex, setSelectedCellIndex] = useState<number | null>(
    null
  );

  const handleCellClick = (index: number) => {
    if (cells[index].isFreeSpace) return;
    setSelectedCellIndex(index);
    setIsModalOpen(true);
  };

  const handleSelectSong = (song: Song) => {
    if (selectedCellIndex !== null) {
      selectSong(selectedCellIndex, song.id);
    }
  };

  const handleClearCell = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    clearCell(index);
  };

  const getSongById = (songId: string | null) => {
    if (!songId) return null;
    return SONGS.find((s) => s.id === songId);
  };

  if (cells.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-5 gap-2 max-w-3xl mx-auto">
        {cells.map((cell, index) => {
          const song = getSongById(cell.songId);

          return (
            <div
              key={index}
              onClick={() => handleCellClick(index)}
              className={`
                aspect-square border-2 rounded-lg overflow-hidden cursor-pointer
                transition-all duration-200 relative group
                ${
                  cell.isFreeSpace
                    ? "bg-gradient-to-br from-liella-pink to-liella-purple border-liella-pink"
                    : song
                    ? "border-liella-blue hover:border-liella-pink hover:scale-105"
                    : "border-gray-300 hover:border-liella-pink hover:bg-gray-50"
                }
              `}
            >
              {cell.isFreeSpace ? (
                <div className="w-full h-full flex items-center justify-center p-2">
                  <img
                    src={LIVE_7TH_LOGO_URL}
                    alt="7th Live"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : song ? (
                <>
                  <img
                    src={song.coverUrl}
                    alt={song.title.jp}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <div className="text-white text-xs font-semibold leading-tight line-clamp-2">
                      {song.title.jp}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleClearCell(index, e)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  <div className="text-center px-2">
                    <div>+</div>
                    <div className="text-xs mt-1">選択</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <SongSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectSong={handleSelectSong}
        excludeSongIds={selectedSongs}
      />
    </>
  );
};
