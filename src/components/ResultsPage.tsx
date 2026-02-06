import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getUserBingoCard, getPerformedSongs } from "../lib/firestore";
import type { BingoCard, PerformedSong } from "../types";
import { calculateBingoLines, getMatchedSongs } from "../utils/bingoUtils";
import { SONGS, LIVE_7TH_LOGO_URL } from "../data/songs";
import { Trophy, Home } from "lucide-react";

export const ResultsPage = () => {
  const { user } = useAuth();
  const [bingoCard, setBingoCard] = useState<BingoCard | null>(null);
  const [performedSongs, setPerformedSongs] = useState<PerformedSong[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const [card, songs] = await Promise.all([
        getUserBingoCard(user.uid),
        getPerformedSongs(),
      ]);

      setBingoCard(card);
      setPerformedSongs(songs);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-liella-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">ログインが必要です</h2>
          <p className="text-gray-600 mb-4">
            結果を見るにはログインしてください
          </p>
          <p className="text-sm text-gray-500">Please login to view results</p>
        </div>
      </div>
    );
  }

  if (!bingoCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">
            ビンゴカードが見つかりません
          </h2>
          <p className="text-gray-600 mb-4">
            まだビンゴカードを作成していないようです
          </p>
          <p className="text-sm text-gray-500 mb-6">
            No bingo card found. Please create one first.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-liella-pink to-liella-purple text-white rounded-lg hover:shadow-lg transition"
          >
            <Home size={20} />
            ホームへ / Go Home
          </a>
        </div>
      </div>
    );
  }

  const performedSongIds = performedSongs.map((ps) => ps.songId);
  const matchedSongs = getMatchedSongs(bingoCard.cells, performedSongIds);
  const bingoLines = calculateBingoLines(bingoCard.cells, performedSongIds);
  const matchedCount = matchedSongs.length;
  const totalCells = bingoCard.cells.filter((c) => !c.isFreeSpace).length;

  const getSongById = (songId: string | null) => {
    if (!songId) return null;
    return SONGS.find((s) => s.id === songId);
  };

  const isCellMatched = (cellIndex: number): boolean => {
    const cell = bingoCard.cells[cellIndex];
    if (cell.isFreeSpace) return true;
    if (!cell.songId) return false;
    return performedSongIds.includes(cell.songId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-liella-pink">
              結果 / Results
            </h1>
            <a
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition text-sm"
            >
              <Home size={16} />
              ホーム
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <div className="text-center mb-6">
            <Trophy className="mx-auto mb-4 text-yellow-500" size={64} />
            <h2 className="text-3xl font-bold mb-2">あなたのスコア</h2>
            <p className="text-gray-600">Your Score</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center p-4 bg-gradient-to-br from-liella-pink to-liella-purple rounded-lg text-white">
              <div className="text-4xl font-bold">{matchedCount}</div>
              <div className="text-sm mt-1">的中 / Matched</div>
              <div className="text-xs mt-1 opacity-80">out of {totalCells}</div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-liella-blue to-liella-purple rounded-lg text-white">
              <div className="text-4xl font-bold">{bingoLines}</div>
              <div className="text-sm mt-1">ビンゴライン / Bingo Lines</div>
              <div className="text-xs mt-1 opacity-80">completed</div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-liella-purple to-liella-pink rounded-lg text-white">
              <div className="text-4xl font-bold">
                {Math.round((matchedCount / totalCells) * 100)}%
              </div>
              <div className="text-sm mt-1">正解率 / Accuracy</div>
              <div className="text-xs mt-1 opacity-80">prediction rate</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-center mb-6">
            あなたのビンゴカード / Your Bingo Card
          </h3>

          <div className="grid grid-cols-5 gap-2 max-w-3xl mx-auto">
            {bingoCard.cells.map((cell, index) => {
              const song = getSongById(cell.songId);
              const matched = isCellMatched(index);

              return (
                <div
                  key={index}
                  className={`
                    aspect-square border-2 rounded-lg overflow-hidden relative
                    ${
                      cell.isFreeSpace
                        ? "bg-gradient-to-br from-liella-pink to-liella-purple border-liella-pink"
                        : matched
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300"
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
                        className={`w-full h-full object-cover ${
                          matched ? "opacity-100" : "opacity-50 grayscale"
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <div className="text-white text-xs font-semibold leading-tight line-clamp-2">
                          {song.title.jp}
                        </div>
                      </div>
                      {matched && (
                        <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-1">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      Empty
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>✓ 緑 = 的中した曲 / Green = Matched songs</p>
            <p className="mt-1">グレー = 外れた曲 / Gray = Not performed</p>
          </div>
        </div>

        {bingoLines > 0 && (
          <div className="mt-8 bg-gradient-to-r from-yellow-400 to-orange-400 p-6 rounded-lg text-white text-center">
            <h3 className="text-2xl font-bold mb-2">
              🎉 おめでとうございます！/ Congratulations! 🎉
            </h3>
            <p className="text-lg">
              {bingoLines}ライン達成！/ {bingoLines} Bingo Line
              {bingoLines > 1 ? "s" : ""} Completed!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
