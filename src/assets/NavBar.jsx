import React from 'react';
import '../App.css'

import textLogo from './textlogo.svg';
import Button from './right/Button';
import Search from './Search';

const NavBar = () => {
  return (
    <div className="fullnavbar flex items-center p-2 gap-2 justify-between">
      <div className="left ">
        <div className='logo px-2 cursor-pointer'><img src={textLogo} alt="Logo" draggable="false" className="h-8 invert-25 " /></div>
      </div>
      <div className="middle flex-grow mx-4">
        <Search />
      </div>
      <div className="right  gap-2 flex p-2 items-center justify-center">
        <Button/>
      </div>
    </div>
  );
}

export default NavBar;
