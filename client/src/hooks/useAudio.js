import { useContext, useRef, useState } from "react";
import { AudioContext } from "../context/AudioContext";
import { Howl } from "howler";

const useAudio = (audioSrc) => {
  const { currentAudio, playAudio } = useContext(AudioContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handlePlayAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Howl({
        src: [audioSrc],
        html5: true,
        onplay: () => {
          setIsPlaying(true);
          playAudio(audioRef.current);
        },
        onend: () => {
          setIsPlaying(false);
          audioRef.current = null;
        },
        onstop: () => {
          setIsPlaying(false);
          audioRef.current = null;
        },
      });
    }
    audioRef.current.play();
  };

  const handleStopAudio = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.stop();
    }
  };

  return { isPlaying, handlePlayAudio, handleStopAudio };
};

export default useAudio;
