import React, { useState } from "react";
import FlashcardMode from "./FlashcardMode";
import ReviewMode from "./ReviewMode";

const FlashcardReviewContainer = ({ flashcardsData, categories }) => {
  // Shared state for bookmarked cards
  const [bookmarkedCards, setBookmarkedCards] = useState(() => {
    const savedBookmarks = localStorage.getItem("bookmarkedCards");
    return savedBookmarks ? JSON.parse(savedBookmarks) : [];
  });

  // Shared function to toggle bookmark
  const toggleBookmark = (card) => {
    let updatedBookmarks;
    if (bookmarkedCards.some((c) => c.term === card.term)) {
      updatedBookmarks = bookmarkedCards.filter((c) => c.term !== card.term);
    } else {
      updatedBookmarks = [...bookmarkedCards, card];
    }
    setBookmarkedCards(updatedBookmarks);
    localStorage.setItem("bookmarkedCards", JSON.stringify(updatedBookmarks));
  };

  return (
    <div>
      {/* Pass shared bookmarkedCards and toggleBookmark to both modes */}
      <FlashcardMode
        flashcardsData={flashcardsData}
        categories={categories}
        bookmarkedCards={bookmarkedCards}
        toggleBookmark={toggleBookmark}
      />
      <ReviewMode
        flashcardsData={flashcardsData}
        categories={categories}
        bookmarkedCards={bookmarkedCards}
        toggleBookmark={toggleBookmark}
      />
    </div>
  );
};

export default FlashcardReviewContainer;
