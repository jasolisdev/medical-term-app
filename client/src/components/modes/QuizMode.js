import React, { useState } from "react";
import {
  Box,
  Button,
  Center,
  Text,
  Stack,
  Radio,
  RadioGroup,
  Divider,
  Flex,
  SimpleGrid,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";

const QuizMode = ({ flashcardsData, categories }) => {
  // State variables for quiz functionality
  const [selectedCategories, setSelectedCategories] = useState([]); // Categories selected by the user
  const [numQuestions, setNumQuestions] = useState(5); // Number of questions in the quiz
  const [cardsToShow, setCardsToShow] = useState([]); // Flashcards selected for the quiz
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Index of the current question
  const [score, setScore] = useState(0); // User's score
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Tracks user's answers
  const [showScore, setShowScore] = useState(false); // Indicates if the score should be shown
  const [quizStarted, setQuizStarted] = useState(false); // Indicates if the quiz has started
  const [answerChoicesList, setAnswerChoicesList] = useState([]); // List of answer choices for each question
  const [missedQuestions, setMissedQuestions] = useState([]); // Stores missed questions

  // Define all color mode values for light and dark modes
  const bg = useColorModeValue("white", "gray.800");
  const color = useColorModeValue("gray.800", "whiteAlpha.900");
  const cardBg = useColorModeValue("gray.50", "gray.700");
  const dividerColor = useColorModeValue("gray.300", "gray.600");
  const navBg = useColorModeValue("whiteAlpha.900", "gray.800");
  const navBorderColor = useColorModeValue("gray.200", "gray.600");

  // Adjust font size based on category text length
  const getFontSize = (text) => {
    if (text.length > 20) {
      return "xs";
    } else if (text.length > 10) {
      return "sm";
    } else {
      return "md";
    }
  };

  // Handle changes in category selection
  const handleCategoryChange = (category) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((cat) => cat !== category)
        : [...prevCategories, category],
    );
  };

  // Handle changes in number of questions
  const handleNumQuestionsChange = (num) => {
    setNumQuestions(num);
  };

  // Start the quiz with selected settings
  const handleStartQuiz = () => {
    const filteredCards =
      selectedCategories.length === 0
        ? flashcardsData
        : flashcardsData.filter((card) =>
            selectedCategories.includes(card.category),
          );

    // Shuffle the filtered cards and select the desired number of questions
    const shuffledCards = filteredCards
      .sort(() => 0.5 - Math.random())
      .slice(0, numQuestions);

    // Generate answer choices for each question
    const choices = shuffledCards.map((card) => {
      const incorrectAnswers = filteredCards
        .filter((c) => c.term !== card.term)
        .map((c) => c.term)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3); // Select 3 incorrect answers

      return [card.term, ...incorrectAnswers].sort(() => 0.5 - Math.random()); // Shuffle correct and incorrect answers
    });

    setCardsToShow(shuffledCards); // Set the cards for the quiz
    setAnswerChoicesList(choices); // Set the answer choices for each question
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswers({});
    setShowScore(false);
    setQuizStarted(true); // Set quiz started state to true
  };

  // Handle user's answer selection
  const handleAnswerSelect = (value) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionIndex]: value,
    }));
  };

  // Submit the quiz and calculate the score
  const handleSubmitQuiz = () => {
    let scoreCount = 0;
    const missedQuestionsArray = [];

    // Calculate the score by comparing selected answers to correct answers
    cardsToShow.forEach((card, index) => {
      if (selectedAnswers[index] === card.term) {
        scoreCount++;
      } else {
        missedQuestionsArray.push(card); // Add missed questions to the array
      }
    });

    // Update the missedQuestions state variable
    setMissedQuestions(missedQuestionsArray);

    setScore(scoreCount); // Update the score state
    setShowScore(true); // Set state to show the score
  };

  // Navigate to a specific question
  const handleNavigateQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  // Restart the quiz with initial settings
  const handleRestartQuiz = () => {
    setQuizStarted(false);
    setSelectedCategories([]);
    setNumQuestions(5);
    setCardsToShow([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswers({});
    setShowScore(false);
    setMissedQuestions([]); // Reset missedQuestions if desired
  };

  // Restart the quiz with missed questions and additional random questions
  const handleRestartWithMissedQuestions = () => {
    const missedQuestionsArray = missedQuestions;

    // Adjust numQuestions if needed
    const totalQuestions = Math.max(numQuestions, missedQuestionsArray.length);

    const numAdditionalQuestions = totalQuestions - missedQuestionsArray.length;

    // Get a list of all other questions not in missedQuestionsArray
    const otherQuestions = flashcardsData.filter(
      (card) =>
        !missedQuestionsArray.some(
          (missedCard) => missedCard.term === card.term,
        ),
    );

    // Shuffle the otherQuestions array
    const shuffledOtherQuestions = otherQuestions.sort(
      () => 0.5 - Math.random(),
    );

    // Select the required number of additional questions
    const additionalQuestions = shuffledOtherQuestions.slice(
      0,
      numAdditionalQuestions,
    );

    // Combine the missed questions with the additional questions
    const combinedQuestions = [...missedQuestionsArray, ...additionalQuestions];

    // Shuffle the combinedQuestions
    const newCardsToShow = combinedQuestions.sort(() => 0.5 - Math.random());

    // Generate answer choices for each question
    const choices = newCardsToShow.map((card) => {
      const incorrectAnswers = flashcardsData
        .filter((c) => c.term !== card.term)
        .map((c) => c.term)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3); // Select 3 incorrect answers

      return [card.term, ...incorrectAnswers].sort(() => 0.5 - Math.random()); // Shuffle correct and incorrect answers
    });

    setCardsToShow(newCardsToShow);
    setAnswerChoicesList(choices);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswers({});
    setShowScore(false);
    setQuizStarted(true);
  };

  // Check if all questions have been answered
  const allQuestionsAnswered =
    Object.keys(selectedAnswers).length === cardsToShow.length;

  return (
    <Center flexDirection="column" bg={bg} color={color}>
      {/* Quiz Settings (Before quiz starts) */}
      {!quizStarted ? (
        <Box
          width="100%"
          maxWidth={{ base: "100%", md: "600px" }}
          padding={{ base: "10px", md: "30px" }}
          boxShadow="2xl"
          borderRadius="xl"
          textAlign="center"
          bg={cardBg}
          color={color}
        >
          {/* Quiz title */}
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="extrabold"
            mb="8"
            color="teal.500"
          >
            Select Quiz Settings
          </Text>
          {/* Divider */}
          <Divider mb="6" borderColor={dividerColor} />
          {/* Number of Questions Selection */}
          <Box mb="8">
            <Text mb="4" fontWeight="bold" fontSize="lg" color="teal.400">
              Number of Questions
            </Text>
            <Flex
              justifyContent="center"
              width="100%"
              px={{ base: "10px", md: "0" }}
              overflowX="auto"
            >
              <HStack spacing="4px">
                {[5, 15, 25, 35, 65, 75].map((num) => (
                  <Button
                    key={num}
                    size="sm"
                    variant={numQuestions === num ? "solid" : "outline"}
                    colorScheme="teal"
                    onClick={() => handleNumQuestionsChange(num)}
                  >
                    {num}
                  </Button>
                ))}
              </HStack>
            </Flex>
          </Box>
          <Divider mb="6" borderColor={dividerColor} />
          {/* Category Selection */}
          <Box mb="8">
            <Text mb="4" fontWeight="bold" fontSize="lg" color="teal.400">
              Select Categories
            </Text>
            <SimpleGrid
              columns={{ base: 1, sm: 2 }}
              bg={cardBg}
              padding="2"
              borderRadius="md"
              boxShadow="md"
              spacing={2}
            >
              {categories.map((category, index) => (
                <Button
                  key={index}
                  size="md"
                  fontSize={getFontSize(category)}
                  variant={
                    selectedCategories.includes(category) ? "solid" : "outline"
                  }
                  colorScheme="teal"
                  onClick={() => handleCategoryChange(category)}
                  isTruncated
                >
                  {category}
                </Button>
              ))}
            </SimpleGrid>
          </Box>
          <Divider mb="6" borderColor={dividerColor} />
          {/* Start Quiz Button */}
          <Button
            colorScheme="teal"
            size="lg"
            onClick={handleStartQuiz}
            width="100%"
            py={{ base: "6", md: "8" }}
            boxShadow="lg"
          >
            Start Quiz
          </Button>
        </Box>
      ) : showScore ? (
        <>
          {/* Show score summary after quiz submission */}
          <Box
            textAlign="center"
            width="100%"
            maxWidth="800px"
            padding={{ base: "15px", md: "20px" }}
            boxShadow="lg"
            borderRadius="lg"
            bg={cardBg}
          >
            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              color="teal.500"
              fontWeight="bold"
              mb="4"
            >
              You scored {score} out of {cardsToShow.length}
            </Text>
            <Divider mb="6" borderColor={dividerColor} />

            {/* Review each question with the correct answer highlighted */}
            {cardsToShow.map((card, index) => (
              <Box
                key={index}
                mb="6"
                padding="4"
                borderRadius="md"
                boxShadow="md"
                bg={cardBg}
              >
                <Text fontWeight="bold" color="teal.500">
                  {index + 1}. {card.definition}
                </Text>
                <RadioGroup value={selectedAnswers[index]}>
                  <Stack spacing={4} direction="column" alignItems="start">
                    {/* Render all answer choices with correct and incorrect answers styled differently */}
                    {answerChoicesList[index].map((choice, choiceIndex) => {
                      const isCorrectAnswer = choice === card.term;
                      const isUserAnswer = choice === selectedAnswers[index];
                      let borderColor = "gray.300";

                      if (showScore) {
                        if (isUserAnswer && isCorrectAnswer) {
                          borderColor = "green.400"; // Highlight correct answer in green
                        } else if (isUserAnswer && !isCorrectAnswer) {
                          borderColor = "red.400"; // Highlight incorrect user answer in red
                        }
                      }

                      return (
                        <Box
                          key={choiceIndex}
                          borderWidth="2px"
                          borderColor={borderColor}
                          padding="10px"
                          borderRadius="md"
                          width="100%"
                        >
                          <Radio
                            value={choice}
                            colorScheme="teal"
                            size={{ base: "md", md: "lg" }}
                            isDisabled
                          >
                            {String.fromCharCode(65 + choiceIndex)}. {choice}
                          </Radio>
                        </Box>
                      );
                    })}
                  </Stack>
                </RadioGroup>
              </Box>
            ))}
          </Box>
          {/* Exit Quiz Button */}
          <Button
            mt="6"
            colorScheme="teal"
            size="lg"
            onClick={handleRestartQuiz}
            width="100%"
          >
            Exit Quiz
          </Button>
          {/* Restart Quiz with Missed Questions Button */}
          {score < cardsToShow.length && (
            <Button
              mt="4"
              colorScheme="teal"
              size="lg"
              onClick={handleRestartWithMissedQuestions}
              width="100%"
            >
              Restart Quiz with Missed Questions
            </Button>
          )}
        </>
      ) : (
        <>
          {/* Show the current question while the quiz is ongoing */}
          <Box
            width="100%"
            maxWidth={{ base: "95%", md: "600px" }}
            padding={{ base: "15px", md: "20px" }}
            boxShadow="lg"
            borderRadius="lg"
            textAlign="center"
            bg={cardBg}
          >
            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="bold"
              mb="4"
              color="teal.500"
            >
              {currentQuestionIndex + 1}.{" "}
              {cardsToShow[currentQuestionIndex].definition}
            </Text>
            <RadioGroup
              onChange={handleAnswerSelect}
              value={selectedAnswers[currentQuestionIndex] || ""}
            >
              <Stack spacing={4} direction="column" alignItems="start">
                {/* Render all answer choices for the current question */}
                {answerChoicesList[currentQuestionIndex].map(
                  (choice, index) => (
                    <Radio
                      key={index}
                      value={choice}
                      colorScheme="teal"
                      size={{ base: "md", md: "lg" }}
                    >
                      {String.fromCharCode(65 + index)}. {choice}
                    </Radio>
                  ),
                )}
              </Stack>
            </RadioGroup>
            <Flex mt="8" justifyContent="space-between" wrap="wrap">
              {/* Navigation buttons for moving between questions */}
              <Button
                colorScheme="teal"
                size={{ base: "sm", md: "md" }}
                onClick={() => handleNavigateQuestion(currentQuestionIndex - 1)}
                isDisabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              <Button
                colorScheme="teal"
                size={{ base: "sm", md: "md" }}
                onClick={() => handleNavigateQuestion(currentQuestionIndex + 1)}
                isDisabled={currentQuestionIndex === cardsToShow.length - 1}
              >
                Next
              </Button>
            </Flex>
          </Box>
          {/* Question Navigation, Submit, and Restart Container */}
          <Box
            width="100%"
            maxWidth={{ base: "100%", md: "600px" }}
            padding={{ base: "15px", md: "20px" }}
            mt="4"
            boxShadow="lg"
            borderRadius="lg"
            textAlign="center"
          >
            <HStack
              wrap="nowrap"
              justifyContent="flex-start"
              spacing="4px"
              maxWidth="100%"
              overflowX="scroll"
              paddingBottom="4px"
              padding="10px"
              borderRadius="md"
              boxShadow="md"
              backgroundColor={navBg}
              borderWidth="1px"
              borderColor={navBorderColor}
            >
              {/* Render buttons to navigate directly to each question */}
              {cardsToShow.map((_, index) => (
                <Button
                  key={index}
                  size={{ base: "md", md: "md" }}
                  width="40px"
                  onClick={() => handleNavigateQuestion(index)}
                  variant="outline"
                  colorScheme="teal"
                  opacity={selectedAnswers[index] ? 1 : 0.5}
                >
                  {index + 1}
                </Button>
              ))}
            </HStack>
            {/* Submit Quiz and Restart Quiz Buttons */}
            <VStack spacing="4" mt="6">
              <Button
                colorScheme="teal"
                size="lg"
                onClick={handleSubmitQuiz}
                isDisabled={!allQuestionsAnswered}
                width="100%"
              >
                Submit Quiz
              </Button>
              <Button
                colorScheme="teal"
                size="lg"
                onClick={handleRestartQuiz}
                width="100%"
              >
                Restart Quiz
              </Button>
            </VStack>
          </Box>
        </>
      )}
    </Center>
  );
};

export default QuizMode;
