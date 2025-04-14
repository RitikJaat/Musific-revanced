import React, { useState, useEffect, useRef } from 'react';
import { useMusicContext } from '../../context/MusicContext';

const Player = ({ alwaysExpanded }) => {
  const { 
    currentSong,
    isPlaying,
    playSong,
    pauseSong,
    resumeSong,
    skipToNext,
    skipToPrevious,
    audioRef,
    getHighestQualityUrl,
    isShuffleMode,
    toggleShuffle
  } = useMusicContext();
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const progressBarRef = useRef(null);

  // Update time display and progress
  useEffect(() => {
    const updateProgress = () => {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    };

    const timeUpdateHandler = () => {
      updateProgress();
    };

    audioRef.current.addEventListener('timeupdate', timeUpdateHandler);
    audioRef.current.addEventListener('loadedmetadata', updateProgress);
    
    return () => {
      audioRef.current.removeEventListener('timeupdate', timeUpdateHandler);
      audioRef.current.removeEventListener('loadedmetadata', updateProgress);
    };
  }, [audioRef]);

  // Handle repeat mode
  useEffect(() => {
    audioRef.current.loop = isRepeat;
    console.log('Repeat mode set to:', isRepeat);
  }, [isRepeat, audioRef]);

  const handleProgressChange = (e) => {
    const newTime = e.target.value;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handlePlayPauseToggle = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      if (currentSong) {
        resumeSong();
      }
    }
  };

  const formatTime = (time) => {
    if (!time) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get artist name(s)
  const artistNames = currentSong?.artists?.primary?.map(artist => artist.name).join(', ') || 'Unknown Artist';
  
  // Get song image with highest quality
  const songImage = currentSong?.image ? getHighestQualityUrl(currentSong.image) : '';

  return (
    <div className={`flex flex-col items-center ${alwaysExpanded ? 'w-full max-w-[180px]' : ''} group/he select-none`}>
      <div className={`relative z-0 h-16 -mb-2 transition-all duration-200 ${alwaysExpanded ? 'hidden' : 'group-hover/he:h-0'}`}>
        {songImage ? (
          <div className="w-32 h-32 overflow-hidden rounded-full">
            <img 
              src={songImage} 
              alt="Album Cover" 
              className="w-full h-full duration-500 border-4 rounded-full shadow-md border-zinc-400 border-spacing-5 animate-[spin_3s_linear_infinite] transition-all object-cover"
            />
          </div>
        ) : (
          <svg width={128} height={128} viewBox="0 0 128 128" className="duration-500 border-4 rounded-full shadow-md border-zinc-400 border-spacing-5 animate-[spin_3s_linear_infinite] transition-all">
            <svg>
              <rect width={128} height={128} fill="black" />
              <circle cx={20} cy={20} r={2} fill="white" />
              <circle cx={40} cy={30} r={2} fill="white" />
              <circle cx={60} cy={10} r={2} fill="white" />
              <circle cx={80} cy={40} r={2} fill="white" />
              <circle cx={100} cy={20} r={2} fill="white" />
              <circle cx={120} cy={50} r={2} fill="white" />
              <circle cx={90} cy={30} r={10} fill="white" fillOpacity="0.5" />
              <circle cx={90} cy={30} r={8} fill="white" />
              <path d="M0 128 Q32 64 64 128 T128 128" fill="purple" stroke="black" strokeWidth={1} />
              <path d="M0 128 Q32 48 64 128 T128 128" fill="mediumpurple" stroke="black" strokeWidth={1} />
              <path d="M0 128 Q32 32 64 128 T128 128" fill="rebeccapurple" stroke="black" strokeWidth={1} />
              <path d="M0 128 Q16 64 32 128 T64 128" fill="purple" stroke="black" strokeWidth={1} />
              <path d="M64 128 Q80 64 96 128 T128 128" fill="mediumpurple" stroke="black" strokeWidth={1} />
            </svg>
          </svg>
        )}
        <div className="absolute z-10 w-8 h-8 bg-white border-4 rounded-full shadow-sm border-zinc-400 top-12 left-12" />
      </div>
      <div className={`z-30 flex flex-col ${alwaysExpanded ? 'w-full h-auto' : 'w-40 h-20'} transition-all duration-300 bg-[#1b233d] shadow-md ${alwaysExpanded ? '' : 'group-hover/he:h-40 group-hover/he:w-72'} rounded-2xl shadow-zinc-400`}>
        <div className={`flex flex-row w-full ${alwaysExpanded ? 'h-16' : 'h-0 group-hover/he:h-20'}`}>
          <div className={`relative flex items-center justify-center ${alwaysExpanded ? 'w-14 h-14 ml-0 -top-0 -left-0 opacity-100 animate-[spin_3s_linear_infinite]' : 'w-24 h-24 group-hover/he:-top-6 group-hover/he:-left-4 opacity-0 group-hover/he:animate-[spin_3s_linear_infinite] group-hover/he:opacity-100'} transition-all duration-100`}>
            {songImage ? (
              <div className={`${alwaysExpanded ? 'w-12 h-12' : 'w-24 h-24'} overflow-hidden rounded-full ml-1`}>
                <img 
                  src={songImage} 
                  alt="Album Cover" 
                  className="w-full h-full duration-500 border-3 rounded-full shadow-md border-zinc-400 border-spacing-5 object-cover"
                />
              </div>
            ) : (
              <svg width={alwaysExpanded ? 48 : 96} height={alwaysExpanded ? 48 : 96} viewBox="0 0 128 128" className="duration-500 border-3 rounded-full shadow-md border-zinc-400 border-spacing-5 ml-1">
                <svg>
                  <rect width={128} height={128} fill="black" />
                  <circle cx={20} cy={20} r={2} fill="white" />
                  <circle cx={40} cy={30} r={2} fill="white" />
                  <circle cx={60} cy={10} r={2} fill="white" />
                  <circle cx={80} cy={40} r={2} fill="white" />
                  <circle cx={100} cy={20} r={2} fill="white" />
                  <circle cx={120} cy={50} r={2} fill="white" />
                  <circle cx={90} cy={30} r={10} fill="white" fillOpacity="0.5" />
                  <circle cx={90} cy={30} r={8} fill="white" />
                  <path d="M0 128 Q32 64 64 128 T128 128" fill="purple" stroke="black" strokeWidth={1} />
                  <path d="M0 128 Q32 48 64 128 T128 128" fill="mediumpurple" stroke="black" strokeWidth={1} />
                  <path d="M0 128 Q32 32 64 128 T128 128" fill="rebeccapurple" stroke="black" strokeWidth={1} />
                  <path d="M0 128 Q16 64 32 128 T64 128" fill="purple" stroke="black" strokeWidth={1} />
                  <path d="M64 128 Q80 64 96 128 T128 128" fill="mediumpurple" stroke="black" strokeWidth={1} />
                </svg>
              </svg>
            )}
            <div className={`absolute z-10 ${alwaysExpanded ? 'w-3 h-3 top-4 left-4 ml-1' : 'w-6 h-6 top-9 left-9'} bg-white border-3 rounded-full shadow-sm border-zinc-400`} />
          </div>
          <div className={`flex flex-col justify-center w-full pl-1 ${alwaysExpanded ? 'ml-0' : '-ml-24 group-hover/he:-ml-3'} overflow-hidden text-nowrap`}>
            <p className={`${alwaysExpanded ? 'text-sm' : 'text-xl'} font-bold truncate max-w-[110px]`}>{currentSong?.name || 'No Song Selected'}</p>
            <p className="text-[rgba(170,222,243,0.721)] text-xs truncate max-w-[110px]">{artistNames}</p>
          </div>
        </div>
        
        {/* Progress bar and time display - shown in expanded view */}
        <div className={`${alwaysExpanded ? 'flex' : 'hidden group-hover/he:flex'} flex-row items-center mx-2 mt-0`}>
          <span className="text-[9px] pl-1 text-[rgba(170,222,243,0.721)]">{formatTime(currentTime)}</span>
          <input 
            type="range" 
            min={0} 
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            ref={progressBarRef}
            className="w-full flex-grow h-1 mx-1 my-auto bg-gray-300 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-1 [&::-webkit-slider-thumb]:border-zinc-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md" 
          />
          <span className="text-[9px] pr-1 text-[rgba(170,222,243,0.721)]">{formatTime(duration)}</span>
        </div>

        {/* Simplified progress bar for compact view - no time display */}
        <div className={`${alwaysExpanded ? 'hidden' : 'flex group-hover/he:hidden'} flex-row items-center justify-center mx-3 mt-1`}>
          <input 
            type="range" 
            min={0} 
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            className="w-32 h-1 mx-auto bg-gray-300 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-zinc-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md" 
          />
        </div>
        
        {/* Control buttons - shown in expanded view */}
        <div className={`${alwaysExpanded ? 'flex' : 'hidden group-hover/he:flex'} flex-row items-center justify-center flex-grow mx-1 space-x-2`}>
          <label htmlFor="playMode" className="flex items-center justify-center w-7 h-full cursor-pointer">
            <input 
              type="checkbox" 
              id="playMode" 
              className="hidden peer/playMode" 
              checked={isRepeat}
              onChange={() => setIsRepeat(!isRepeat)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={isRepeat ? "#aadeef" : "#777"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-repeat">
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
          </label>
          <div className="flex items-center justify-center w-7 h-full cursor-pointer" onClick={skipToPrevious}>
            <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-skip-back">
              <polygon points="19 20 9 12 19 4 19 20" />
              <line x1={5} y1={19} x2={5} y2={5} />
            </svg>
          </div>
          <div 
            className="flex items-center justify-center w-9 h-full cursor-pointer" 
            onClick={handlePlayPauseToggle}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-pause">
                <rect x={6} y={4} width={4} height={16} />
                <rect x={14} y={4} width={4} height={16} />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-play">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </div>
          <div className="flex items-center justify-center w-7 h-full cursor-pointer" onClick={skipToNext}>
            <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-skip-forward">
              <polygon points="5 4 15 12 5 20 5 4" />
              <line x1={19} y1={5} x2={19} y2={19} />
            </svg>
          </div>
          <div className="flex items-center justify-center w-7 h-full cursor-pointer" onClick={toggleShuffle}>
            <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={isShuffleMode ? "#aadeef" : "#777"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-shuffle">
              <polyline points="16 3 21 3 21 8" />
              <line x1={4} y1={20} x2={21} y2={3} />
              <polyline points="21 16 21 21 16 21" />
              <line x1={15} y1={15} x2={21} y2={21} />
              <line x1={4} y1={4} x2={9} y2={9} />
            </svg>
          </div>
        </div>
        
        {/* Simple play/pause button visible only in compact mode */}
        <div className={`${alwaysExpanded ? 'hidden' : 'flex group-hover/he:hidden'} flex-row items-center justify-center flex-grow mx-3`}>
          <div 
            className="flex items-center justify-center w-12 h-full cursor-pointer" 
            onClick={handlePlayPauseToggle}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-pause">
                <rect x={6} y={4} width={4} height={16} />
                <rect x={14} y={4} width={4} height={16} />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-play">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Player;
