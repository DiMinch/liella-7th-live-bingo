import { domToPng } from "modern-screenshot";

export const exportBingoToImage = async (elementId: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("Element not found");
  }

  try {
    const dataUrl = await domToPng(element, {
      quality: 1,
      scale: 3,
      backgroundColor: "#ffffff",
      style: {
        imageRendering: "-webkit-optimize-contrast",
        transform: "translateZ(0)",
      },
    });

    const response = await fetch(dataUrl);
    const blob = await response.blob();

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
