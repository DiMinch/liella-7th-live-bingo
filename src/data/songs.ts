import type { Song } from "../types";

export const SONGS: Song[] = [
  {
    id: "song-001",
    title: {
      jp: "START!! True dreams",
      romaji: "START!! True dreams",
    },
    coverUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqf8sbBzvrRgdukpZjiNnlxV_CLEPYP5pYIw&s",
    releaseYear: 2021,
    units: ["Liella!", "Gen1"],
    members: ["Kanon", "Keke", "Chisato", "Sumire", "Ren"],
  },
  {
    id: "song-002",
    title: {
      jp: "未来予報ハレルヤ!",
      romaji: "Mirai Yohou Hallelujah!",
    },
    coverUrl: "https://via.placeholder.com/300?text=Hallelujah",
    releaseYear: 2022,
    units: ["Liella!", "Gen1"],
    members: ["Kanon", "Keke", "Chisato", "Sumire", "Ren"],
  },
  // Thêm nhiều bài hơn...
];

export const UNITS: string[] = [
  "Liella!",
  "CatChu",
  "KALEIDOSCORE",
  "5yncri5e!",
  "Gen1",
  "Gen2",
  "Gen3",
  "Others",
];

export const ALL_MEMBERS: string[] = [
  "Kanon",
  "Keke",
  "Chisato",
  "Sumire",
  "Ren",
  "Kinako",
  "Mei",
  "Shiki",
  "Natsumi",
  "Margarete",
  "Tomari",
];

export const RELEASE_YEARS: number[] = [2021, 2022, 2023, 2024, 2025];

export const LIVE_7TH_LOGO_URL =
  "https://res.cloudinary.com/dpog3uuf1/image/upload/v1770311312/image_i2rwi1.png";
