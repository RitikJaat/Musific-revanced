import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { 
  searchMusic, 
  fetchTrending, 
  fetchAttHits, 
  fetchNewReleases, 
  fetchHaryanviSongs, 
  fetchTop100,
  fetchPunjabiHits,
  fetchRomanticSongs,
  fetchPlaylistById
} from '../services/api';

const MusicContext = createContext();

export const useMusicContext = () => useContext(MusicContext);

// Helper function to get highest quality media URL
const getHighestQualityUrl = (urls) => {
  if (!urls || !urls.length) return '';
  
  // Try to find 320kbps for audio or 500x500 for images
  const highQuality = urls.find(url => url.quality === '320kbps' || url.quality === '500x500');
  if (highQuality) return highQuality.url;
  
  // Or sort by quality if possible (assuming quality might have numeric value)
  const sortedUrls = [...urls].sort((a, b) => {
    const qualityA = parseInt(a.quality) || 0;
    const qualityB = parseInt(b.quality) || 0;
    return qualityB - qualityA;
  });
  
  return sortedUrls[0]?.url || '';
};

export const MusicProvider = ({ children }) => {
  // Audio States
  const [audio, setAudio] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Queue States
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [showQueue, setShowQueue] = useState(true);
  const [originalQueue, setOriginalQueue] = useState([]);
  const [history, setHistory] = useState([]);

  // Search State
  const [searchResults, setSearchResults] = useState([]);
  const [searchPlaylistResults, setSearchPlaylistResults] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  
  // Playlists States
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [attHits, setAttHits] = useState([]);
  const [haryanviSongs, setHaryanviSongs] = useState([]);
  const [top100Songs, setTop100Songs] = useState([]);
  const [punjabiHits, setPunjabiHits] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [romanticSongs, setRomanticSongs] = useState([]);
  
  // User Playlists
  const [userPlaylists, setUserPlaylists] = useState(
    JSON.parse(localStorage.getItem('userPlaylists')) || {}
  );
  const [activePlaylistName, setActivePlaylistName] = useState(null);
  const [activePlaylistSongs, setActivePlaylistSongs] = useState([]);
  
  const [playlists, setPlaylists] = useState([]);
  const [currentSongUrl, setCurrentSongUrl] = useState('');
  const audioRef = useRef(new Audio());
  const currentSongIdRef = useRef(null);
  const playPromiseRef = useRef(null); // Store play promise to handle async properly
  
  // Log for debugging
  useEffect(() => {
    console.log('Current song state: ', { 
      id: currentSong?.id, 
      name: currentSong?.name,
      downloadUrl: currentSong?.downloadUrl ? 'Has URLs' : 'No URLs',
      isPlaying 
    });
  }, [currentSong, isPlaying]);

  // Force audio to load when current song changes
  useEffect(() => {
    const loadAudio = async () => {
      if (currentSong && currentSong.downloadUrl && currentSong.downloadUrl.length > 0) {
        try {
          // Get highest quality URL
          const highQualityUrl = getHighestQualityUrl(currentSong.downloadUrl);
          console.log('Setting audio URL:', highQualityUrl);
          
          if (!highQualityUrl) {
            console.error("No valid audio URL found for this song");
            return;
          }
          
          // Update current song URL
          setCurrentSongUrl(highQualityUrl);
          
          // Set new source for audio
          audioRef.current.src = highQualityUrl;
          audioRef.current.load();
          console.log('New audio source loaded successfully');
          
          // Update current song ID ref
          currentSongIdRef.current = currentSong.id;
          
          // If isPlaying is true, play the song
          if (isPlaying) {
            try {
              const playPromise = audioRef.current.play();
              if (playPromise !== undefined) {
                playPromise.catch(error => {
                  console.error("Error auto-playing loaded audio:", error);
                });
              }
            } catch (e) {
              console.error("Error playing newly loaded audio:", e);
            }
          }
        } catch (error) {
          console.error("Error loading audio:", error);
        }
      }
    };
    
    loadAudio();
  }, [currentSong]);

  // Handle play/pause with proper promise handling to avoid abort errors
  useEffect(() => {
    const handlePlayPause = async () => {
      // Log for debugging
      console.log('Handle play/pause called, isPlaying:', isPlaying);
      console.log('Current song ID:', currentSongIdRef.current);
      console.log('New song ID:', currentSong?.id);
      console.log('Current Audio Source:', audioRef.current.src);
      console.log('Current Song URL:', currentSongUrl);
      
      try {
        // Clear any existing play promise to avoid abort errors
        if (playPromiseRef.current) {
          try {
            await playPromiseRef.current;
          } catch (e) {
            console.log('Previous play promise resolved');
          }
          playPromiseRef.current = null;
        }

        if (currentSong && isPlaying) {
          // Make sure we have a valid source
          if (!audioRef.current.src || audioRef.current.src === 'about:blank' || audioRef.current.src === window.location.href) {
            console.log('No valid audio source, setting from currentSong');
            const highQualityUrl = getHighestQualityUrl(currentSong.downloadUrl);
            
            if (!highQualityUrl) {
              console.error("No valid audio URL found for this song");
              setIsPlaying(false);
              return;
            }
            
            audioRef.current.src = highQualityUrl;
            setCurrentSongUrl(highQualityUrl);
            audioRef.current.load();
            console.log('Audio source set and loaded from currentSong');
          }
          
          // Play the audio with proper promise handling
          console.log('Attempting to play audio from URL:', audioRef.current.src);
          playPromiseRef.current = audioRef.current.play();
          
          if (playPromiseRef.current) {
            console.log('Play promise created');
            playPromiseRef.current
              .then(() => {
                console.log('Play promise fulfilled successfully');
                playPromiseRef.current = null;
              })
              .catch(error => {
                console.error("Error playing audio:", error);
                // Try one more time with forced reload
                console.log('Attempting to reload and play again');
                try {
                  audioRef.current.load();
                  audioRef.current.play().catch(err => {
                    console.error("Second play attempt failed:", err);
                    setIsPlaying(false);
                  });
                } catch (e) {
                  console.error("Error in second play attempt:", e);
                  setIsPlaying(false);
                }
                playPromiseRef.current = null;
              });
          }
        } else if (audioRef.current) {
          // Ensure we handle pause properly
          console.log('Pausing audio');
          audioRef.current.pause();
        }
      } catch (error) {
        console.error("Unexpected error in handlePlayPause:", error);
        setIsPlaying(false);
      }
    };
    
    handlePlayPause();
  }, [isPlaying]);

  // Handle audio end
  useEffect(() => {
    const handleAudioEnd = () => {
      console.log('Audio ended, queue length:', queue.length);
      if (queue.length > 0) {
        // Add current song to history before moving to next song
        if (currentSong) {
          setHistory(prev => [currentSong, ...prev.slice(0, 49)]); // Limit history to 50 songs
        }
        
        const nextSong = queue[0];
        const newQueue = queue.slice(1);
        
        if (nextSong) {
          console.log('Playing next song:', nextSong.name);
          
          // Set new current song
          setCurrentSong(nextSong);
          currentSongIdRef.current = nextSong.id;
          
          // Update queue
          setQueue(newQueue);
          
          // Prepare the audio URL
          const highQualityUrl = getHighestQualityUrl(nextSong.downloadUrl);
          if (highQualityUrl) {
            setCurrentSongUrl(highQualityUrl);
            audioRef.current.src = highQualityUrl;
            audioRef.current.load();
            
            // Set playing state
            setIsPlaying(true);
            
            // Try to play immediately
            try {
              const playPromise = audioRef.current.play();
              if (playPromise !== undefined) {
                playPromise.catch(error => {
                  console.error("Error auto-playing next song:", error);
                  // Set playing state anyway, the useEffect for isPlaying will handle retry
                  setIsPlaying(true);
                });
              }
            } catch (e) {
              console.error("Error starting playback of next song:", e);
              // Set playing state anyway, the useEffect for isPlaying will handle retry
              setIsPlaying(true);
            }
          } else {
            console.error("Could not get URL for next song", nextSong);
            setIsPlaying(false);
          }
        } else {
          console.warn("Next song in queue is null");
          setIsPlaying(false);
        }
      } else {
        if (currentSong) {
          setHistory(prev => [currentSong, ...prev.slice(0, 49)]); // Add last song to history
        }
        setIsPlaying(false);
      }
    };

    audioRef.current.addEventListener('ended', handleAudioEnd);
    return () => {
      audioRef.current.removeEventListener('ended', handleAudioEnd);
    };
  }, [queue, currentSong]);
  
  // Add error handler for audio
  useEffect(() => {
    const handleError = (e) => {
      console.error('Audio error:', e);
      console.error('Audio error code:', audioRef.current.error ? audioRef.current.error.code : 'No error code');
      console.error('Audio error message:', audioRef.current.error ? audioRef.current.error.message : 'No error message');
      console.error('Current audio src:', audioRef.current.src);
    };
    
    audioRef.current.addEventListener('error', handleError);
    return () => {
      audioRef.current.removeEventListener('error', handleError);
    };
  }, []);

  // Load trending songs on initial render
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log('Loading trending songs and playlists...');
        
        // Load trending songs
        const trendingResponse = await fetchTrending();
        if (trendingResponse.success && trendingResponse.data?.results?.length > 0) {
          console.log('Trending songs loaded:', trendingResponse.data.results.length);
          
          // Verify each song has download URLs
          const validTrendingSongs = trendingResponse.data.results.filter(song => {
            const hasUrls = song.downloadUrl && song.downloadUrl.length > 0;
            if (!hasUrls) {
              console.warn('Song missing download URLs:', song.name, song.id);
            }
            return hasUrls;
          });
          
          console.log('Valid trending songs with download URLs:', validTrendingSongs.length);
          setTrendingSongs(validTrendingSongs);
        }
        
        // Load Att Hits playlist
        const attHitsResponse = await fetchAttHits();
        if (attHitsResponse.success && attHitsResponse.data?.results?.length > 0) {
          const validSongs = attHitsResponse.data.results.filter(song => 
            song.downloadUrl && song.downloadUrl.length > 0
          );
          console.log('Att Hits songs loaded:', validSongs.length);
          setAttHits(validSongs);
        }
        
        // Load Haryanvi Songs
        const haryanviResponse = await fetchHaryanviSongs();
        if (haryanviResponse.success && haryanviResponse.data?.results?.length > 0) {
          const validSongs = haryanviResponse.data.results.filter(song => 
            song.downloadUrl && song.downloadUrl.length > 0
          );
          console.log('Haryanvi songs loaded:', validSongs.length);
          setHaryanviSongs(validSongs);
        }
        
        // Load Top 100 Songs
        const top100Response = await fetchTop100();
        if (top100Response.success && top100Response.data?.results?.length > 0) {
          const validSongs = top100Response.data.results.filter(song => 
            song.downloadUrl && song.downloadUrl.length > 0
          );
          console.log('Top 100 songs loaded:', validSongs.length);
          setTop100Songs(validSongs);
        }

        // Load Punjabi Hits
        const punjabiResponse = await fetchPunjabiHits();
        if (punjabiResponse.success && punjabiResponse.data?.results?.length > 0) {
          const validSongs = punjabiResponse.data.results.filter(song => 
            song.downloadUrl && song.downloadUrl.length > 0
          );
          console.log('Punjabi Hits loaded:', validSongs.length);
          setPunjabiHits(validSongs);
        }
        
        // Load New Releases
        const newReleasesResponse = await fetchNewReleases();
        if (newReleasesResponse.success && newReleasesResponse.data?.results?.length > 0) {
          const validSongs = newReleasesResponse.data.results.filter(song => 
            song.downloadUrl && song.downloadUrl.length > 0
          );
          console.log('New Releases loaded:', validSongs.length);
          setNewReleases(validSongs);
        }
        
        // Load Romantic Songs
        const romanticResponse = await fetchRomanticSongs();
        if (romanticResponse.success && romanticResponse.data?.results?.length > 0) {
          const validSongs = romanticResponse.data.results.filter(song => 
            song.downloadUrl && song.downloadUrl.length > 0
          );
          console.log('Romantic Songs loaded:', validSongs.length);
          setRomanticSongs(validSongs);
        }
        
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };
    
    loadInitialData();
  }, []);

  // Toggle shuffle mode
  const toggleShuffle = () => {
    const newShuffleState = !isShuffle;
    console.log('Toggling shuffle mode to:', newShuffleState);
    
    // If turning shuffle on
    if (newShuffleState) {
      // Save current queue as original
      setOriginalQueue([...queue]);
      
      // Shuffle the queue
      const shuffledQueue = [...queue];
      for (let i = shuffledQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledQueue[i], shuffledQueue[j]] = [shuffledQueue[j], shuffledQueue[i]];
      }
      
      console.log('Queue shuffled, new order contains', shuffledQueue.length, 'songs');
      setQueue(shuffledQueue);
    } 
    // If turning shuffle off, restore original queue
    else if (originalQueue.length > 0) {
      console.log('Restoring original queue with', originalQueue.length, 'songs');
      setQueue(originalQueue);
      setOriginalQueue([]);
    }
    
    setIsShuffle(newShuffleState);
  };

  // Function to empty the queue
  const emptyQueue = () => {
    console.log('Emptying queue...');
    setQueue([]);
    setOriginalQueue([]);
  };

  // Function to set active playlist for the playlist view
  const setActivePlaylist = (name, songs) => {
    console.log(`Setting active playlist to ${name} with ${songs.length} songs`);
    setActivePlaylistName(name);
    setActivePlaylistSongs(songs);
  };

  // Function to play all songs in a playlist
  const playAllFromPlaylist = (playlistSongs) => {
    if (!playlistSongs || playlistSongs.length === 0) {
      console.error('Attempted to play empty playlist');
      return;
    }

    console.log('Playing all from playlist, songs:', playlistSongs.length);
    
    // Set the first song as current
    const firstSong = playlistSongs[0];
    
    // Add the rest to queue
    if (playlistSongs.length > 1) {
      const remainingSongs = playlistSongs.slice(1);
      setQueue(remainingSongs);
    } else {
      setQueue([]);
    }
    
    // Play the first song but don't update queue again (we already did it)
    playSong(firstSong, [], false);
  };

  // Play song and add all subsequent songs to queue (with option to maintain current queue)
  const playSong = (song, songList, updateQueue = true) => {
    if (!song) {
      console.warn('Attempted to play a null song');
      return;
    }
    
    console.log('Playing song:', song.name);
    console.log('Song list length:', songList?.length || 0);
    
    // Reset audio and update current song
    setCurrentSong(song);
    currentSongIdRef.current = song.id;
    
    // Set play state
    setIsPlaying(true);
    
    // Update queue if needed
    if (songList && Array.isArray(songList) && updateQueue) {
      const songIndex = songList.findIndex(s => s.id === song.id);
      if (songIndex !== -1 && songIndex < songList.length - 1) {
        // Add all songs after the current one to the queue without any limits
        let songsToQueue = songList.slice(songIndex + 1);
        console.log('Adding songs to queue:', songsToQueue.length);
        
        // If shuffle is enabled, shuffle the new queue
        if (isShuffle && songsToQueue.length > 1) {
          const shuffledQueue = [...songsToQueue];
          for (let i = shuffledQueue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledQueue[i], shuffledQueue[j]] = [shuffledQueue[j], shuffledQueue[i]];
          }
          songsToQueue = shuffledQueue;
          setOriginalQueue(songList.slice(songIndex + 1));
        }
        
        // Replace the current queue instead of just setting it
        // This ensures we don't have stale queue items
        setQueue(songsToQueue);
        
        // Ensure the audio is properly loaded and ready for the current song
        audioRef.current.load();
      } else if (songIndex === -1 && songList.length > 0) {
        // If song not found in list but we have a list, add all songs to queue
        console.log('Song not found in list, adding all songs to queue:', songList.length);
        
        let songsToQueue = [...songList];
        
        // If shuffle is enabled, shuffle the queue
        if (isShuffle && songsToQueue.length > 1) {
          const shuffledQueue = [...songsToQueue];
          for (let i = shuffledQueue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledQueue[i], shuffledQueue[j]] = [shuffledQueue[j], shuffledQueue[i]];
          }
          songsToQueue = shuffledQueue;
          setOriginalQueue(songList);
        }
        
        setQueue(songsToQueue);
      }
    } else {
      // If we're not updating the queue, make sure we load the audio
      audioRef.current.load();
    }
  };

  const pauseSong = () => {
    console.log('Pause song called');
    setIsPlaying(false);
  };

  const resumeSong = () => {
    console.log('Resume song called');
    if (currentSong) {
      setIsPlaying(true);
    } else {
      console.warn('Tried to resume with no current song');
    }
  };

  const addToQueue = (song) => {
    if (!song) return;
    console.log('Adding to queue:', song.name);
    setQueue([...queue, song]);
  };

  const skipToNext = () => {
    console.log('Skip to next called, queue length:', queue.length);
    if (queue.length > 0) {
      // Add current song to history
      if (currentSong) {
        setHistory(prev => [currentSong, ...prev.slice(0, 49)]);
      }
      
      const nextSong = queue[0];
      if (!nextSong) {
        console.warn('Next song in queue is null');
        return;
      }
      
      console.log('Skipping to next song:', nextSong.name);
      const newQueue = queue.slice(1);
      setCurrentSong(nextSong);
      currentSongIdRef.current = nextSong.id;
      setQueue(newQueue);
      setIsPlaying(true);
    } else {
      console.log('No next song in queue');
    }
  };

  const skipToPrevious = () => {
    console.log('Skip to previous called, history length:', history.length);
    if (history.length > 0) {
      const previousSong = history[0];
      if (!previousSong) {
        console.warn('Previous song in history is null');
        return;
      }
      
      console.log('Skipping to previous song:', previousSong.name);
      
      // Add current song to the beginning of the queue to maintain order
      if (currentSong) {
        setQueue(prev => [currentSong, ...prev]);
      }
      
      // Set the previous song as current and remove it from history
      setCurrentSong(previousSong);
      currentSongIdRef.current = previousSong.id;
      setHistory(prev => prev.slice(1));
      setIsPlaying(true);
    } else {
      console.log('No previous song in history');
      if (currentSong) {
        // Just restart current song if no history
        console.log('Restarting current song from beginning');
        audioRef.current.currentTime = 0;
        setIsPlaying(true);
      }
    }
  };

  const search = async (query) => {
    if (!query || query.trim() === '') {
      console.warn('Empty search query');
      return { success: false };
    }
    
    console.log('Searching for:', query);
    try {
      const response = await searchMusic(query, 250); // Increased limit to 250
      if (response.success) {
        // Process song results
        if (response.data.songs && response.data.songs.length > 0) {
          console.log('Search song results:', response.data.songs.length);
          
          // Verify each song has download URLs
          const validSongs = response.data.songs.filter(song => {
            return song.downloadUrl && song.downloadUrl.length > 0;
          });
          
          console.log('Valid search results with download URLs:', validSongs.length);
          setSearchResults(validSongs);
        } else {
          setSearchResults([]);
        }
        
        // Process playlist results
        if (response.data.playlists && response.data.playlists.length > 0) {
          console.log('Search playlist results:', response.data.playlists.length);
          setSearchPlaylistResults(response.data.playlists);
        } else {
          setSearchPlaylistResults([]);
        }
      } else {
        console.warn('Search unsuccessful:', response);
        setSearchResults([]);
        setSearchPlaylistResults([]);
      }
      return response;
    } catch (error) {
      console.error("Error in search:", error);
      setSearchResults([]);
      setSearchPlaylistResults([]);
      return { success: false, error };
    }
  };
  
  // Toggle between play and pause
  const togglePlayPause = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      resumeSong();
    }
  };
  
  // Alias for skipToNext for clarity
  const playNextSong = () => skipToNext();
  
  // Alias for skipToPrevious for clarity
  const playPreviousSong = () => skipToPrevious();
  
  // Audio event handlers
  const onTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };
  
  const onLoadedMetadata = () => {
    setDuration(audioRef.current.duration || 0);
  };
  
  const onEnded = () => {
    // This is handled by the 'ended' event listener in the useEffect
  };
  
  const onVolumeChange = () => {
    setVolume(audioRef.current.volume);
    setIsMuted(audioRef.current.muted);
  };
  
  // Handle search input
  const handleSearch = async (query) => {
    setIsSearchLoading(true);
    await search(query);
    setIsSearchLoading(false);
  };
  
  // Set selected song (stub - not currently used)
  const setSelectedSong = (song) => {
    if (song) {
      playSong(song);
    }
  };
  
  // Clear the queue
  const clearQueue = () => {
    setQueue([]);
  };
  
  // Play entire playlist
  const playPlaylist = (songs) => {
    if (!songs || songs.length === 0) return;
    playSong(songs[0], songs);
  };
  
  // Update queue with new songs
  const updateQueue = (newQueue) => {
    if (Array.isArray(newQueue)) {
      setQueue(newQueue);
    }
  };
  
  // Save a new playlist
  const savePlaylist = (name, songs) => {
    if (!name || !songs || songs.length === 0) return;
    
    const updatedPlaylists = {
      ...userPlaylists,
      [name]: songs
    };
    
    setUserPlaylists(updatedPlaylists);
    localStorage.setItem('userPlaylists', JSON.stringify(updatedPlaylists));
  };
  
  // Delete a playlist
  const deletePlaylist = (name) => {
    if (!name || !userPlaylists[name]) return;
    
    const updatedPlaylists = { ...userPlaylists };
    delete updatedPlaylists[name];
    
    setUserPlaylists(updatedPlaylists);
    localStorage.setItem('userPlaylists', JSON.stringify(updatedPlaylists));
  };
  
  // Add a song to a playlist
  const addToPlaylist = (playlistName, song) => {
    if (!playlistName || !song) return;
    
    const playlist = userPlaylists[playlistName] || [];
    const updatedPlaylist = [...playlist, song];
    
    const updatedPlaylists = {
      ...userPlaylists,
      [playlistName]: updatedPlaylist
    };
    
    setUserPlaylists(updatedPlaylists);
    localStorage.setItem('userPlaylists', JSON.stringify(updatedPlaylists));
  };
  
  // Remove a song from a playlist
  const removeFromPlaylist = (playlistName, songId) => {
    if (!playlistName || !songId || !userPlaylists[playlistName]) return;
    
    const playlist = userPlaylists[playlistName];
    const updatedPlaylist = playlist.filter(song => song.id !== songId);
    
    const updatedPlaylists = {
      ...userPlaylists,
      [playlistName]: updatedPlaylist
    };
    
    setUserPlaylists(updatedPlaylists);
    localStorage.setItem('userPlaylists', JSON.stringify(updatedPlaylists));
  };
  
  // Activate a playlist (alias for setActivePlaylist)
  const activatePlaylist = (name) => {
    if (userPlaylists[name]) {
      setActivePlaylist(name, userPlaylists[name]);
    }
  };

  // Load and play a playlist by ID
  const loadAndPlayPlaylist = async (playlistId, autoPlay = true) => {
    if (!playlistId) return;
    
    console.log('Loading playlist:', playlistId);
    try {
      setIsSearchLoading(true);
      const response = await fetchPlaylistById(playlistId);
      setIsSearchLoading(false);
      
      if (response.success && response.data && response.data.songs && response.data.songs.length > 0) {
        console.log('Playlist loaded with', response.data.songs.length, 'songs');
        
        // Filter songs to only those with download URLs
        const validSongs = response.data.songs.filter(song => 
          song.downloadUrl && song.downloadUrl.length > 0
        );
        
        if (validSongs.length > 0) {
          // If autoPlay is true, play the playlist, otherwise just return the songs
          if (autoPlay) {
            playAllFromPlaylist(validSongs);
          }
          
          // Return the songs and success status so the caller can use them
          return {
            success: true,
            songs: validSongs,
            playlist: response.data
          };
        } else {
          console.warn('No valid songs with download URLs in the playlist');
        }
      } else {
        console.warn('Failed to load playlist or playlist has no songs');
      }
    } catch (error) {
      console.error('Error loading playlist:', error);
      setIsSearchLoading(false);
    }
    
    return { success: false, songs: [] };
  };

  return (
    <MusicContext.Provider
      value={{
        audio,
        currentSong,
        isPlaying,
        volume,
        duration,
        currentTime,
        isRepeat,
        isShuffle,
        isMuted,
        queue,
        queueIndex,
        showQueue,
        searchResults,
        searchPlaylistResults,
        isSearchLoading,
        setIsSearchLoading,
        trendingSongs,
        attHits,
        haryanviSongs,
        top100Songs,
        punjabiHits,
        newReleases,
        romanticSongs,
        userPlaylists,
        activePlaylistName,
        activePlaylistSongs,
        playlists,
        audioRef,
        currentSongUrl,
        currentSongIdRef,
        playPromiseRef,
        history,
        originalQueue,
        toggleShuffle,
        emptyQueue,
        setActivePlaylist,
        playAllFromPlaylist,
        playSong,
        pauseSong,
        resumeSong,
        addToQueue,
        skipToNext,
        skipToPrevious,
        search,
        getHighestQualityUrl,
        setIsPlaying,
        setVolume,
        setCurrentTime,
        setIsRepeat,
        setIsShuffle,
        setIsMuted,
        setShowQueue,
        togglePlayPause,
        playNextSong,
        playPreviousSong,
        onTimeUpdate,
        onLoadedMetadata,
        onEnded,
        onVolumeChange,
        handleSearch,
        setSelectedSong,
        clearQueue,
        playPlaylist,
        updateQueue,
        savePlaylist,
        deletePlaylist,
        addToPlaylist,
        removeFromPlaylist,
        setActivePlaylistName,
        activatePlaylist,
        loadAndPlayPlaylist
      }}
    >
      {audio && (
        <audio
          ref={(el) => {
            if (el && !audio) setAudio(el);
          }}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onEnded={onEnded}
          onVolumeChange={onVolumeChange}
          src={currentSong?.downloadUrl[4]?.url || ''}
        />
      )}
      {!audio && (
        <audio
          ref={(el) => {
            if (el) setAudio(el);
          }}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onEnded={onEnded}
          onVolumeChange={onVolumeChange}
        />
      )}
      {children}
    </MusicContext.Provider>
  );
}; 