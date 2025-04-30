'use client';
import React from 'react';

type ToggleSwitchProps = {
  isOn: boolean;
  setIsOn: (value: boolean) => void;
};

export default function ToggleSwitch({ isOn, setIsOn }: ToggleSwitchProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div className="relative">
        {/* Hidden checkbox */}
        <input
          type="checkbox"
          checked={isOn}
          onChange={() => setIsOn(!isOn)}
          className="sr-only"
          aria-label="Toggle word visibility"
        />
        {/* Track */}
        <div className={`
          block w-12 h-6 sm:w-14 sm:h-8 rounded-md transition-colors duration-200
          ${isOn ? 'bg-green-600' : 'bg-[#4d4d4d]'}
        `}></div>
        {/* Thumb */}
        <div
          className={`
            absolute top-0.5 left-0.5 sm:top-1 sm:left-1
            bg-white w-5 h-5 sm:w-6 sm:h-6 rounded-md
            transition-transform duration-200
            ${isOn ? 'translate-x-6 sm:translate-x-6.25' : ''}
          `}
        ></div>
      </div>
      {/* Label */}
      <span className="text-white text-sm sm:text-base">Show Word</span>
    </label>
  );
}