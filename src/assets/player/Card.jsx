import React from 'react';
import styled from 'styled-components';
import { useMusicContext } from '../../context/MusicContext';

const Card = ({ item, updateQueue = true }) => {
    const { playSong, addToQueue, getHighestQualityUrl } = useMusicContext();

    if (!item) return null;

    const handlePlay = () => {
        // Find the specific container this card belongs to
        const currentCard = document.querySelector(`[data-song-id="${item.id}"]`);
        if (!currentCard) {
            console.warn('Current card element not found');
            playSong(item, [], updateQueue);
            return;
        }
        
        // Find the nearest song list container to get all sibling songs
        const nearestContainer = findNearestSongContainer(currentCard);
        let songList = [];
        
        if (nearestContainer) {
            // Get all Card elements within the container to build the song list
            const allItems = nearestContainer.querySelectorAll('[data-song-id]');
            
            // Make sure we have a valid set of items
            if (allItems && allItems.length > 0) {
                console.log('Found song container with', allItems.length, 'songs');
                
                songList = Array.from(allItems).map(el => {
                    try {
                        const songJson = el.getAttribute('data-song-json');
                        if (songJson) {
                            return JSON.parse(songJson);
                        }
                        return null;
                    } catch (e) {
                        console.error('Error parsing song JSON:', e);
                        return null;
                    }
                }).filter(Boolean); // Remove any null items
                
                console.log('Built song list with', songList.length, 'valid songs');
            } else {
                console.warn('No song items found in container');
            }
        } else {
            console.warn('Could not find nearest song container');
        }
        
        // Play the song and pass the song list for queuing
        // Only update queue if updateQueue prop is true
        playSong(item, songList, updateQueue);
    };

    const findNearestSongContainer = (element) => {
        if (!element) return null;
        if (element.classList.contains('songs') || 
            element.classList.contains('trending') || 
            element.classList.contains('playlists') ||
            element.classList.contains('search-results') ||
            element.classList.contains('att-hits') ||
            element.classList.contains('new-releases') ||
            element.classList.contains('haryanvi') ||
            element.classList.contains('top-100') ||
            element.classList.contains('punjabi-hits') ||
            element.classList.contains('playlist-songs')) {
            return element;
        }
        return findNearestSongContainer(element.parentElement);
    };

    const handleAddToQueue = (e) => {
        e.stopPropagation();
        addToQueue(item);
    };

    // Get artist name(s)
    const artistNames = item.artists?.primary?.map(artist => artist.name).join(', ') || 'Unknown Artist';
    
    // Get highest quality image
    const imageUrl = item.image ? getHighestQualityUrl(item.image) : 'https://c.saavncdn.com/editorial/AttHits_20250402103243_500x500.jpg';
    
    // Format play count
    const formatPlayCount = (count) => {
        if (!count) return '0';
        
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        
        return `${count}`;
    };
    
    // Get play count or use a fallback
    const playCount = item.playCount || Math.floor(Math.random() * 500000) + 10000; // fallback for demo
    
    // Stringify item for data attribute
    const itemJson = JSON.stringify(item);
    
    return (
        <StyledWrapper 
            onClick={handlePlay} 
            data-song-id={item.id} 
            data-song-json={itemJson}
        >
            <div className="card">
                <div className="top-section" style={{ backgroundImage: `url(${imageUrl})` }}>
                    <div className="border" />
                    <div className="icons">
                        <div className="logo">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 94 94" className="svg">
                                <path fill="white" d="M38.0481 4.82927C38.0481 2.16214 40.018 0 42.4481 0H51.2391C53.6692 0 55.6391 2.16214 55.6391 4.82927V40.1401C55.6391 48.8912 53.2343 55.6657 48.4248 60.4636C43.6153 65.2277 36.7304 67.6098 27.7701 67.6098C18.8099 67.6098 11.925 65.2953 7.11548 60.6663C2.37183 56.0036 3.8147e-06 49.2967 3.8147e-06 40.5456V4.82927C3.8147e-06 2.16213 1.96995 0 4.4 0H13.2405C15.6705 0 17.6405 2.16214 17.6405 4.82927V39.1265C17.6405 43.7892 18.4805 47.2018 20.1605 49.3642C21.8735 51.5267 24.4759 52.6079 27.9678 52.6079C31.4596 52.6079 34.0127 51.5436 35.6268 49.4149C37.241 47.2863 38.0481 43.8399 38.0481 39.0758V4.82927Z" />
                                <path fill="white" d="M86.9 61.8682C86.9 64.5353 84.9301 66.6975 82.5 66.6975H73.6595C71.2295 66.6975 69.2595 64.5353 69.2595 61.8682V4.82927C69.2595 2.16214 71.2295 0 73.6595 0H82.5C84.9301 0 86.9 2.16214 86.9 4.82927V61.8682Z" />
                                <path fill="white" d="M2.86102e-06 83.2195C2.86102e-06 80.5524 1.96995 78.3902 4.4 78.3902H83.6C86.0301 78.3902 88 80.5524 88 83.2195V89.1707C88 91.8379 86.0301 94 83.6 94H4.4C1.96995 94 0 91.8379 0 89.1707L2.86102e-06 83.2195Z" />
                            </svg>
                        </div>
                        <div className="add-to-queue" onClick={handleAddToQueue}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                                <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bottom-section">
                    <span className="title">{(item.name || 'Unknown Track').replace(/ \(From .*?\)$/, '')}</span>
                    <div className="row row1">
                        <div className="item artist-container">
                            <span className="regular-text">{artistNames}</span>
                        </div>
                        <div className="item play-count-container">
                            <span className="play-count">
                                <span className="count-value">{formatPlayCount(playCount)}</span>
                                <span className="count-label">plays</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </StyledWrapper>
    );
}

const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const StyledWrapper = styled.div`
  .card {
    width: 230px;
    height: 280px; /* Set fixed height for consistency */
    border-radius: 20px;
    background: #1b233d;
    padding: 5px;
    overflow: hidden;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 20px 0px;
    transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    cursor: pointer;
    display: flex;
    flex-direction: column;
  }

  .card:hover {
    transform: scale(1.05);
  }

  .card .top-section {
    height: 150px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    background-size: cover;
    background-position: center;
    position: relative;
    flex-shrink: 0; /* Prevent shrinking */
  }

  .card .top-section .border {
    border-bottom-right-radius: 10px;
    height: 30px;
    width: 130px;
    background: white;
    background: #1b233d;
    position: relative;
    transform: skew(-40deg);
    box-shadow: -10px -10px 0 0 #1b233d;
  }

  .card .top-section .border::before {
    content: "";
    position: absolute;
    width: 15px;
    height: 15px;
    top: 0;
    right: -15px;
    background: rgba(255, 255, 255, 0);
    border-top-left-radius: 10px;
    box-shadow: -5px -5px 0 2px #1b233d;
  }

  .card .top-section::before {
    content: "";
    position: absolute;
    top: 30px;
    left: 0;
    background: rgba(255, 255, 255, 0);
    height: 15px;
    width: 15px;
    border-top-left-radius: 15px;
    box-shadow: -5px -5px 0 2px #1b233d;
  }

  .card .top-section .icons {
    position: absolute;
    top: 0;
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: space-between;
  }

  .card .top-section .icons .logo {
    height: 100%;
    aspect-ratio: 1;
    padding: 7px 0 7px 15px;
  }

  .card .top-section .icons .logo .svg {
    height: 100%;
  }

  .card .top-section .icons .add-to-queue {
    height: 100%;
    aspect-ratio: 1;
    padding: 3px 15px 3px 0;
    cursor: pointer;
  }

  .card .bottom-section {
    margin-top: 15px;
    padding: 10px 5px;
    display: flex;
    flex-direction: column;
    height: 100px; /* Fixed height for bottom section */
    flex-grow: 1; /* Allow to fill available space */
  }

  .card .bottom-section .title {
    display: block;
    font-size: 17px;
    font-weight: bolder;
    color: white;
    text-align: center;
    letter-spacing: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 10px;
  }

  .card .bottom-section .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 5px;
    min-height: 40px; /* Ensure minimum height */
    position: relative;
  }

  .card .bottom-section .row .item {
    padding: 5px;
    color: rgba(170, 222, 243, 0.721);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .card .bottom-section .row .artist-container {
    flex: 2;
    text-align: left;
    padding-left: 10px;
    max-width: 55%;
    overflow: hidden;
  }
  
  .card .bottom-section .row .play-count-container {
    flex: 1;
    text-align: right;
    padding-right: 10px;
    min-width: 45%; /* Ensure play count has enough space */
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .card .bottom-section .row .item .regular-text {
    font-size: 10px;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.2;
    max-width: 100%; /* Limit width to parent container */
  }
  
  .card .bottom-section .row .play-count {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  
  .card .bottom-section .row .count-value {
    font-size: 14px;
    font-weight: bold;
    line-height: 1.2;
  }
  
  .card .bottom-section .row .count-label {
    font-size: 9px;
    opacity: 0.8;
  }
`;

export default Card;
export { StyledWrapper };