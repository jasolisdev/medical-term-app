import React, { createContext, useState } from "react";

export const AudioContext = createContext();

const AudioProvider = ({ children }) => {
  const [currentAudio, setCurrentAudio] = useState(null);

  const playAudio = (audioInstance) => {
    if (currentAudio && currentAudio !== audioInstance) {
      currentAudio.stop();
    }
    setCurrentAudio(audioInstance);
  };

  return (
    <AudioContext.Provider value={{ currentAudio, playAudio }}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;
