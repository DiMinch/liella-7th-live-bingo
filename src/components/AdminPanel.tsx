import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { SONGS } from "../data/songs";
import {
  getPerformedSongs,
  addPerformedSong,
  removePerformedSong,
} from "../lib/firestore";
import type { PerformedSong } from "../types";
import { CheckCircle2, Circle, Lock } from "lucide-react";

const ADMIN_UIDS = ["vq9tbeNSgIT0lROAl9kNrf10g4D2"];

export const AdminPanel = () => {
  const { user } = useAuth();
  const [performedSongs, setPerformedSongs] = useState<PerformedSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<1 | 2>(1);

  useEffect(() => {
    loadPerformedSongs();
  }, []);

  const loadPerformedSongs = async () => {
    try {
      const songs = await getPerformedSongs();
      setPerformedSongs(songs);
    } catch (error) {
      console.error("Error loading performed songs:", error);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user && ADMIN_UIDS.includes(user.uid);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <Lock className="mx-auto mb-4 text-gray-400" size={48} />
          <h2 className="text-2xl font-bold mb-2">Admin Access Required</h2>
          <p className="text-gray-600">
            このページは管理者のみアクセスできます
          </p>
          <p className="text-sm text-gray-500 mt-4">
            This page is only accessible to administrators
          </p>
          <button
            onClick={() => window.location.replace("/")}
            className="mt-6 px-4 py-2 bg-liella-pink text-white rounded-lg hover:bg-liella-purple transition"
          >
            Return
          </button>
        </div>
      </div>
    );
  }

  const isPerformed = (songId: string, day: 1 | 2): boolean => {
    return performedSongs.some((ps) => ps.songId === songId && ps.day === day);
  };

  const toggleSongPerformance = async (songId: string, day: 1 | 2) => {
    const wasPerformed = isPerformed(songId, day);

    try {
      if (wasPerformed) {
        await removePerformedSong(songId);
        setPerformedSongs((prev) => prev.filter((ps) => ps.songId !== songId));
      } else {
        await addPerformedSong(songId, day);
        setPerformedSongs((prev) => [
          ...prev.filter((ps) => ps.songId !== songId),
          { songId, day },
        ]);
      }
    } catch (error) {
      console.error("Error toggling song:", error);
      alert("エラーが発生しました / Error occurred");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-liella-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const day1Count = performedSongs.filter((ps) => ps.day === 1).length;
  const day2Count = performedSongs.filter((ps) => ps.day === 2).length;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-liella-pink">
            管理者パネル / Admin Panel
          </h1>
          <p className="text-sm text-gray-600">
            演奏された楽曲をマークする / Mark performed songs
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setSelectedDay(1)}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                selectedDay === 1
                  ? "bg-linear-to-r from-liella-pink to-liella-purple text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Day 1 ({day1Count} songs)
            </button>
            <button
              onClick={() => setSelectedDay(2)}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                selectedDay === 2
                  ? "bg-linear-to-r from-liella-pink to-liella-purple text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Day 2 ({day2Count} songs)
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y">
            {SONGS.map((song) => {
              const performed = isPerformed(song.id, selectedDay);

              return (
                <button
                  key={song.id}
                  onClick={() => toggleSongPerformance(song.id, selectedDay)}
                  className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition ${
                    performed ? "bg-green-50" : ""
                  }`}
                >
                  <div className="shrink-0">
                    {performed ? (
                      <CheckCircle2 className="text-green-600" size={24} />
                    ) : (
                      <Circle className="text-gray-400" size={24} />
                    )}
                  </div>

                  <img
                    src={song.coverUrl}
                    alt={song.title.jp}
                    className="w-16 h-16 object-cover rounded shrink-0"
                  />

                  <div className="flex-1 text-left min-w-0">
                    <div className="font-semibold truncate">
                      {song.title.jp}
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {song.title.romaji}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {song.releaseYear} • {song.units.join(", ")}
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 shrink-0">
                    {performed ? "Performed ✓" : "Not performed"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold mb-2">統計 / Statistics</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-liella-pink">
                {day1Count}
              </div>
              <div className="text-sm text-gray-600">Day 1 Songs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-liella-purple">
                {day2Count}
              </div>
              <div className="text-sm text-gray-600">Day 2 Songs</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
