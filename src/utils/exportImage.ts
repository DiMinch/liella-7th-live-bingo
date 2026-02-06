import html2canvas from "html2canvas";

export const exportBingoToImage = async (elementId: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("Element not found");
  }

  const canvas = await html2canvas(element, {
    backgroundColor: "#ffffff",
    scale: 2,
    logging: false,
  });

  canvas.toBlob((blob) => {
    if (!blob) {
      throw new Error("Failed to create blob");
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `liella-7th-live-bingo-${Date.now()}.png`;
    link.click();

    URL.revokeObjectURL(url);
  }, "image/png");
};
