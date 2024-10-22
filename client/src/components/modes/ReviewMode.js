import React, { useState, useEffect, useCallback } from "react";
import {
  Center,
  Flex,
  Button,
  Text,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import CategorySelect from "../common/CategorySelect";
import ReviewCard from "./ReviewCard";
import { useInView } from "react-intersection-observer";

const ReviewMode = ({
  flashcardsData,
  categories,
  bookmarkedCards = [], // Default value to ensure it is always an array
  toggleBookmark,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cardsToShow, setCardsToShow] = useState([]);
  const [visibleCards, setVisibleCards] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [currentLetter, setCurrentLetter] = useState(null);

  const cardsPerPage = 20;

  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 1,
  });

  const bg = useColorModeValue("white", "gray.700");
  const color = useColorModeValue("gray.800", "whiteAlpha.900");
  const navBg = useColorModeValue("whiteAlpha.900", "gray.800");
  const navBorderColor = useColorModeValue("gray.200", "gray.600");

  // Memoize filterCards function
  const filterCards = useCallback(() => {
    let filteredCards = showBookmarked
      ? bookmarkedCards
      : selectedCategory === "All"
        ? flashcardsData
        : flashcardsData.filter((card) => card.category === selectedCategory);

    if (currentLetter) {
      filteredCards = filteredCards.filter(
        (card) => card.term.charAt(0).toUpperCase() === currentLetter,
      );
    }
    return filteredCards;
  }, [
    showBookmarked,
    bookmarkedCards,
    selectedCategory,
    flashcardsData,
    currentLetter,
  ]);

  // Memoize loadInitialCards function
  const loadInitialCards = useCallback(() => {
    const filteredCards = filterCards();
    setCardsToShow(filteredCards);
    setVisibleCards(filteredCards.slice(0, cardsPerPage));
    setHasMore(filteredCards.length > cardsPerPage);
  }, [filterCards, cardsPerPage]);

  // Memoize loadMoreCards function
  const loadMoreCards = useCallback(() => {
    setVisibleCards((prevVisibleCards) => {
      const nextPage = prevVisibleCards.length / cardsPerPage + 1;
      const newVisibleCards = cardsToShow.slice(0, nextPage * cardsPerPage);
      setHasMore(newVisibleCards.length < cardsToShow.length);
      return newVisibleCards;
    });
  }, [cardsToShow, cardsPerPage]);

  // Effect to load initial cards
  useEffect(() => {
    loadInitialCards();
  }, [loadInitialCards]);

  // Effect to load more cards when in view
  useEffect(() => {
    if (inView && hasMore && !showBookmarked) {
      loadMoreCards();
    }
  }, [inView, hasMore, showBookmarked, loadMoreCards]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentLetter(null); // Reset letter when category changes
    setShowBookmarked(false);
  };

  const handleLetterClick = (letter) => {
    setCurrentLetter(letter);
  };

  // Memoize getLettersWithTerms function
  const getLettersWithTerms = useCallback((cards) => {
    return new Set(cards.map((card) => card.term.charAt(0).toUpperCase()));
  }, []);

  // Determine which letters have terms based on the current filter context
  const availableLetters = getLettersWithTerms(
    showBookmarked
      ? bookmarkedCards
      : selectedCategory === "All"
        ? flashcardsData
        : flashcardsData.filter((card) => card.category === selectedCategory),
  );

  // Filter cards to be displayed
  const filteredCards = showBookmarked
    ? bookmarkedCards
        .filter((card) =>
          currentLetter
            ? card.term.charAt(0).toUpperCase() === currentLetter
            : true,
        )
        .sort((a, b) => a.term.localeCompare(b.term))
    : visibleCards;

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <Center
      borderRadius="xl"
      flexDirection="column"
      padding={{ base: "20px", md: "20px" }}
      bg={bg}
      color={color}
    >
      {/* Category Selection */}
      {!showBookmarked && (
        <Box mb="10px">
          <CategorySelect
            categories={["All", ...categories]}
            selectedCategory={selectedCategory}
            handleCategoryChange={handleCategoryChange}
          />
        </Box>
      )}

      {/* A-Z Navigation */}
      <Box
        width="100%"
        maxWidth="600px"
        padding="10px"
        textAlign="center"
        borderRadius="md"
        boxShadow="md"
        backgroundColor={navBg}
        borderWidth="1px"
        borderColor={navBorderColor}
        mb={{ base: "20px", md: "30px" }}
        overflowX="auto"
        whiteSpace="nowrap"
        position="sticky"
        top="70px"
        zIndex="5"
      >
        <Flex gap="5px" justifyContent="flex-start" alignItems="center">
          {alphabet.map((letter) => (
            <Button
              key={letter}
              size={{ base: "sm", md: "md" }}
              onClick={() => handleLetterClick(letter)}
              variant={currentLetter === letter ? "solid" : "outline"}
              colorScheme="teal"
              isDisabled={!availableLetters.has(letter)} // Disable letters without terms
            >
              {letter}
            </Button>
          ))}
          <Button
            size={{ base: "sm", md: "md" }}
            onClick={() => setCurrentLetter(null)}
            variant={!currentLetter ? "solid" : "outline"}
            colorScheme="teal"
          >
            All
          </Button>
        </Flex>
      </Box>

      {/* Show Bookmarked Terms Button */}
      <Button
        onClick={() => {
          setShowBookmarked(!showBookmarked);
          setCurrentLetter(null); // Reset letter when switching modes
        }}
        mb="20px"
        colorScheme="teal"
      >
        {showBookmarked ? "Show All Terms" : "Show Bookmarked Terms"}
      </Button>

      {/* Displaying Review Cards */}
      <Flex
        wrap="wrap"
        width="100%"
        maxWidth="800px"
        justifyContent="center"
        alignItems="flex-start"
      >
        <Box>
          {filteredCards.length > 0 ? (
            filteredCards.map((card, index) =>
              card ? (
                <ReviewCard
                  key={index}
                  card={{
                    ...card,
                    isBookmarked: bookmarkedCards.some(
                      (c) => c.term === card.term,
                    ),
                  }}
                  toggleBookmark={toggleBookmark}
                />
              ) : null,
            )
          ) : (
            <Box textAlign="center">
              <Text fontSize="xl" mt="20px">
                No terms available. Please try another category or letter.
              </Text>
            </Box>
          )}
        </Box>
      </Flex>

      {/* Load More Trigger */}
      {hasMore && !showBookmarked && (
        <Box ref={ref} height="20px" visibility="hidden">
          Loading...
        </Box>
      )}
    </Center>
  );
};

export default ReviewMode;
