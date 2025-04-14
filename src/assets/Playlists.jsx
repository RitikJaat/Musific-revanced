import React, { useMemo } from 'react';
import { useMusicContext } from '../context/MusicContext';
import styled from 'styled-components';

const Playlists = () => {
  const { 
    haryanviSongs,
    top100Songs,
    punjabiHits,
    setActivePlaylist,
    activePlaylistName,
    activePlaylistSongs,
    playAllFromPlaylist,
    userPlaylists,
    deletePlaylist
  } = useMusicContext();

  // Calculate total listens for each playlist
  const calculateTotalListens = (songs) => {
    if (!songs || !songs.length) return 0;
    return songs.reduce((total, song) => {
      const listens = song.playCount || Math.floor(Math.random() * 500000);
      return total + listens;
    }, 0);
  };
  
  // Format play count in K or M format
  const formatPlayCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // List of all available playlists with calculated listens
  const playlists = useMemo(() => {
    // Default playlists
    const defaultPlaylists = [
      { 
        id: 'punjabi-hits', 
        name: 'Punjabi Hits', 
        songs: punjabiHits, 
        emoji: '💫', 
        listens: calculateTotalListens(punjabiHits),
        isDefault: true
      },
      { 
        id: 'haryanvi', 
        name: 'Haryanvi Hits', 
        songs: haryanviSongs, 
        emoji: '🎵', 
        listens: calculateTotalListens(haryanviSongs),
        isDefault: true
      },
      { 
        id: 'top-100', 
        name: 'Top 50 Hindi', 
        songs: top100Songs, 
        emoji: '🏆', 
        listens: calculateTotalListens(top100Songs),
        isDefault: true
      }
    ];
    
    // User playlists
    const userPlaylistsArray = Object.entries(userPlaylists || {}).map(([name, songs]) => ({
      id: `user-${name}`,
      name,
      songs,
      emoji: '📑',
      listens: calculateTotalListens(songs),
      isUserPlaylist: true
    }));
    
    // Combine default and user playlists
    return [...defaultPlaylists, ...userPlaylistsArray];
  }, [punjabiHits, haryanviSongs, top100Songs, userPlaylists]);

  // Handle clicking on a playlist to view its songs
  const handlePlaylistClick = (playlist) => {
    setActivePlaylist(playlist.name, playlist.songs);
  };

  // Handle "Play All" button click
  const handlePlayAll = () => {
    if (activePlaylistSongs.length > 0) {
      playAllFromPlaylist(activePlaylistSongs);
    }
  };

  // Go back to playlist selection
  const handleBackToPlaylists = () => {
    setActivePlaylist('', []);
  };

  // Automatically select the first playlist if none is active
  React.useEffect(() => {
    if (!activePlaylistName && playlists.length > 0) {
      handlePlaylistClick(playlists[0]);
    }
  }, [playlists]);

  // Handle deleting a user playlist
  const handleDeletePlaylist = (e, playlistName) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the playlist "${playlistName}"?`)) {
      deletePlaylist(playlistName);
    }
  };

  return (
    <PlaylistsContainer>
      {activePlaylistName ? (
        // Show active playlist songs
        <div className="active-playlist">
          <div className="playlist-header">
            <button className="back-button" onClick={handleBackToPlaylists}>
              ← Back to Playlists
            </button>
            <h2>{activePlaylistName}</h2>
            <button className="play-all-button" onClick={handlePlayAll}>
              Play All
            </button>
          </div>
          
          <div className="playlist-songs scrollbar-hide">
            {activePlaylistSongs.map((song, index) => (
              <div 
                key={`${song.id}-${index}`}
                className="playlist-song-item"
                onClick={() => playAllFromPlaylist([...activePlaylistSongs.slice(index)])}
              >
                <div className="song-number">{index + 1}</div>
                <div className="song-cover">
                  <img 
                    src={song.image?.[0]?.url || '/placeholder-album.png'} 
                    alt={song.name}
                  />
                </div>
                <div className="song-details">
                  <div className="song-title">{song.name.replace(/ \(From .*?\)$/, '')}</div>
                  <div className="song-artist">{song.primaryArtists}</div>
                </div>
                <div className="song-plays">
                  {formatPlayCount(song.playCount || Math.floor(Math.random() * 500000))} plays
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Show playlist selection
        <div className="playlists-grid">
          {playlists.map((playlist) => (
            <div 
              key={playlist.id}
              className="playlist-item"
              onClick={() => handlePlaylistClick(playlist)}
            >
              <div className="playlist-icon">{playlist.emoji}</div>
              <div className="playlist-name">{playlist.name}</div>
              <div className="playlist-count">{playlist.songs.length} songs</div>
              <div className="playlist-listens">{formatPlayCount(playlist.listens)} total plays</div>
              {playlist.isUserPlaylist && (
                <button
                  className="delete-button"
                  onClick={(e) => handleDeletePlaylist(e, playlist.name)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </PlaylistsContainer>
  );
};

const PlaylistsContainer = styled.div`
  padding: 20px;
  background: rgba(27, 35, 61, 0.8);
  border-radius: 12px;
  color: white;

  .playlists-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }

  .playlist-item {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s, background 0.2s;
    position: relative;
  }

  .playlist-item:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-5px);
  }

  .playlist-icon {
    font-size: 40px;
    margin-bottom: 15px;
  }

  .playlist-name {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .playlist-count {
    font-size: 14px;
    color: rgba(170, 222, 243, 0.7);
    margin-bottom: 5px;
  }
  
  .playlist-listens {
    font-size: 14px;
    color: rgba(170, 222, 243, 0.7);
    font-weight: bold;
  }

  .active-playlist {
    width: 100%;
  }

  .playlist-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .back-button, 
  .play-all-button {
    background: rgba(170, 222, 243, 0.2);
    border: none;
    color: #aadeef;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s;
  }

  .back-button:hover,
  .play-all-button:hover {
    background: rgba(170, 222, 243, 0.3);
  }

  .play-all-button {
    background: rgba(0, 255, 127, 0.2);
    color: #5eff9d;
  }

  .play-all-button:hover {
    background: rgba(0, 255, 127, 0.3);
  }

  .playlist-songs {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .playlist-song-item {
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    cursor: pointer;
    transition: background 0.2s;
  }

  .playlist-song-item:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .song-number {
    width: 30px;
    text-align: center;
    font-size: 14px;
    color: #aadeef;
  }

  .song-cover {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    overflow: hidden;
    margin-right: 15px;
  }

  .song-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .song-details {
    flex: 1;
  }

  .song-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 4px;
  }

  .song-artist {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .song-plays {
    font-size: 12px;
    color: rgba(0, 255, 127, 0.7);
    margin-left: 15px;
    min-width: 75px;
    text-align: right;
  }

  .delete-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255, 30, 30, 0.2);
    color: #ff6b6b;
    font-size: 0.8rem;
    padding: 3px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .delete-button:hover {
    background: rgba(255, 30, 30, 0.3);
  }
`;

export default Playlists; 