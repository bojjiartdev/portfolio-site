"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { Howl } from "howler";
import { Volume2, VolumeX } from "lucide-react";
import styles from "./AudioPlayer.module.css";

interface AudioPlayerProps {
  src: string;
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  initialVolume?: number;
}

const AudioPlayer = memo(
  ({
    src,
    width = 17,
    height = 17,
    color = "currentColor",
    className = "audio-button",
    initialVolume = 0.7,
  }: AudioPlayerProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [sound, setSound] = useState<Howl | null>(null);

    // handleClickをメモ化
    const handleClick = useCallback(() => {
      if (!sound) return;

      if (!isPlaying) {
        sound.volume(isMuted ? 0 : initialVolume);
        sound.play();
      } else {
        setIsMuted(!isMuted);
        sound.volume(isMuted ? initialVolume : 0);
      }
    }, [sound, isPlaying, isMuted, initialVolume]);

    useEffect(() => {
      const newSound = new Howl({
        src: [src],
        volume: initialVolume,
        html5: true,
        autoplay: false,
        loop: true,
        onplay: () => setIsPlaying(true),
        onpause: () => setIsPlaying(false),
        onstop: () => setIsPlaying(false),
        onloaderror: (_, error) => console.error("Error loading audio:", error),
        onplayerror: (_, error) => console.error("Error playing audio:", error),
      });

      setSound(newSound);
      return () => {
        newSound.unload();
      };
    }, [src, initialVolume]);

    return (
      <button
        onClick={handleClick}
        className={`hidden md:block md:sticky md:inset-0 ${styles["audio-button"]} ${className}`}
        aria-label={isPlaying ? (isMuted ? "Unmute" : "Mute") : "Play"}
      >
        {isMuted || !isPlaying ? (
          <VolumeX
            width={width}
            height={height}
            color={color}
            className={styles["audio-mute"]}
          />
        ) : (
          <Volume2
            width={width}
            height={height}
            color={color}
            className={styles["audio-play"]}
          />
        )}
      </button>
    );
  }
);

AudioPlayer.displayName = "AudioPlayer";

export default AudioPlayer;
