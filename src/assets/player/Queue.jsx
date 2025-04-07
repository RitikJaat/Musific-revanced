import React from 'react';
import styled from 'styled-components';

const Queue = () => {
  return (
    <StyledWrapper>
      <div className="main min-h-[50vh] max-h-[60vh]">
        <div className="currentplaying">
            
          <p className="heading">Currently Playing</p>
        </div>
        <div className="loader">
          <div className="song">
            <p className="name">Title</p>
            <p className="artist">Artist</p>
          </div>
          <div className="albumcover" />
          <div className="loading">
            <div className="load" />
            <div className="load" />
            <div className="load" />
            <div className="load" />
          </div>
        </div>
        <div className="loader">
          <div className="song">
            <p className="name">Title</p>
            <p className="artist">Artist</p>
          </div>
          <div className="albumcover" />
          <div className="play" />
        </div>
        <div className="loader">
          <div className="song">
            <p className="name">Title</p>
            <p className="artist">Artist</p>
          </div>
          <div className="albumcover" />
          <div className="play" />
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .main {
    background-color: #1b233d;
    padding: 1em;
    padding-bottom: 1.1em;
    border-radius: 15px;
    margin: 1em;
  }

  .loader {
    display: flex;
    flex-direction: row;
    height: 4em;
    padding-left: 1em;
    padding-right: 1em;
    transform: rotate(180deg);
    justify-content: right;
    border-radius: 10px;
    transition: .4s ease-in-out;
  }

  .loader:hover {
    cursor: pointer;
    background-color: rgb(0, 255, 255, 0.5);
  }

  .currentplaying {
    display: flex;
    margin: 1em;
  }

  .spotify {
    width: 50px;
    height: 50px;
    margin-right: 0.6em;
  }

  .heading {
    color: rgba(170, 222, 243, 1);
    font-size: 1.1em;
    font-weight: bold;
    align-self: center;
  }

  .loading {
    display: flex;
    margin-top: 1em;
    margin-left: 0.3em;
  }

  .load {
    width: 2px;
    height: 33px;
    background-color: cyan;
    animation: 1s move6 infinite;
    border-radius: 5px;
    margin: 0.1em;
  }

  .load:nth-child(1) {
    animation-delay: 0.2s;
  }

  .load:nth-child(2) {
    animation-delay: 0.4s;
  }

  .load:nth-child(3) {
    animation-delay: 0.6s;
  }

  .play {
    position: relative;
    left: 0.35em;
    height: 1.6em;
    width: 1.6em;
    clip-path: polygon(50% 50%, 100% 50%, 75% 6.6%);
    background-color: black;
    transform: rotate(-90deg);
    align-self: center;
    margin-top: 0.7em;
    justify-self: center;
  }

  .albumcover {
    position: relative;
    margin-right: 1em;
    height: 40px;
    width: 40px;
    background-color: rgb(233, 232, 232);
    align-self: center;
    border-radius: 5px;
  }

  .song {
    position: relative;
    transform: rotate(180deg);
    margin-right: 1em;
    color: rgba(170, 222, 243, 0.721);
    align-self: center;
  }

  .artist {
    font-size: 0.6em;
  }

  @keyframes move6 {
    0% {
      height: 0.2em;
    }

    25% {
      height: 0.7em;
    }

    50% {
      height: 1.5em;
    }

    100% {
      height: 0.2em;
    }
  }`;

export default Queue;
