'use client';

import { useState } from 'react';

export function DemoMode() {
  const [isDemo, setIsDemo] = useState(true);

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <h3 className="font-semibold text-yellow-800 text-lg">🎮 Demo Mode Active</h3>
          <p className="text-yellow-700 text-sm">
            No wallet connection required! Experience confidential computing with simulated FHE operations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-700 font-medium">Live Demo</span>
        </div>
      </div>
    </div>
  );
}
