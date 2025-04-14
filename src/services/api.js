const API_BASE_URL = 'https://saavn.dev/api';

export const searchMusic = async (query, limit = 250) => {
  try {
    // Search for songs
    const songsResponse = await fetch(`${API_BASE_URL}/search/songs?query=${encodeURIComponent(query)}&page=1&limit=${limit}`);
    const songsData = await songsResponse.json();
    
    // Search for playlists
    const playlistsResponse = await fetch(`${API_BASE_URL}/search/playlists?query=${encodeURIComponent(query)}&page=1&limit=10`);
    const playlistsData = await playlistsResponse.json();
    
    // Combine results into a structured format
    return {
      success: songsData.success || playlistsData.success,
      data: {
        songs: songsData.success ? songsData.data.results : [],
        playlists: playlistsData.success ? playlistsData.data.results : []
      }
    };
  } catch (error) {
    console.error('Error searching music:', error);
    return { success: false, data: { songs: [], playlists: [] } };
  }
};

export const fetchSong = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/songs?id=${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching song:', error);
    return { success: false, data: {} };
  }
};

export const fetchPlaylist = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/playlists?id=${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching playlist:', error);
    return { success: false, data: {} };
  }
};

// Fetch Modern/Gen Z Hits (previously Att Hits)
export const fetchAttHits = async () => {
  try {
    // Updated query to get trending modern songs
    const response = await fetch(`${API_BASE_URL}/search/songs?query=trending indian songs 2023&page=1&limit=20`);
    const data = await response.json();
    
    if (!data.success || !data.data.results || data.data.results.length === 0) {
      // Better fallback for modern hits
      console.log('Falling back to viral hits search');
      const fallbackResponse = await fetch(`${API_BASE_URL}/search/songs?query=viral indian hits 2023&page=1&limit=20`);
      return await fallbackResponse.json();
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching modern hits playlist:', error);
    return { success: false, data: { results: [] } };
  }
};

// Fetch purely romantic songs
export const fetchRomanticSongs = async () => {
  try {
    // Get romantic Bollywood songs
    const response = await fetch(`${API_BASE_URL}/search/songs?query=romantic bollywood songs&page=1&limit=20`);
    const data = await response.json();
    
    // Also get romantic Hindi songs
    const hindiResponse = await fetch(`${API_BASE_URL}/search/songs?query=hindi love songs&page=1&limit=15`);
    const hindiData = await hindiResponse.json();
    
    // Combine the results
    let allResults = [];
    
    if (data.success && data.data?.results?.length > 0) {
      allResults = [...data.data.results];
    }
    
    if (hindiData.success && hindiData.data?.results?.length > 0) {
      // Avoid duplicates by checking IDs
      const existingIds = new Set(allResults.map(song => song.id));
      const newSongs = hindiData.data.results.filter(song => !existingIds.has(song.id));
      allResults = [...allResults, ...newSongs];
    }
    
    // If we don't have enough songs, try another query
    if (allResults.length < 15) {
      const fallbackResponse = await fetch(`${API_BASE_URL}/search/songs?query=best romantic songs indian&page=1&limit=20`);
      const fallbackData = await fallbackResponse.json();
      
      if (fallbackData.success && fallbackData.data?.results?.length > 0) {
        const existingIds = new Set(allResults.map(song => song.id));
        const newSongs = fallbackData.data.results.filter(song => !existingIds.has(song.id));
        allResults = [...allResults, ...newSongs];
      }
    }
    
    // Return the combined results
    return { 
      success: allResults.length > 0, 
      data: { 
        results: allResults 
      } 
    };
  } catch (error) {
    console.error('Error fetching romantic songs:', error);
    return { success: false, data: { results: [] } };
  }
};

// Fetch New Releases
export const fetchNewReleases = async () => {
  try {
    // First try with Hindi new releases
    const response = await fetch(`${API_BASE_URL}/search/songs?query=new hindi releases 2023&page=1&limit=15`);
    const data = await response.json();
    
    // Combine with Punjabi and Haryanvi new releases for a mixed collection
    const punjabiResponse = await fetch(`${API_BASE_URL}/search/songs?query=new punjabi releases 2023&page=1&limit=10`);
    const punjabiData = await punjabiResponse.json();
    
    const haryanviResponse = await fetch(`${API_BASE_URL}/search/songs?query=new haryanvi releases 2023&page=1&limit=10`);
    const haryanviData = await haryanviResponse.json();
    
    // Combine all results
    let allResults = [];
    
    if (data.success && data.data?.results?.length > 0) {
      allResults = [...allResults, ...data.data.results];
    }
    
    if (punjabiData.success && punjabiData.data?.results?.length > 0) {
      allResults = [...allResults, ...punjabiData.data.results];
    }
    
    if (haryanviData.success && haryanviData.data?.results?.length > 0) {
      allResults = [...allResults, ...haryanviData.data.results];
    }
    
    // If we didn't get anything, fall back to a more generic search
    if (allResults.length === 0) {
      console.log('Falling back to latest Indian hits search');
      const fallbackResponse = await fetch(`${API_BASE_URL}/search/songs?query=latest indian hits&page=1&limit=30`);
      const fallbackData = await fallbackResponse.json();
      
      if (fallbackData.success && fallbackData.data?.results?.length > 0) {
        allResults = fallbackData.data.results;
      }
    }
    
    // Return the combined results
    return { 
      success: allResults.length > 0, 
      data: { 
        results: allResults 
      } 
    };
  } catch (error) {
    console.error('Error fetching New Releases:', error);
    return { success: false, data: { results: [] } };
  }
};

// Fetch Haryanvi Songs
export const fetchHaryanviSongs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/search/songs?query=haryanvi popular&page=1&limit=20`);
    const data = await response.json();
    
    if (!data.success || !data.data.results || data.data.results.length === 0) {
      console.log('Falling back to generic Haryanvi songs search');
      const fallbackResponse = await fetch(`${API_BASE_URL}/search/songs?query=haryanvi songs&page=1&limit=20`);
      return await fallbackResponse.json();
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching Haryanvi songs:', error);
    return { success: false, data: { results: [] } };
  }
};

// Fetch Top 100 Songs
export const fetchTop100 = async () => {
  try {
    // Updated to get top Hindi romantic songs
    const response = await fetch(`${API_BASE_URL}/search/songs?query=top hindi romantic songs&page=1&limit=25`);
    const romanticData = await response.json();
    
    // Also get top 50 Hindi songs
    const top50Response = await fetch(`${API_BASE_URL}/search/songs?query=top 50 hindi songs 2023&page=1&limit=25`);
    const top50Data = await top50Response.json();
    
    // Combine the results
    let allResults = [];
    
    if (romanticData.success && romanticData.data?.results?.length > 0) {
      allResults = [...romanticData.data.results];
    }
    
    if (top50Data.success && top50Data.data?.results?.length > 0) {
      // Avoid duplicates by checking IDs
      const existingIds = new Set(allResults.map(song => song.id));
      const newSongs = top50Data.data.results.filter(song => !existingIds.has(song.id));
      allResults = [...allResults, ...newSongs];
    }
    
    // If we still don't have enough results, try a fallback
    if (allResults.length < 10) {
      console.log('Falling back to generic top Hindi songs search');
      const fallbackResponse = await fetch(`${API_BASE_URL}/search/songs?query=best hindi songs all time&page=1&limit=50`);
      const fallbackData = await fallbackResponse.json();
      
      if (fallbackData.success && fallbackData.data?.results?.length > 0) {
        const existingIds = new Set(allResults.map(song => song.id));
        const newSongs = fallbackData.data.results.filter(song => !existingIds.has(song.id));
        allResults = [...allResults, ...newSongs];
      }
    }
    
    // Return the combined results
    return { 
      success: allResults.length > 0, 
      data: { 
        results: allResults.slice(0, 50) // Limit to 50 songs
      } 
    };
  } catch (error) {
    console.error('Error fetching Top 100:', error);
    return { success: false, data: { results: [] } };
  }
};

export const fetchTrending = async () => {
  try {
    // Try to fetch popular songs via search as a fallback since the trending endpoint is not available
    const response = await fetch(`${API_BASE_URL}/search/songs?query=latest hits&page=1&limit=100`);
    const data = await response.json();
    
    if (!data.success || !data.data.results || data.data.results.length === 0) {
      // Further fallback to a basic search if needed
      const fallbackResponse = await fetch(`${API_BASE_URL}/search/songs?query=popular english&page=1&limit=100`);
      return await fallbackResponse.json();
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching trending:', error);
    return { success: false, data: { results: [] } };
  }
};

// Fetch Punjabi Att Hits playlist
export const fetchPunjabiHits = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/search/songs?query=punjabi hits popular&page=1&limit=25`);
    const data = await response.json();
    
    if (!data.success || !data.data.results || data.data.results.length === 0) {
      console.log('Falling back to generic Punjabi songs search');
      const fallbackResponse = await fetch(`${API_BASE_URL}/search/songs?query=punjabi songs&page=1&limit=25`);
      return await fallbackResponse.json();
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching Punjabi hits:', error);
    return { success: false, data: { results: [] } };
  }
};

export const fetchPlaylistById = async (id) => {
  if (!id) return { success: false, data: { songs: [] } };
  
  try {
    // Add a limit parameter to request more songs (up to 100)
    const response = await fetch(`${API_BASE_URL}/playlists?id=${id}&limit=100`);
    const data = await response.json();
    
    if (data.success && data.data) {
      // Process the songs to ensure they have all the expected fields
      const processedSongs = data.data.songs.map(song => {
        return {
          ...song,
          id: song.id,
          name: song.name,
          primaryArtists: song.primaryArtists,
          image: song.image,
          downloadUrl: song.downloadUrl,
          duration: song.duration
        };
      });
      
      console.log(`Loaded ${processedSongs.length} songs from playlist`);
      
      return {
        success: true,
        data: {
          ...data.data,
          songs: processedSongs
        }
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching playlist:', error);
    return { success: false, data: { songs: [] } };
  }
}; 