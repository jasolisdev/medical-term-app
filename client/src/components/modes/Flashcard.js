import React, { useState, useEffect, useRef } from "react";
import { Box, Text, Image, Flex, useColorModeValue } from "@chakra-ui/react";
import { Howl } from "howler";
import audioOnIcon from "../../assets/icons/audio_on.png";
import audioOffIcon from "../../assets/icons/audio_off.png";
import { FaStar } from "react-icons/fa";

// Global reference to keep track of the currently playing audio
let currentPlayingAudio = null;

const flipDuration = 300; // Duration of the flip animation in milliseconds

const Flashcard = ({
  card,
  isFlipped,
  onFlip,
  isBookmarked,
  toggleBookmark,
}) => {
  const [termCard, setTermCard] = useState(card);
  const [definitionCard, setDefinitionCard] = useState(card);
  const [isPlaying, setIsPlaying] = useState(false);
  const [starVisible, setStarVisible] = useState(true);
  const audioRef = useRef(null);

  // Styles for light and dark modes
  const cardBgFront = useColorModeValue("white", "gray.700");
  const cardBgBack = useColorModeValue("#e3fcef", "gray.600");
  const cardTextColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const pronunciationColor = useColorModeValue("gray.600", "gray.400");
  const definitionColor = useColorModeValue("gray.700", "whiteAlpha.800");
  const termColor = useColorModeValue("teal.700", "teal.300");
  const boxShadow = useColorModeValue(
    "0 4px 8px rgba(0, 0, 0, 0.15)",
    "0 4px 8px rgba(0, 0, 0, 0.9)",
  );

  // Update termCard immediately when card changes
  useEffect(() => {
    setTermCard(card);
  }, [card]);

  // Update definitionCard after the card has finished flipping back to the term side
  useEffect(() => {
    if (!isFlipped) {
      const timeout = setTimeout(() => {
        setDefinitionCard(card);
      }, flipDuration);
      return () => clearTimeout(timeout);
    }
  }, [card, isFlipped]);

  // Manage visibility of the star icon with a delay
  useEffect(() => {
    if (isFlipped) {
      // Hide the star after a delay when the card is flipped
      const timeout = setTimeout(() => {
        setStarVisible(false);
      }, 100); // Delay in milliseconds to hide star
      return () => clearTimeout(timeout);
    } else {
      // Show the star after a delay when the card is flipped back
      const timeout = setTimeout(() => {
        setStarVisible(true);
      }, 100); // Delay in milliseconds to show star
      return () => clearTimeout(timeout);
    }
  }, [isFlipped]);

  // Cleanup effect to stop playing audio when the component is unmounted
  useEffect(() => {
    return () => {
      if (currentPlayingAudio) {
        currentPlayingAudio.stop();
        currentPlayingAudio = null;
      }
    };
  }, []);

  // Function to construct the audio path based on the card's category and term
  const constructAudioPath = (card) => {
    if (!card || !card.category) {
      console.error("Card or card category is missing");
      return null;
    }

    const chapterMatch = card.category.match(/Ch(\d+)/);
    if (!chapterMatch) {
      console.error("Invalid card category format");
      return null;
    }

    const chapterNumber = chapterMatch[1];
    return `${process.env.PUBLIC_URL}/audio/ch${chapterNumber}_audio/${card.term
      .toLowerCase()
      .replace(/ /g, "_")}.mp3`;
  };

  // Function to play audio
  const playAudio = () => {
    const audioPath = constructAudioPath(termCard);
    if (!audioPath) return;

    // Stop any currently playing audio
    if (currentPlayingAudio && currentPlayingAudio !== audioRef.current) {
      currentPlayingAudio.stop();
    }

    // Create a new Howl instance for the current card
    audioRef.current = new Howl({
      src: [audioPath],
      html5: true,
      onplay: () => {
        setIsPlaying(true);
        currentPlayingAudio = audioRef.current;
      },
      onend: () => {
        setIsPlaying(false);
        currentPlayingAudio = null;
      },
      onstop: () => {
        setIsPlaying(false);
        if (currentPlayingAudio === audioRef.current) {
          currentPlayingAudio = null;
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

  // Function to stop the audio
  const stopAudio = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.stop();
    }
  };

  // Toggle audio playback
  const handleAudioToggle = (event) => {
    event.stopPropagation(); // Prevent card flip
    if (isPlaying) {
      stopAudio();
    } else {
      playAudio();
    }
  };

  // Handle card flip
  const handleFlip = () => {
    onFlip();
  };

  // Function to render pronunciation with styling for capitalized segments
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

  return (
    <Box
      className={`flashcard-container`}
      sx={{
        width: "300px",
        height: "200px",
        perspective: "1000px",
        margin: "20px auto",
        position: "relative",
      }}
    >
      {/* Layered Deck Background */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: "10px",
          left: "10px",
          backgroundColor: useColorModeValue("white", "gray.600"),
          borderRadius: "8px",
          boxShadow: boxShadow,
          transform: "rotate(-2deg)",
          zIndex: 0,
        }}
      ></Box>
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: "5px",
          left: "5px",
          backgroundColor: useColorModeValue("white", "gray.600"),
          borderRadius: "8px",
          boxShadow: boxShadow,
          transform: "rotate(1deg)",
          zIndex: 0,
        }}
      ></Box>

      {/* Main Flashcard */}
      <Box
        className={`flashcard ${isFlipped ? "flipped" : ""}`}
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          cursor: "pointer",
          zIndex: 1,
        }}
        onClick={handleFlip}
      >
        <Box
          className="flashcard-inner"
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            textAlign: "center",
            transition: `transform ${flipDuration}ms ease-in-out`,
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front Side */}
          <Box
            className="flashcard-front"
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              borderRadius: "8px",
              boxShadow: boxShadow,
              backgroundColor: cardBgFront,
              color: cardTextColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              padding: "10px",
            }}
          >
            {/* Star Icon only on the front side */}
            {starVisible && (
              <Box
                position="absolute"
                top="10px"
                left="10px"
                zIndex="1"
                cursor="pointer"
                fontSize="30px"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent flipping on bookmark click
                  toggleBookmark(termCard);
                }}
              >
                <FaStar color={isBookmarked ? "gold" : "gray"} />
              </Box>
            )}

            <Flex justify="center" align="center">
              {/* Use termCard for the audioFile */}
              {termCard.audioFile && (
                <Image
                  src={isPlaying ? audioOnIcon : audioOffIcon}
                  alt="Audio Icon"
                  boxSize="30px"
                  onClick={handleAudioToggle}
                  cursor="pointer"
                  mr="10px"
                />
              )}
              <Text fontSize="25px" color={termColor}>
                {termCard.term}
              </Text>
            </Flex>
            {termCard.pronunciation && (
              <Text fontSize="md" color={pronunciationColor} mt="2">
                <em>{renderPronunciation(termCard.pronunciation)}</em>
              </Text>
            )}
          </Box>

          {/* Back Side */}
          <Box
            className="flashcard-back"
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              borderRadius: "8px",
              boxShadow: boxShadow,
              backgroundColor: cardBgBack,
              color: cardTextColor,
              transform: "rotateY(180deg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px",
            }}
          >
            <Text fontSize="md" color={definitionColor}>
              {definitionCard.definition}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Flashcard;
