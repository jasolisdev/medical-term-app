// src/App.js
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  Flex,
  Spacer,
  HStack,
  VStack,
  Heading,
  useColorMode,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon, HamburgerIcon } from "@chakra-ui/icons";
import FlashcardMode from "./components/modes/FlashcardMode";
import QuizMode from "./components/modes/QuizMode";
import ReviewMode from "./components/modes/ReviewMode";
import flashcardsData from "./data/terms.json";
import { useAuth } from "./context/AuthContext"; // Import useAuth to access logout
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ForgotUsername from "./components/ForgotUsername";
import ProtectedRoute from "./components/ProtectedRoute";

// Main App component
function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { logout, isAuthenticated } = useAuth(); // Get logout function and isAuthenticated from AuthContext
  const categories = [...new Set(flashcardsData.map((card) => card.category))];

  // State for bookmarked cards
  const [bookmarkedCards, setBookmarkedCards] = useState(() => {
    const savedBookmarks = localStorage.getItem("bookmarkedCards");
    return savedBookmarks ? JSON.parse(savedBookmarks) : [];
  });

  // Function to toggle bookmarks
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

  // Use `useColorModeValue` outside of conditionals
  const navBgColor = useColorModeValue("teal.500", "gray.900");
  const borderBottomColor = useColorModeValue("gray.200", "gray.700");

  // Main layout for the Medical Term App
  const MedicalTermApp = () => (
    <Box>
      <Flex
        as="nav"
        bg={navBgColor}
        p="2"
        boxShadow="lg"
        alignItems="center"
        position="sticky"
        top="0"
        zIndex="10"
        borderBottomWidth={1}
        borderBottomColor={borderBottomColor}
        height="70px"
      >
        <HStack spacing="4">
          <Box boxSize={{ base: "70px", md: "40px" }} mt="2">
            <img
              src="/medical-term-app/images/book-cover.jpg"
              alt="Book Cover"
              style={{ width: "100%", height: "auto" }}
            />
          </Box>
          <VStack align="center" spacing="0">
            <Heading
              size={{ base: "sm", md: "md" }}
              color="white"
              textAlign="center"
            >
              Medical Terminology for Health Professions 9th Edition
            </Heading>
          </VStack>
        </HStack>
        <Spacer />
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<HamburgerIcon />}
            variant="outline"
            aria-label="Options"
            colorScheme="teal"
          />
          <MenuList>
            <MenuItem
              onClick={toggleColorMode}
              icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            >
              {colorMode === "light" ? "Toggle Dark Mode" : "Toggle Light Mode"}
            </MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      {/* Tabs for different modes */}
      <Tabs variant="enclosed" colorScheme="teal" mt="4">
        <TabList>
          <Tab>Flashcards</Tab>
          <Tab>Quiz</Tab>
          <Tab>Review</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <FlashcardMode
              flashcardsData={flashcardsData}
              categories={categories}
              bookmarkedCards={bookmarkedCards}
              toggleBookmark={toggleBookmark}
            />
          </TabPanel>
          <TabPanel>
            <QuizMode flashcardsData={flashcardsData} categories={categories} />
          </TabPanel>
          <TabPanel>
            <ReviewMode
              flashcardsData={flashcardsData}
              categories={categories}
              bookmarkedCards={bookmarkedCards}
              toggleBookmark={toggleBookmark}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/forgot-username" element={<ForgotUsername />} />

      {/* Protected Route for Medical Term App */}
      <Route
        path="/medical-term-app/*"
        element={
          <ProtectedRoute>
            <MedicalTermApp />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
