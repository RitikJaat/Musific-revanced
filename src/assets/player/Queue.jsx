import React, { useState, useContext, useCallback, useEffect } from 'react';
import "./styles.css";
import { useMusicContext } from "../../context/MusicContext";

function Queue() {
    const { currentSong, queue, getHighestQualityUrl, skipToNext, playSong, isPlaying, emptyQueue } = useMusicContext();
    const [queueToggled, setQueueToggled] = useState(false);

    const toggleQueue = () => {
        setQueueToggled(!queueToggled);
    }

    // Calculate queue time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Get total queue duration
    const getQueueDuration = () => {
        let totalSeconds = 0;
        if (queue.length > 0) {
            queue.forEach(song => {
                if (song.duration) {
                    totalSeconds += song.duration;
                }
            });
        }
        return formatTime(totalSeconds);
    };

    // Handle empty queue button click
    const handleEmptyQueue = (e) => {
        e.stopPropagation();
        if (queue.length > 0) {
            if (window.confirm('Are you sure you want to empty the queue?')) {
                emptyQueue();
            }
        }
    };

    return (
        <div className="queue-container">
            <div className="queue-header">
                <div className="queue-title">Queue</div>
                <div className="queue-actions">
                    {queue.length > 0 && (
                        <div className="empty-queue-btn" onClick={handleEmptyQueue}>
                            Empty Queue
                        </div>
                    )}
                    <div className="queue-toggle" onClick={toggleQueue}>
                        {queueToggled ? 'Hide Queue' : 'Show Queue'}
                    </div>
                </div>
            </div>

            <div className="current-song">
                <div className="now-playing-header">Now Playing</div>
                {currentSong ? (
                    <div className="now-playing-song">
                        <div className="albumcover-container">
                            <img 
                                className="albumcover" 
                                src={currentSong.image?.[0]?.url || getHighestQualityUrl(currentSong.image) || '/placeholder-album.png'} 
                                alt={`${currentSong.name} album cover`} 
                            />
                        </div>
                        <div className="song-info">
                            <div className="song-name">{currentSong.name.replace(/ \(From .*?\)$/, '')}</div>
                            <div className="artist-name">{currentSong.primaryArtists}</div>
                        </div>
                        <div className="song-duration">
                            {currentSong.duration ? formatTime(currentSong.duration) : '--:--'}
                        </div>
                    </div>
                ) : (
                    <div className="no-song-playing">
                        No song currently playing
                    </div>
                )}
            </div>

            <div className={`queue-content ${queueToggled ? 'expanded' : ''}`}>
                <div className="queue-stats">
                    <div className="queue-count">{queue.length} songs in queue</div>
                    <div className="queue-duration">Total time: {getQueueDuration()}</div>
                </div>

                <div className="queue-songs">
                    {queue.length > 0 ? (
                        queue.map((song, index) => (
                            <div 
                                key={`${song.id}-${index}`} 
                                className="queue-song"
                                onClick={() => {
                                    // Play this song and re-queue all songs after it
                                    playSong(song, [...queue.slice(index)]);
                                }}
                            >
                                <div className="albumcover-container">
                                    <img 
                                        className="albumcover" 
                                        src={song.image?.[0]?.url || getHighestQualityUrl(song.image) || '/placeholder-album.png'} 
                                        alt={`${song.name} album cover`} 
                                    />
                                </div>
                                <div className="song-info">
                                    <div className="song-name">{song.name.replace(/ \(From .*?\)$/, '')}</div>
                                    <div className="artist-name">{song.primaryArtists}</div>
                                </div>
                                <div className="song-duration">
                                    {song.duration ? formatTime(song.duration) : '--:--'}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-queue">
                            Queue is empty. Search and add songs to your queue!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Queue;
