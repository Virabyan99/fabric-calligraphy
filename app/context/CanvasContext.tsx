'use client'

import { createContext, useContext, useRef, useState, useEffect } from 'react'
import { fabric } from 'fabric'

type CanvasContextType = {
  canvas: fabric.Canvas | null
  canvasRef: React.RefObject<HTMLCanvasElement>
  clearCanvas: () => void
  undo: () => void
  redo: () => void
}

const CanvasContext = createContext<CanvasContextType | null>(null)

export function CanvasProvider({ children }: { children: React.ReactNode }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null); // Allow null initially
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])
  


  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current)
      setCanvas(fabricCanvas)

      // Save the initial state
      setHistory([JSON.stringify(fabricCanvas)])

      fabricCanvas.on('object:added', () => {
        setRedoStack([]) // Clear redo stack on new actions
        setHistory((prev) => [...prev, JSON.stringify(fabricCanvas)])
      })

      // Proper cleanup
      return () => {
        fabricCanvas.dispose()
      }
    }
  }, [])

  useEffect(() => {
    if (canvas) {
      canvas.on('object:moving', (e) => {
        const obj = e.target;
        if (obj) {
          obj.left = Math.round(obj.left / 10) * 10;
          obj.top = Math.round(obj.top / 10) * 10;
        }
      });
    }
  }, [canvas]);
  
  

  const clearCanvas = () => {
    if (canvas) {
      canvas.clear()
      setHistory([])
      setRedoStack([])
    }
  }

  const undo = () => {
    if (history.length > 1) {
      // Remove the current state from history
      const prevState = history.pop()
      if (prevState) {
        setRedoStack((prev) => [...prev, prevState])
        const lastState = history[history.length - 1] || '{}' // Default to an empty state
        canvas?.loadFromJSON(lastState, () => canvas.renderAll())
      }
    } else {
      console.log('No more states to undo.')
    }
  }

  const redo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack.pop()
      if (nextState) {
        setHistory((prev) => [...prev, nextState])
        canvas?.loadFromJSON(nextState, () => canvas.renderAll())
      }
    } else {
      console.log('No more states to redo.')
    }
  }

  return (
    <CanvasContext.Provider
      value={{ canvas, canvasRef: canvasRef as React.RefObject<HTMLCanvasElement>, clearCanvas, undo, redo }}>
      {children}
    </CanvasContext.Provider>
  )
}

export function useCanvas() {
  const context = useContext(CanvasContext)
  if (!context) {
    throw new Error('useCanvas must be used within a CanvasProvider')
  }
  return context
}
