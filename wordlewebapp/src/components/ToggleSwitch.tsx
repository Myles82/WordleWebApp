'use client'; // Required for components using useState in Next.js

import { useState } from 'react';

export default function ToggleSwitch() {
  const [isOn, setIsOn] = useState(false);

  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={isOn}
          onChange={() => setIsOn(!isOn)}
          className="sr-only"
        />
        <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
        <div
          className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
            isOn ? 'translate-x-6' : ''
          }`}
        ></div>
      </div>
      <span className="text-white">{isOn ? 'ON' : 'OFF'}</span>
    </label>
  );
}
