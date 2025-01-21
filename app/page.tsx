'use client'

import { useEffect, useRef } from 'react'
import { fabric } from 'fabric'

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current)

    // Set canvas dimensions
    canvas.setHeight(600)
    canvas.setWidth(800)

    // Add gridlines
    const gridSize = 50

    // Add vertical lines
    for (let i = 0; i < canvas.width / gridSize; i++) {
      const verticalLine = new fabric.Line(
        [i * gridSize, 0, i * gridSize, canvas.height],
        {
          stroke: '#ddd',
          strokeDashArray: [4, 4],
          selectable: false,
          evented: false,
        }
      )
      canvas.add(verticalLine)
    }

    // Add horizontal lines
    for (let i = 0; i < canvas.height / gridSize; i++) {
      const horizontalLine = new fabric.Line(
        [0, i * gridSize, canvas.width, i * gridSize],
        {
          stroke: '#ddd',
          strokeDashArray: [4, 4],
          selectable: false,
          evented: false,
        }
      )
      canvas.add(horizontalLine)
    }

    return () => {
      canvas.dispose()
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <h1 className="text-2xl font-bold text-gray-800 mb-5">
        Fabric.js Calligraphy App
      </h1>
      <canvas
        ref={canvasRef}
        id="calligraphy-canvas"
        className="border-2 border-gray-300 rounded-lg shadow-lg"
      />
    </div>
  )
}
