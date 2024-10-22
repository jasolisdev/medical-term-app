import React from "react";
import { Image } from "@chakra-ui/react";
import audioOnIcon from "../../assets/icons/audio_on.png";
import audioOffIcon from "../../assets/icons/audio_off.png";
import useAudio from "../../hooks/useAudio";

const AudioToggle = ({ audioSrc }) => {
  const { isPlaying, handlePlayAudio, handleStopAudio } = useAudio(audioSrc);

  return (
    <Image
      src={isPlaying ? audioOnIcon : audioOffIcon}
      alt="Audio Toggle"
      boxSize="20px"
      onClick={isPlaying ? handleStopAudio : handlePlayAudio}
      cursor="pointer"
    />
  );
};

export default AudioToggle;
