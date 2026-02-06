import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useBingoStore } from "../hooks/useBingoStore";
import { BingoGrid } from "./BingoGrid";
import { AuthButton } from "./AuthButton";
import { Download, Save, Sparkles, Trophy } from "lucide-react";
import { saveBingoCard, getUserBingoCard } from "../lib/firestore";
import { exportBingoToImage } from "../utils/exportImage";

export const HomePage = () => {
  const { user } = useAuth();
  const { cells, initializeBingo, isBingoComplete } = useBingoStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const loadBingoCard = async () => {
      if (user) {
        try {
          const bingoCard = await getUserBingoCard(user.uid);
          if (bingoCard && bingoCard.cells) {
            useBingoStore.setState({
              cells: bingoCard.cells,
              selectedSongs: new Set(
                bingoCard.cells
                  .filter((cell) => cell.songId)
                  .map((cell) => cell.songId!)
              ),
            });
            return;
          }
        } catch (error) {
          console.error("Error loading bingo card:", error);
        }
      }

      if (cells.length === 0) {
        initializeBingo();
      }
    };

    loadBingoCard();
  }, [user]);

  const handleSave = async () => {
    if (!user) {
      alert("ログインしてください / Please login to save");
      return;
    }

    if (!isBingoComplete()) {
      alert("全てのマスを埋めてください / Please fill all cells");
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      await saveBingoCard(user.uid, cells);
      setSaveMessage("保存しました！ / Saved successfully!");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error("Error saving:", error);
      setSaveMessage("保存に失敗しました / Save failed");
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    if (!isBingoComplete()) {
      alert(
        "全てのマスを埋めてください / Please fill all cells before exporting"
      );
      return;
    }

    setIsExporting(true);

    try {
      const exportArea = document.getElementById("bingo-export-area");
      if (exportArea) {
        const images = exportArea.querySelectorAll("img");
        await Promise.all(
          Array.from(images).map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
            });
          })
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 100));

      await exportBingoToImage("bingo-export-area");
    } catch (error) {
      console.error("Error exporting:", error);
      alert("エクスポートに失敗しました / Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="text-liella-pink" size={32} />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-liella-pink to-liella-purple bg-clip-text text-transparent">
                Liella! 7th Live Bingo
              </h1>
              <p className="text-sm text-gray-600">セットリスト予想ビンゴ</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/results"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg hover:shadow-lg transition text-sm font-semibold"
            >
              <Trophy size={16} />
              <span className="hidden md:inline">結果 / Results</span>
            </Link>
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">
            あなたの予想でビンゴを作ろう！
          </h2>
          <p className="text-gray-600">Create your setlist prediction bingo!</p>
          <p className="text-sm text-gray-500 mt-2">
            各マスをクリックして楽曲を選択してください / Click each cell to
            select a song
          </p>
        </div>

        <div
          id="bingo-export-area"
          className="p-8 rounded-2xl shadow-lg mb-6"
          style={{
            backgroundColor: "#ffffff",
            color: "#000000",
          }}
        >
          <div className="mb-4 text-center">
            <h3 className="text-xl font-bold mb-1" style={{ color: "#FF69B4" }}>
              Liella! 7th Live Setlist Bingo
            </h3>
            <p className="text-sm text-gray-600">
              {user?.displayName || user?.email || "Anonymous"}
            </p>
          </div>
          <BingoGrid />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving || !user}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition
              ${
                user && !isSaving
                  ? "bg-gradient-to-r from-liella-pink to-liella-purple text-white hover:shadow-lg transform hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            <Save size={20} />
            {isSaving ? "保存中... / Saving..." : "保存 / Save"}
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-liella-blue text-liella-blue hover:bg-liella-blue hover:text-white rounded-lg font-semibold transition transform hover:scale-105 disabled:opacity-50"
          >
            <Download size={20} />
            {isExporting
              ? "エクスポート中... / Exporting..."
              : "画像保存 / Export Image"}
          </button>
        </div>

        {saveMessage && (
          <div className="mt-4 text-center">
            <p
              className={`text-sm font-semibold ${
                saveMessage.includes("成功") ||
                saveMessage.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {saveMessage}
            </p>
          </div>
        )}

        {!user && (
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>💡 ビンゴカードを保存するにはログインしてください</p>
            <p>Please login to save your bingo card</p>
          </div>
        )}

        <div className="mt-12 bg-white p-6 rounded-lg shadow max-w-2xl mx-auto">
          <h3 className="font-bold mb-3 text-liella-pink">使い方</h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li>1. 各マスをクリックして、予想する楽曲を選択.</li>
            <li>2. 全25マスを埋めてください（真ん中はFREE SPACE）</li>
            <li>3. ログインして保存、または画像としてエクスポート</li>
            <li>
              4. ライブ後、実際に歌われた曲と照らし合わせて結果をチェック！
            </li>
          </ol>
          <h3 className="font-bold mb-3 text-liella-pink mt-5">How to use</h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li>1. Click each square to select the song you predict.</li>
            <li>
              2. Please fill in all 25 squares (the center is a FREE SPACE).
            </li>
            <li>3. Log in to save or export as an image</li>
            <li>
              4. After the live show, check the results against the songs
              actually performed!
            </li>
          </ol>
        </div>
      </main>

      <footer className="mt-16 py-6 text-center text-sm text-gray-500">
        <p>
          Made with 💖 for Liella! fans by Fanpage Chasing the Shooting Stars
        </p>
        <p className="mt-1">© 2026 Liella! 7th Live Bingo</p>
      </footer>
    </div>
  );
};
