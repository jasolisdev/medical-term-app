export const shuffleArray = (array) => {
  const shuffledArray = [...array]; // Copy the array to avoid mutating the original
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements at indices i and j
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

export const extractChapterNumber = (category) => {
  const match = category.match(/Ch(\d+)/i); // 'i' flag makes it case-insensitive
  return match ? parseInt(match[1], 10) : null;
};
