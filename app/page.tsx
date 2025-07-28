"use client"; // Эта директива ОБЯЗАТЕЛЬНА для хуков и интерактивности

import Image from 'next/image';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IoPlaySkipBack, IoPlaySkipForward, IoPlay, IoPause, IoVolumeMedium, IoVolumeMute } from "react-icons/io5";

// Экспортируем тип Track, чтобы его можно было использовать в page.tsx
export interface Track {
  title: string;
  artist: string;
  coverUrl: string;
  trackUrl: string;
}

interface MusicPlayerProps {
  initialTracks: Track[];
}

export default function MusicPlayer({ initialTracks }: MusicPlayerProps) {
  const [tracks] = useState<Track[]>(initialTracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  // Функция для форматирования времени из секунд в мм:сс
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const goToNextTrack = useCallback(() => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
  }, [currentTrackIndex, tracks.length]);
  
  const goToPrevTrack = () => {
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIndex);
  };

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = volume;
    }
  }, [volume]);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const setAudioData = () => {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
      }
      const setAudioTime = () => setCurrentTime(audio.currentTime);

      audio.addEventListener('loadeddata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('ended', goToNextTrack);
      
      if (isPlaying) {
        audio.play().catch(e => console.error("Error playing audio:", e));
      }

      return () => {
        audio.removeEventListener('loadeddata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('ended', goToNextTrack);
      }
    }
  }, [currentTrackIndex, isPlaying, goToNextTrack]);
  
  return (
    <div className="w-full max-w-md glass-card rounded-2xl shadow-lg p-6 font-poppins space-y-6">
      {/* Аудио элемент (скрыт) */}
      <audio ref={audioRef} src={currentTrack.trackUrl} preload="metadata" />

      {/* Обложка и инфо */}
      <div className="flex items-center space-x-4">
        <div className="w-24 h-24 relative flex-shrink-0">
          <Image
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            fill
            className="rounded-lg object-cover shadow-md"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold truncate">{currentTrack.title}</h2>
          <p className="text-sm text-gray-300 font-nunito">{currentTrack.artist}</p>
        </div>
      </div>
      
      {/* Прогресс-бар */}
      <div className="space-y-1">
        <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => {
                if(audioRef.current) audioRef.current.currentTime = Number(e.target.value)
            }}
            className="w-full h-1.5"
        />
        <div className="flex justify-between text-xs font-mono text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Управление плеером */}
      <div className="flex items-center justify-center space-x-6">
        <button onClick={goToPrevTrack} className="text-gray-300 hover:text-white transition-colors duration-200">
            <IoPlaySkipBack size={24} />
        </button>
        <button onClick={handlePlayPause} className="bg-white text-black w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
            {isPlaying ? <IoPause size={28} /> : <IoPlay size={28} className="ml-1" />}
        </button>
        <button onClick={goToNextTrack} className="text-gray-300 hover:text-white transition-colors duration-200">
            <IoPlaySkipForward size={24} />
        </button>
      </div>

      {/* Громкость */}
      <div className="flex items-center space-x-2">
        <button onClick={() => setVolume(v => v > 0 ? 0 : 0.7)}>
            {volume > 0 ? <IoVolumeMedium size={20} className="text-gray-400" /> : <IoVolumeMute size={20} className="text-gray-400"/>}
        </button>
        <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-1.5"
        />
      </div>
    </div>
  );
}
