import React from "react";

const AboutUs = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        className="relative bg-[#23272a] rounded-2xl shadow-2xl border-2 border-yellow-300 max-w-lg w-full p-8 text-center"
        style={{
          fontFamily: "'IM Fell English SC', serif",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-yellow-300 hover:text-yellow-400 text-2xl"
          aria-label="Close"
        >
          ×
        </button>
        <img
          src="/images/owl.png"
          alt="Owl"
          className="mx-auto mb-4 w-24 h-24 drop-shadow-lg"
        />
        <h2 className="text-3xl font-bold mb-2 text-yellow-200 drop-shadow">
          About Us
        </h2>
        <p className="text-lg text-yellow-100 mb-4">
          Welcome to <span className="font-bold text-yellow-300">The Owlery</span>!
        </p>
        <p className="text-base text-yellow-50 mb-4">
          We are <span className="font-semibold text-yellow-200">Tamara</span> and <span className="font-semibold text-yellow-200">Chen</span>—two devoted Harry Potter fans who believe magic is best when shared.
          <br /><br />
          Our dream is to create a cozy corner for every witch, wizard, and magical creature to share their stories, spells, . Whether you’re a Gryffindor, Slytherin, Hufflepuff, or Ravenclaw, you’re welcome to join our enchanted blog  !
        </p>
        <div className="flex justify-center gap-3 text-2xl mt-2 text-yellow-200">
       
        </div>
      </div>
    </div>
  );
};

export default AboutUs;