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
          <div className="split flex gap-4">

            <div className="left border-2 p-4 w-1/3">
              <Queue className="" />
              <Player className="min-h-auto" />
            </div>

            <div className="right border-2 p-4 w-2/3">
          
              <div className="songs flex gap-4 overflow-x-scroll overflow-y-hidden scrollbar-hide m-2 py-2 px-1">
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
