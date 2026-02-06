import { useState, useMemo } from "react";
import { X, Search } from "lucide-react";
import type { Song } from "../types";
import { SONGS, UNITS, ALL_MEMBERS, RELEASE_YEARS } from "../data/songs";

interface SongSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSong: (song: Song) => void;
  excludeSongIds: Set<string>;
}

type SortBy = "alphabetJp" | "alphabetRomaji" | "year";

export const SongSelectorModal = ({
  isOpen,
  onClose,
  onSelectSong,
  excludeSongIds,
}: SongSelectorModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUnits, setSelectedUnits] = useState<Set<string>>(new Set());
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    new Set()
  );
  const [selectedYears, setSelectedYears] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState<SortBy>("alphabetJp");

  const filteredAndSortedSongs = useMemo(() => {
    let filtered = SONGS.filter((song) => !excludeSongIds.has(song.id));

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (song) =>
          song.title.jp.toLowerCase().includes(query) ||
          song.title.romaji.toLowerCase().includes(query)
      );
    }

    if (selectedUnits.size > 0) {
      filtered = filtered.filter((song) =>
        song.units.some((unit) => selectedUnits.has(unit))
      );
    }

    if (selectedMembers.size > 0) {
      filtered = filtered.filter((song) =>
        song.members.some((member) => selectedMembers.has(member))
      );
    }

    if (selectedYears.size > 0) {
      filtered = filtered.filter((song) => selectedYears.has(song.releaseYear));
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "alphabetJp":
          return a.title.jp.localeCompare(b.title.jp, "ja");
        case "alphabetRomaji":
          return a.title.romaji.localeCompare(b.title.romaji);
        case "year":
          return b.releaseYear - a.releaseYear;
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    searchQuery,
    selectedUnits,
    selectedMembers,
    selectedYears,
    sortBy,
    excludeSongIds,
  ]);

  const toggleUnit = (unit: string) => {
    const newSet = new Set(selectedUnits);
    if (newSet.has(unit)) {
      newSet.delete(unit);
    } else {
      newSet.add(unit);
    }
    setSelectedUnits(newSet);
  };

  const toggleMember = (member: string) => {
    const newSet = new Set(selectedMembers);
    if (newSet.has(member)) {
      newSet.delete(member);
    } else {
      newSet.add(member);
    }
    setSelectedMembers(newSet);
  };

  const toggleYear = (year: number) => {
    const newSet = new Set(selectedYears);
    if (newSet.has(year)) {
      newSet.delete(year);
    } else {
      newSet.add(year);
    }
    setSelectedYears(newSet);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedUnits(new Set());
    setSelectedMembers(new Set());
    setSelectedYears(new Set());
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-liella-pink to-liella-purple text-white">
          <h2 className="text-xl font-bold">楽曲を選択 / Select Song</h2>
          <button onClick={onClose} className="p-1 hover:bg-red-500 rounded">
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b bg-gray-50">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="楽曲名で検索 (日本語・ローマ字) / Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-liella-pink"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b bg-gray-50 overflow-y-auto max-h-48 min-h-36">
          <div className="mb-3">
            <h3 className="text-sm font-semibold mb-2">ユニット / Unit</h3>
            <div className="flex flex-wrap gap-2">
              {UNITS.map((unit) => (
                <button
                  key={unit}
                  onClick={() => toggleUnit(unit)}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    selectedUnits.has(unit)
                      ? "bg-liella-pink text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <h3 className="text-sm font-semibold mb-2">メンバー / Members</h3>
            <div className="flex flex-wrap gap-2">
              {ALL_MEMBERS.map((member) => (
                <button
                  key={member}
                  onClick={() => toggleMember(member)}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    selectedMembers.has(member)
                      ? "bg-liella-blue text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {member}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <h3 className="text-sm font-semibold mb-2">年 / Year</h3>
            <div className="flex flex-wrap gap-2">
              {RELEASE_YEARS.map((year) => (
                <button
                  key={year}
                  onClick={() => toggleYear(year)}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    selectedYears.has(year)
                      ? "bg-liella-purple text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={clearFilters}
            className="text-sm text-liella-pink hover:underline"
          >
            フィルターをクリア / Clear Filters
          </button>
        </div>

        {/* Sort */}
        <div className="px-4 py-2 border-b bg-gray-50 flex items-center gap-4">
          <span className="text-sm font-semibold">並び替え / Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-liella-pink text-sm"
          >
            <option value="alphabetJp">あいうえお順 (Japanese)</option>
            <option value="alphabetRomaji">ABC順 (Romaji)</option>
            <option value="year">年順 (Year)</option>
          </select>
          <span className="text-sm text-gray-500 ml-auto">
            {filteredAndSortedSongs.length} 曲 / songs
          </span>
        </div>

        {/* Song List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredAndSortedSongs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              楽曲が見つかりませんでした / No songs found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredAndSortedSongs.map((song) => (
                <button
                  key={song.id}
                  onClick={() => {
                    onSelectSong(song);
                    onClose();
                  }}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-liella-pink hover:bg-opacity-10 hover:border-liella-pink transition text-left"
                >
                  <img
                    src={song.coverUrl}
                    alt={song.title.jp}
                    className="w-16 h-16 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">
                      {song.title.jp}
                    </div>
                    <div className="text-xs text-gray-600 truncate">
                      {song.title.romaji}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {song.releaseYear} • {song.units.join(", ")}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
