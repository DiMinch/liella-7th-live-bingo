import * as htmlToImage from "html-to-image";

export const exportBingoToImage = async (elementId: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("Element not found");
  }

  try {
    const blob = await htmlToImage.toBlob(element, {
      quality: 1,
      pixelRatio: 3,
      backgroundColor: "#ffffff",
      cacheBust: true,
      style: {
        margin: "0",
        padding: "0",
      },
    });

    if (!blob) {
      throw new Error("Failed to create blob");
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `liella-7th-live-bingo-${Date.now()}.png`;
    link.click();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export error:", error);
    throw error;
  }
};
