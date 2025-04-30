'use client';
import React from 'react';

type ToggleSwitchProps = {
  isOn: boolean;
  setIsOn: (value: boolean) => void;
};

export default function ToggleSwitch({ isOn, setIsOn }: ToggleSwitchProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div className="relative">
        {/* Change isOn with switch */}
        <input
          type="checkbox"
          checked={isOn}
          onChange={() => setIsOn(!isOn)}
          className="sr-only"
        />
        {/* Back rectangle */}
       <div className={isOn ? 'bg-green-500 block w-14 h-8 rounded-md' : 'bg-[#4d4d4d] block w-14 h-8 rounded-md'}></div>
        {/* Square switch */}
        <div
          className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-md transition ${
            isOn ? 'translate-x-6' : ''
          }`}
        ></div>
      </div>
      {/* Text */}
      <span className="text-white">Show Word</span>
    </label>
  );
}
