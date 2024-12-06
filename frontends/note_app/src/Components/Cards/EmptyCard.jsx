// import React from 'react';

export const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <img src={imgSrc} alt="No Any Notes" className="w-72 h-72 object-fill" />
      <p className="w-1/2 text-sm font-medium text-slate-600 text-center leading-7 mt-5">
        {message}
      </p>
    </div>
  );
};
