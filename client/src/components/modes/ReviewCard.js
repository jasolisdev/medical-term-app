import React, { useState, useEffect, useRef } from "react";
import { Box, Text, Image, Flex, useColorModeValue } from "@chakra-ui/react";
import { Howl } from "howler";
import { FaStar } from "react-icons/fa";
import audioOnIcon from "../../assets/icons/audio_on.png";
import audioOffIcon from "../../assets/icons/audio_off.png";

// Global reference to keep track of the currently playing audio instance
let currentPlayingAudio = null;

const ReviewCard = ({ card, toggleBookmark }) => {
  // State to track whether the audio is playing or not
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAudio, setHasAudio] = useState(null); // State to track if the card has an audio file
  const audioRef = useRef(null);

  // Color styles for light and dark modes
  const cardBg = useColorModeValue("white", "gray.700");
  const cardColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const boxShadow = useColorModeValue(
    "0 4px 8px rgba(0, 0, 0, 0.15)",
    "0 4px 8px rgba(0, 0, 0, 0.9)",
  );
  const audioIconColor = useColorModeValue("teal.700", "teal.300");
  const pronunciationColor = useColorModeValue("gray.600", "gray.400");
  const definitionColor = useColorModeValue("gray.700", "gray.300");

  // Function to construct the audio path based on the card's category and term
  const constructAudioPath = (card) => {
    if (!card || !card.category) {
      console.error("Card or card category is missing");
      return null;
    }

    // Extract chapter number from the card category using regex
    const chapterMatch = card.category.match(/Ch(\d+)/);
    if (!chapterMatch) {
      console.error("Invalid card category format");
      return null;
    }

    // Construct the path to the audio file
    const chapterNumber = chapterMatch[1];
    return `${process.env.PUBLIC_URL}/audio/ch${chapterNumber}_audio/${card.term
      .toLowerCase()
      .replace(/ /g, "_")}.mp3`;
  };

  // Use effect to determine if the audio file exists and set the state accordingly
  useEffect(() => {
    const checkAudioAvailability = async () => {
      const audioPath = constructAudioPath(card);
      if (audioPath) {
        try {
          const response = await fetch(audioPath, { method: "HEAD" });
          setHasAudio(response.ok);
        } catch (error) {
          console.error("Error checking audio file:", error);
          setHasAudio(false);
        }
      } else {
        setHasAudio(false);
      }
    };

    checkAudioAvailability();
  }, [card]);

  // Function to handle playing the audio
  const playAudio = () => {
    if (!hasAudio) return;

    const audioPath = constructAudioPath(card);
    if (!audioPath) return;

    // Stop any currently playing audio to ensure only one audio file plays at a time
    if (currentPlayingAudio && currentPlayingAudio !== audioRef.current) {
      currentPlayingAudio.stop();
      currentPlayingAudio = null;
    }

    if (isPlaying) {
      return;
    }

    // Create a new Howl audio instance for the current card
    audioRef.current = new Howl({
      src: [audioPath],
      html5: true,
      onplay: () => {
        setIsPlaying(true);
        currentPlayingAudio = audioRef.current; // Set the current global playing audio
      },
      onend: () => {
        setIsPlaying(false);
        currentPlayingAudio = null; // Clear global reference after playback ends
      },
      onstop: () => {
        setIsPlaying(false);
        if (currentPlayingAudio === audioRef.current) {
          currentPlayingAudio = null; // Clear global reference if this was the current audio
        }
      },
      onloaderror: (id, err) => {
        console.error("Error loading audio:", err);
        setIsPlaying(false);
      },
      onplayerror: (id, err) => {
        console.error("Error playing audio:", err);
        audioRef.current.once("unlock", () => audioRef.current.play());
      },
    });

    // Play the audio
    audioRef.current.play();
  };

  // Function to handle stopping the audio
  const stopAudio = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.stop();
    }
  };

  // Function to handle toggling audio play/pause
  const handleAudioToggle = (event) => {
    event.stopPropagation(); // Prevent card flip
    if (isPlaying) {
      stopAudio();
    } else {
      playAudio();
    }
  };

  // Function to render the pronunciation with special styling for capitalized segments
  const renderPronunciation = (pronunciation) => {
    return pronunciation.split(/(\s|-)/).map((segment, index) => {
      if (segment.match(/[A-Z]+/)) {
        return (
          <span key={index} style={{ fontWeight: "bold", color: "#e53e3e" }}>
            {segment}
          </span>
        );
      } else {
        return <span key={index}>{segment}</span>;
      }
    });
  };

  // Extract chapter information to display on the card
  const chapterMatch = card.category.match(/Ch(\d+)/);
  const chapterInfo = chapterMatch ? `Ch. ${chapterMatch[1]}` : "";

  return (
    <Box
      width="300px"
      margin="20px auto"
      padding="20px"
      borderRadius="8px"
      boxShadow={boxShadow}
      backgroundColor={cardBg}
      color={cardColor}
      textAlign="center"
      position="relative"
    >
      {/* Star Icon for Bookmarking */}
      <Box
        position="absolute"
        top="10px"
        left="10px"
        cursor="pointer"
        fontSize="20px" // Adjust this value to make the star bigger (e.g., "30px" or "40px")
        onClick={() => toggleBookmark(card)}
      >
        <FaStar color={card.isBookmarked ? "gold" : "gray"} />
      </Box>
      <Flex justify="center" align="center">
        {/* Audio Icon for toggling audio play */}
        {hasAudio && (
          <Image
            src={isPlaying ? audioOnIcon : audioOffIcon}
            alt="Audio Icon"
            boxSize="20px"
            onClick={handleAudioToggle}
            cursor="pointer"
            mr="10px"
          />
        )}
        {/* Display the term of the card */}
        <Text fontSize="xl" fontWeight="bold" color={audioIconColor}>
          {card.term}
        </Text>
      </Flex>
      {/* Display the pronunciation if available */}
      {card.pronunciation && (
        <Text fontSize="md" color={pronunciationColor} mt="2">
          <em>{renderPronunciation(card.pronunciation)}</em>
        </Text>
      )}
      {/* Display the definition of the term */}
      <Text fontSize="md" color={definitionColor} mt="4">
        {card.definition}
      </Text>
      {/* Chapter Info Display */}
      <Text
        fontSize="sm"
        color={pronunciationColor}
        position="absolute"
        bottom="5px"
        right="10px"
      >
        {chapterInfo}
      </Text>
    </Box>
  );
};

export default ReviewCard;
