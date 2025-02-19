import React from "react";
const LoadingPage = () => {
  return (
    <div className="w-screen bg-white dark:bg-black h-screen flex items-center  justify-center">
      <div className="w-8 h-8 border-4 border-t-transparent border-l-[#21212180] border-solid border-r-[#21212180] border-b-[#21212180] rounded-full animate-spin" />
    </div>
  );
};

export default LoadingPage;
