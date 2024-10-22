import React from "react";
import { Link } from "react-router-dom";
import { Box, Button, VStack } from "@chakra-ui/react";

const HomePage = () => {
  return (
    <Box textAlign="center" mt="10">
      <h1>Welcome to the Medical Term App</h1>
      <VStack spacing={4} mt={8}>
        <Link to="/flashcard">
          <Button colorScheme="teal" variant="solid">
            Flashcard Mode
          </Button>
        </Link>
        <Link to="/review">
          <Button colorScheme="teal" variant="solid">
            Review Mode
          </Button>
        </Link>
        <Link to="/quiz">
          <Button colorScheme="teal" variant="solid">
            Quiz Mode
          </Button>
        </Link>
      </VStack>
    </Box>
  );
};

export default HomePage;
