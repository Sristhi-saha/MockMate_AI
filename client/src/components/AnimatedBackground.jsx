import React from "react";

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#030118]">

      {/* Blob 1 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-400 opacity-40 rounded-full blur-3xl animate-blob"></div>

      {/* Blob 2 */}
      {/* <div className="absolute bottom-10 right-10 w-72 h-72 bg-pink-400 opacity-40 rounded-full blur-3xl animate-blob animation-delay-2000"></div> */}

      {/* Blob 3 */}
      {/* <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-400 opacity-40 rounded-full blur-3xl animate-blob animation-delay-4000"></div> */}

        {/* <div className="absolute top-7/4 left-1/2 w-72 h-72 bg-yellow-400 opacity-40 rounded-full blur-3xl animate-blob animation-delay-4000"></div> */}
    </div>
  );
};

export default AnimatedBackground;