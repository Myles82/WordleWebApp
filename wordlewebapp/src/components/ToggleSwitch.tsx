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
        <input
          type="checkbox"
          checked={isOn}
          onChange={() => setIsOn(!isOn)}
          className="sr-only"
        />
       <div className={isOn ? 'bg-green-500 block w-14 h-8 rounded-md' : 'bg-gray-700 block w-14 h-8 rounded-md'}></div>
        <div
          className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-md transition ${
            isOn ? 'translate-x-6' : ''
          }`}
        ></div>
      </div>
      <span className="text-white">Show Word</span>
    </label>
  );
}
