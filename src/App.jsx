import { useState } from 'react';
import NavBar from './assets/NavBar';
import Player from './assets/player/Player';
import Queue from './assets/player/Queue';
import Card from './assets/player/Card';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* MAIN CONTENT */}
      <div className="relative z-10 Homepage min-h-screen bg-black text-white p-4">
        <div className="hompeageContent border-2 min-h-[90vh] rounded-3xl p-4 bg-black/70 backdrop-blur-md">
          <div className="navbar mb-4">
            <NavBar />
          </div>

          <div className="split flex gap-4 h-[80vh]">
            {/* LEFT FIXED SECTION */}
            <div className="left border-2 p-4 w-1/3 sticky top-4 h-fit">
              <Queue />
              <Player />
            </div>

            {/* RIGHT SCROLLABLE SECTION */}
            <div className="right border-2 p-4 w-2/3 overflow-y-auto scrollbar-hide">
              {/* SONGS SECTION */}
              <h2 className="text-xl font-semibold ml-2 mb-2">🎵 Songs</h2>
              <div className="songs flex gap-4 overflow-x-scroll overflow-y-hidden scrollbar-hide m-2 py-2 px-1">
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
              </div>

              {/* PLAYLISTS SECTION */}
              <h2 className="text-xl font-semibold ml-2 mt-6 mb-2">🎧 Playlists</h2>
              <div className="playlists flex gap-4 overflow-x-scroll overflow-y-hidden scrollbar-hide m-2 py-2 px-1">
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
              </div>

              {/* TRENDING SECTION */}
              <h2 className="text-xl font-semibold ml-2 mt-6 mb-2">📈 Trending</h2>
              <div className="trending flex gap-4 overflow-x-scroll overflow-y-hidden scrollbar-hide m-2 py-2 px-1">
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
