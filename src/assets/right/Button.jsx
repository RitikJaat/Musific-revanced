import React from 'react';
import styled from 'styled-components';
import { Home, Search, Settings } from 'lucide-react';

const Buttons = () => {
  return (
    <StyledWrapper>
      <div className="button-group">

        <button type="button" className="btn">
          <div className="content">
            <Home className="icon" />
            <strong>HOME</strong>
          </div>
          <div id="container-stars"><div id="stars" /></div>
          <div id="glow"><div className="circle" /><div className="circle" /></div>
        </button>



        <button type="button" className="btn">
          <div className="content">
            <Settings className="icon" />
            <strong>SETTINGS</strong>
          </div>
          <div id="container-stars"><div id="stars" /></div>
          <div id="glow"><div className="circle" /><div className="circle" /></div>
        </button>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .button-group {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 9rem;
    height: 2.4rem;
    border-radius: 3rem;
    background-size: 300% 300%;
    background-image: linear-gradient(#212121, #212121),
      linear-gradient(137.48deg, #ffdb3b 10%, #fe53bb 45%, #8f51ea 67%, #0044ff 87%);
    background-origin: border-box;
    background-clip: content-box, border-box;
    border: double 3px transparent;
    cursor: pointer;
    overflow: hidden;
    animation: gradient_301 5s ease infinite;
    transition: transform 0.3s ease, filter 0.3s ease;
  }

  .btn:hover {
    transform: scale(1.05);
    filter: none; /* No blur */
  }

  .btn:active {
    border: double 3px #fe53bb;
    animation: none;
  }

  .content {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    position: relative;
    z-index: 3;
    color: white;
    font-weight: bold;
    transition: none; /* No blur effect */
  }

  .icon {
    width: 1rem;
    height: 1rem;
    stroke-width: 1.8;
    z-index: 3;
    transition: transform 0.3s ease-in-out;
  }

  strong {
    font-size: 10px;
    letter-spacing: 3px;
    text-shadow: none; /* No blur */
    transition: none;
  }

  .btn:hover .icon {
    transform: translateY(-2px);
  }

  #container-stars {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    border-radius: 3rem;
    overflow: hidden;
    pointer-events: none;
  }

  #stars {
    position: relative;
    width: 200rem;
    height: 200rem;
  }

  #stars::after,
  #stars::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(#ffffff 1px, transparent 1%);
    background-size: 50px 50px;
  }

  #stars::after {
    top: -10rem;
    left: -100rem;
    animation: animStarRotate 90s linear infinite;
  }

  #stars::before {
    top: 0;
    left: -50%;
    opacity: 0.4;
    animation: animStar 60s linear infinite;
  }

  #glow {
    position: absolute;
    display: flex;
    width: 9rem;
    z-index: 1;
    pointer-events: none;
  }

  .circle {
    width: 100%;
    height: 20px;
    filter: blur(0.8rem);
    animation: pulse_3011 4s infinite;
  }

  .circle:nth-of-type(1) {
    background: rgba(254, 83, 186, 0.3);
  }

  .circle:nth-of-type(2) {
    background: rgba(142, 81, 234, 0.3);
  }

  @keyframes animStar {
    from { transform: translateY(0); }
    to { transform: translateY(-135rem); }
  }

  @keyframes animStarRotate {
    from { transform: rotate(360deg); }
    to { transform: rotate(0); }
  }

  @keyframes gradient_301 {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes pulse_3011 {
    0% {
      transform: scale(0.75);
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
    }
    100% {
      transform: scale(0.75);
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
    }
  }
`;

export default Buttons;
