'use client';

import { useCanvas } from './context/CanvasContext';
import Toolbar from './components/Toolbar';
import { Toaster } from '@/components/ui/toaster';


export default function Home() {
  const { canvasRef } = useCanvas();

  return (
    
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Fabric.js Calligraphy App</h1>
      
      <div className="relative border border-gray-300 bg-gray-50 " style={{ width: 700, height: 500 }}>
        <canvas
          ref={canvasRef}
          id="calligraphy-canvas"
          className="absolute inset-0"
          width="800"
          height="600"
          />
        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
            key={index}
            className="absolute top-0 h-full border-l border-gray-200"
            style={{ left: `${(index + 1) * (700 / 12)}px` }}
            />
          ))}
          {Array.from({ length: 8 }).map((_, index) => (
            <div
            key={index}
            className="absolute left-0 w-full border-t border-gray-200"
            style={{ top: `${(index + 1) * (500 / 8)}px` }}
            />
          ))}
        </div>
      </div>
      
      <Toolbar />
      <Toaster />
    </div>
  );
}
