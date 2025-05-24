import React from 'react';
import owlImage from '/images/harrypottercar.png';

const FlyingOwl = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Container to set rotation center */}
      <div className="absolute top-1/2 left-1/2 w-0 h-0">
        <img
          src={owlImage}
          alt="Flying Owl"
          className="animate-fly-loop"
          style={{ animationDuration: '6s', width: '80px', height: '80px' }}
        />
      </div>
    </div>
  );
};

export default FlyingOwl;
