import React, { useState, useEffect } from "react";
import { Center, Button, Text, Box } from "@chakra-ui/react";
import Flashcard from "./Flashcard";
import CategorySelect from "../common/CategorySelect";
import { useColorModeValue } from "@chakra-ui/react";
import { shuffleArray } from "../../utils/helpers";

const FlashcardMode = ({
  flashcardsData,
  categories,
  bookmarkedCards = [],
  toggleBookmark,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cardsToShow, setCardsToShow] = useState([]);
  const [isFlipped, setIsFlipped] = useState(false);

  const bg = useColorModeValue("white", "gray.700");
  const color = useColorModeValue("gray.800", "whiteAlpha.900");

  // Update cardsToShow whenever selectedCategory or flashcardsData changes
  useEffect(() => {
    const filteredCards =
      selectedCategory === "All"
        ? flashcardsData
        : flashcardsData.filter((card) => card.category === selectedCategory);
    setCardsToShow(filteredCards);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedCategory, flashcardsData]);

  // Simplify handleCategoryChange
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Use the improved shuffleArray function
  const shuffleFlashcards = () => {
    const shuffledCards = shuffleArray(cardsToShow);
    setCardsToShow(shuffledCards);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const flipDuration = 300; // Duration of the flip animation in milliseconds

  const nextCard = () => {
    if (isFlipped) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex + 1 < cardsToShow.length ? prevIndex + 1 : prevIndex,
        );
      }, flipDuration);
    } else {
      setCurrentIndex((prevIndex) =>
        prevIndex + 1 < cardsToShow.length ? prevIndex + 1 : prevIndex,
      );
    }
  };

  const prevCard = () => {
    if (isFlipped) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex - 1 >= 0 ? prevIndex - 1 : prevIndex,
        );
      }, flipDuration);
    } else {
      setCurrentIndex((prevIndex) =>
        prevIndex - 1 >= 0 ? prevIndex - 1 : prevIndex,
      );
    }
  };

  const handleCardFlip = () => {
    setIsFlipped((prevState) => !prevState);
  };

  // Check if the current card is bookmarked
  const isBookmarked = (card) =>
    bookmarkedCards.some((bookmarkedCard) => bookmarkedCard.term === card.term);

  return (
    <Center
      borderRadius="xl"
      flexDirection="column"
      padding={{ base: "20px", md: "20px" }}
      bg={bg}
      color={color}
    >
      <Box mb="20px" width="100%" maxWidth="600px" textAlign="center">
        <Box maxWidth="300px" width="100%" mx="auto">
          <CategorySelect
            categories={["All", ...categories]}
            selectedCategory={selectedCategory}
            handleCategoryChange={handleCategoryChange}
          />
        </Box>
        <Button mt="50px" colorScheme="teal" onClick={shuffleFlashcards}>
          Shuffle Flashcards
        </Button>
      </Box>

      {cardsToShow.length > 0 ? (
        <>
          <Box position="relative">
            {/* Render flashcard */}
            <Flashcard
              key={`${cardsToShow[currentIndex].term}-${currentIndex}`}
              card={cardsToShow[currentIndex]}
              isFlipped={isFlipped}
              onFlip={handleCardFlip}
              isBookmarked={isBookmarked(cardsToShow[currentIndex])}
              toggleBookmark={toggleBookmark}
            />
          </Box>

          <Center mt="20px" alignItems="center">
            <Button
              onClick={prevCard}
              mr="60px"
              colorScheme="teal"
              isDisabled={currentIndex === 0}
            >
              Previous
            </Button>
            <Text fontSize="lg">
              {currentIndex + 1}/{cardsToShow.length}
            </Text>
            <Button
              onClick={nextCard}
              ml="60px"
              colorScheme="teal"
              isDisabled={currentIndex === cardsToShow.length - 1}
            >
              Next
            </Button>
          </Center>
        </>
      ) : (
        <Text fontSize="xl" mt="20px">
          No flashcards available.
        </Text>
      )}
    </Center>
  );
};

export default FlashcardMode;
